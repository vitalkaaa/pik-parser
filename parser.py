import logging
import sys
from datetime import datetime
from pprint import pprint

import requests
from mongoengine import connect

from web.models import Projects, Flats


class Parser:
    PROJECTS_API_URL = 'https://api.pik.ru/v1/block?images=1&types=1,2'
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
                    'project_img': project['img']['100'],
                    'flats': flats_json.get('count', 0),
                })

        self.log.info(f'Got {len(self.projects)} projects')

    def __download_flats(self):
        self.log.info('Getting flats...')

        for project in self.projects:
            for page in range(1, project['flats'] // 50 + 2):
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
                        'section_id': flat['section']['number'],
                        'flat_plan_img': flat['layout']['flat_plan_png'] if flat['layout']['flat_plan_png'] else ''
                    })

        self.log.info(f'Got {len(self.flats)} flats')

    def __store_projects(self):
        created_projects = 0
        updated_projects = 0

        for project in self.projects:
            status = Projects.create_or_update(projectd=project)['status']
            if status == 'created':
                created_projects += 1
            elif status == 'updated':
                updated_projects += 1

        self.log.info(f'Projects: updated={updated_projects}, new={created_projects}, all={Projects.objects.count()}')

    def __store_flats(self):
        created_flats = 0
        updated_flats = 0

        for flat in self.flats:
            status = Flats.create_or_update(flat)['status']
            if status == 'created':
                created_flats += 1
            elif status == 'updated':
                updated_flats += 1

        self.log.info(f'Flats: updated={updated_flats}, new={created_flats}, all={Flats.objects.count()}')

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
