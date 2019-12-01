from datetime import datetime
from pprint import pprint
import logging
import requests
import sys

from mongoengine import connect

from models.flats import Flats, FlatCheck
from models.projects import Projects, ProjectCheck


class Parser:
    PROJECTS_API_URL = 'https://api.pik.ru/v1/block'
    FLATS_API_URL = "https://api.pik.ru/v2/flat?block_id=%s&type=1,2&page=%s"
    LOGGER_FORMAT = '%(asctime)s:%(name)s:%(levelname)s - %(message)s'

    def __init__(self, enable_logging=True):
        self.projects = []
        self.flats = []

        self.log = logging.getLogger('PARSER')
        if enable_logging:
            self.log.setLevel(logging.INFO)
            handler = logging.StreamHandler(sys.stdout)
            handler.setLevel(logging.INFO)
            formatter = logging.Formatter(self.LOGGER_FORMAT)
            handler.setFormatter(formatter)
            self.log.addHandler(handler)

    def __download_projects(self):
        self.log.info('Getting projects...')

        projects_json = requests.get(self.PROJECTS_API_URL).json()
        start_page = 1

        for project in projects_json:
            flats_json = requests.get(self.FLATS_API_URL % (project['id'], start_page)).json()
            if 'error' not in flats_json and flats_json.get('count', 0) > 0:
                self.projects.append({
                    'project_id': project['id'],
                    'url': 'https://pik.ru' + project['url'],
                    'name': project['name'],
                    'last_flats': flats_json.get('count', 0),
                })

        self.log.info(f'Got {len(self.projects)} projects')

    def __download_flats(self):
        self.log.info('Getting flats...')

        for project in self.projects:
            for page in range(1, project['last_flats'] // 50 + 2):
                flats_json = requests.get(self.FLATS_API_URL % (project['project_id'], page)).json()
                for flat in flats_json['flats']:
                    self.flats.append({
                        'flat_id': flat['id'],
                        'project_id': flat['block_id'],
                        'area': flat['area'],
                        'floor': flat['floor'],
                        'last_price': flat['price'],
                        'rooms': flat['rooms'] if flat['rooms'] != 'studio' else 0,
                        'last_status': flat['status'],
                        'address': flat['bulk']['address'],
                        'house': flat['bulk']['title'],
                        'settlement_date': flat['bulk']['settlement_date'],
                        'section_id': flat['section']['number']
                    })

        self.log.info(f'Got {len(self.flats)} flats')

    def __store_projects(self):
        now = datetime.utcnow()
        new_projects = 0
        updated_projects = 0

        for project in self.projects:
            p = Projects.objects(project_id=project['project_id']).first()
            check = ProjectCheck(check_at=now, flats=project['last_flats'])

            if p is None:
                Projects.create(projectd=project, check=check)
                new_projects += 1
            else:
                p.checks.append(check)
                p.last_check_at = now
                p.save()
                updated_projects += 1

        self.log.info(f'Projects: updated={updated_projects}, new={new_projects}, all={Projects.objects.count()}')

    def __store_flats(self):
        now = datetime.utcnow()
        new_flats = 0
        updated_flats = 0

        for flat in self.flats:
            p = Projects.objects(project_id=flat.pop('project_id')).first()
            f = Flats.objects(flat_id=flat['flat_id']).first()
            check = FlatCheck(check_at=now, status=flat['last_status'], price=flat['last_price'])

            if f is None:
                Flats.create(flatd=flat, check=check, project=p)
                new_flats += 1
            else:
                f.checks.append(check)
                f.last_check_at = now
                f.save()
                updated_flats += 1

        self.log.info(f'Flats: updated={updated_flats}, new={new_flats}, all={Flats.objects.count()}')

    def run(self):
        self.__download_projects()
        self.__download_flats()

    def store(self):
        self.__store_projects()
        self.__store_flats()


if __name__ == '__main__':
    connect('pik')

    parser = Parser()
    parser.run()
    parser.store()
