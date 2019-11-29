from pprint import pprint

import requests
from models import *
from mongoengine import connect


def get_projects():
    projects_json = requests.get('https://api.pik.ru/v1/block').json()
    for project in projects_json:
        flats_json = requests.get(f"https://api.pik.ru/v2/flat?block_id={project['id']}&type=1,2&page=1").json()

        if 'error' not in flats_json and flats_json.get('count', 0) > 0:
            yield {
                'id': project['id'],
                'name': project['name'],
                'flats': flats_json.get('count', 0),
            }


def get_flats(project):
    print(project)
    for page in range(1, project['flats'] // 50 + 2):
        flats_json = requests.get(f"https://api.pik.ru/v2/flat?block_id={project['id']}&type=1,2&page={page}").json()
        for flat in flats_json['flats']:
            yield {
                'id': flat['id'],
                'area': flat['area'],
                'floor': flat['floor'],
                'price': flat['price'],
                'rooms': flat['rooms'] if flat['rooms'] != 'studio' else 0,
                'status': flat['status'],
                'price_per_m': flat['price'] / flat['area'],
                'address': flat['bulk']['address'],
                'title': flat['bulk']['title'],
                'settlement_date': flat['bulk']['settlement_date'],
                'section': flat['section']['number']
            }


if __name__ == '__main__':
    connect('pik')

    for p in get_projects():
        project = Project(name=p['name'])
        project.save()
        print(p)

        for f in get_flats(p):
            print(f)
            house = House(project=project, address=f['address'],
                          settlement_date=f['settlement_date'], title=f['title'])
            house.save()

            flat = Flat(id=f['id'], section=f['section'], house=house, project=project,
                        area=f['area'], floor=f['floor'], price=f['price'],
                        price_per_m=f['price_per_m'], rooms=f['rooms'], status=f['status'])
            flat.save()
            print(f)
