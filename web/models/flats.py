from datetime import datetime
from pprint import pprint

from flask_mongoengine import Document
from mongoengine import IntField, ReferenceField, DateTimeField, \
    StringField, ListField, DictField

from web.models.projects import Projects


class Flats(Document):
    flat_id = IntField(required=True, primary_key=True)
    project = ReferenceField(Projects, required=True)
    section_id = IntField(required=True)
    area = IntField(required=True)
    floor = IntField(required=True)
    rooms = IntField(required=True)
    found_at = DateTimeField(required=True)
    address = StringField(required=True)
    settlement_date = DateTimeField()
    house = StringField(required=True)
    flat_plan_img = StringField()

    checks = ListField(DictField(), required=True, default=list())

    @staticmethod
    def create(flatd, check):
        project = Projects.objects(project_id=flatd.pop('project_id')).first()

        flatd.pop('last_price')
        flatd.pop('last_status')
        if flatd.get('settlement_date') and flatd.get('settlement_date') != '0':
            flatd['settlement_date'] = datetime.strptime(str(flatd.pop('settlement_date')), '%Y')
        else:
            flatd['settlement_date'] = datetime.utcnow()

        Flats(**flatd, project=project, checks=[check], found_at=check['check_at']).save()

    @staticmethod
    def up_to_date(flat, check):
        flat.checks.append(check)
        flat.save()

    @staticmethod
    def create_or_update(flatd):
        now = datetime.utcnow()
        f = Flats.objects(flat_id=flatd['flat_id']).first()
        check = dict(check_at=now, status=flatd['last_status'], price=flatd['last_price'])

        if f is None:
            Flats.create(flatd=flatd, check=check)
            return {'status': 'created'}
        else:
            Flats.up_to_date(flat=f, check=check)
            return {'status': 'updated'}

    @staticmethod
    def get_contexts(project_id=None):
        contexts = list()

        if project_id is not None:
            flats = Flats.objects(project=project_id).all()
        else:
            flats = Flats.objects().all()

        project_context = Projects.get_context(project_id)['data']
        for flat in flats:
            contexts.append({
                'flat_id': flat.flat_id,
                'project': project_context,
                'section_id': flat.section_id,
                'area': flat.area,
                'floor': flat.floor,
                'rooms': flat.rooms,
                'address': flat.address,
                'settlement_date': str(flat.settlement_date.date()) if flat.settlement_date else '',
                'house': flat.house,
                'flat_plan_img': flat.flat_plan_img,
                'last_price': flat.checks[-1]['price'],
                'last_price_per_m': flat.checks[-1]['price']/flat.area,
                'last_check_at': str(flat['checks'][-1]['check_at'].date()),
                'last_status': flat['checks'][-1]['status'],
                'dates': [str(check['check_at'].date()) for check in flat['checks']],
                'prices': [check['price'] for check in flat['checks']],
                'statuses': [check['status'] for check in flat['checks']],
            })
        return dict(data=contexts)

    @staticmethod
    def get_context(flat_id):
        flat = Flats.objects(flat_id=flat_id).all()
        project_context = Projects.get_context(flat.project)['data']
        return dict(data={
                'flat_id': flat.flat_id,
                'project': project_context,
                'section_id': flat.section_id,
                'area': flat.area,
                'floor': flat.floor,
                'rooms': flat.rooms,
                'address': flat.address,
                'settlement_date': str(flat.settlement_date.isoformat()) if flat.settlement_date else '',
                'house': flat.house,
                'flat_plan_img': flat.flat_plan_img,
                'last_price': flat.checks[-1]['price'],
                'last_check_at': str(flat['checks'][-1]['check_at'].isoformat()),
                'last_status': flat['checks'][-1]['status'],
                'dates': [str(check['check_at'].isoformat()) for check in flat['checks']],
                'prices': [check['price'] for check in flat['checks']],
                'statuses': [check['status'] for check in flat['checks']],
            })

    @staticmethod
    def get_stats(project_id):
        flat_statistic = dict()
        for i in ['0', '1', '2', '3', '4']:
            prices = dict()
            flat_statistic[i] = {'dates': [], 'price': [], 'count': 0}

            for flat in Flats.objects(project=project_id, rooms=int(i)).all():
                flat_statistic[i]['count'] += 1
                for c in flat.checks:
                    date = str(c['check_at'].date())
                    prices.setdefault(date, list())
                    prices[date].append(c['price']/flat.area)

            for p in prices:
                flat_statistic[i]['dates'].append(p)
                flat_statistic[i]['price'].append(sum(prices[p]) / len(prices[p]))

        return dict(statistics=flat_statistic)

