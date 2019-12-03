import json
from datetime import datetime

from flask_mongoengine import Document
from mongoengine import DateTimeField, StringField, IntField, ListField, DictField


class Projects(Document):
    project_id = IntField(required=True, primary_key=True)
    name = StringField(required=True)
    url = StringField(required=True)
    found_at = DateTimeField(default=datetime.utcnow())
    project_img = StringField()

    checks = ListField(DictField(), required=True, default=list())

    meta = {'strict': False}

    @staticmethod
    def create(projectd, check):
        projectd.pop('flats')
        Projects(**projectd, checks=[check], found_at=check['check_at']).save()

    @staticmethod
    def up_to_date(project, check):
        project.checks.append(check)
        project.save()

    @staticmethod
    def create_or_update(projectd):
        now = datetime.utcnow()
        p = Projects.objects(project_id=projectd['project_id']).first()
        check = dict(check_at=now, flats=projectd['flats'])

        if p is None:
            Projects.create(projectd=projectd, check=check)
            return {'status': 'created'}
        else:
            Projects.up_to_date(project=p, check=check)
            return {'status': 'updated'}

    @staticmethod
    def get_contexts():
        contexts = list()
        for project in Projects.objects.all():
            contexts.append({
                'project_id': project.project_id,
                'name': project.name,
                'url': project.url,
                'project_img': project.project_img,
                'last_check_at': str(project['checks'][-1]['check_at'].isoformat()),
                'last_flats': project['checks'][-1]['flats'],
                'flats': [check['flats'] for check in project['checks']],
                'dates': [str(check['check_at'].isoformat()) for check in project['checks']],
            })
        return contexts

    @staticmethod
    def get_context(project_id):
        project = Projects.objects(project_id=project_id).first()
        return {
            'project_id': project_id,
            'name': project.name,
            'url': project.url,
            'project_img': project.project_img,
            'last_check_at': str(project['checks'][-1]['check_at'].isoformat()),
            'last_flats': project['checks'][-1]['flats'],
            'flats': [check['flats'] for check in project['checks']],
            'dates': [check['dates'] for check in project['checks']],
        }
