from datetime import datetime

from mongoengine import DateTimeField, StringField, Document, IntField, EmbeddedDocument, EmbeddedDocumentListField


class ProjectCheck(EmbeddedDocument):
    check_at = DateTimeField(required=True)
    flats = IntField(required=True)


class Projects(Document):
    project_id = IntField(required=True, primary_key=True)
    name = StringField(required=True)
    url = StringField(required=True)
    found_at = DateTimeField(default=datetime.utcnow())
    last_check_at = DateTimeField(required=True, default=datetime.utcnow())
    last_flats = IntField(required=True)

    checks = EmbeddedDocumentListField(ProjectCheck, required=True, default=list())

    @staticmethod
    def create(projectd, check):
        now = datetime.utcnow()

        Projects(**projectd, checks=[check], found_at=now, last_check_at=now).save()
