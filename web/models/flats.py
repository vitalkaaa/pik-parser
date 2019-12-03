from datetime import datetime

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
        if flatd.get('settlement_date'):
            flatd['settlement_date'] = datetime.strptime(flatd.pop('settlement_date'), '%Y-%m-%d')
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
