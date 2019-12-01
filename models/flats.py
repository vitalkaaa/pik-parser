from datetime import datetime

from mongoengine import Document, IntField, ReferenceField, DateTimeField, \
    StringField, EmbeddedDocument, EmbeddedDocumentListField

from models.projects import Projects


class FlatCheck(EmbeddedDocument):
    check_at = DateTimeField(required=True)
    status = StringField(required=True)
    price = IntField(required=True)


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

    last_check_at = DateTimeField(required=True)
    last_price = IntField(required=True)
    last_status = StringField(required=True)

    checks = EmbeddedDocumentListField(FlatCheck, default=list())

    @staticmethod
    def create(flatd, check, project):
        now = datetime.utcnow()

        if flatd.get('settlement_date'):
            flatd['settlement_date'] = datetime.strptime(flatd.pop('settlement_date'), '%Y-%m-%d')

        Flats(**flatd, project=project, checks=[check], found_at=now, last_check_at=now).save()
