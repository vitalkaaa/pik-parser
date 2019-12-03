import json
from datetime import datetime

from mongoengine import DateTimeField, StringField, IntField, EmbeddedDocument, EmbeddedDocumentListField, ListField, DictField
from flask_mongoengine import Document


class ProjectCheck(EmbeddedDocument):
    check_at = DateTimeField(required=True)
    flats = IntField(required=True)


class Projects(Document):
    project_id = IntField(required=True, primary_key=True)
    name = StringField(required=True)
    url = StringField(required=True)
    found_at = DateTimeField(default=datetime.utcnow())
    project_img = StringField(required=True)
    last_check_at = DateTimeField(required=True, default=datetime.utcnow())
    last_flats = IntField(required=True)

    checks = ListField(DictField(), required=True, default=list())

    @staticmethod
    def create(projectd, check):
        print(projectd.get('project_img'))
        Projects(**projectd, checks=[check], found_at=check['check_at'], last_check_at=check['check_at']).save()

    @staticmethod
    def create_or_update(projectd):
        now = datetime.utcnow()
        p = Projects.objects(project_id=projectd['project_id']).first()
        check = dict(check_at=now, flats=projectd['last_flats'])

        if p is None:
            Projects.create(projectd=projectd, check=check)
            return {'status': 'created'}
        else:
            p.checks.append(check)
            p.last_check_at = check['check_at']
            p.last_flats = check['flats']
            p.save()
            return {'status': 'updated'}

    @staticmethod
    def get_all_list():
        result = list()
        for project in Projects.objects().all():
            d = json.loads(project.to_json())
            d['checks'] = [c.last_check_at for c in d['checks']]
            result.append(d)
        return result
