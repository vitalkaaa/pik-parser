from mongoengine import Document, StringField, ListField, EmbeddedDocumentField, BooleanField, EmbeddedDocument, DictField, \
    IntField, ReferenceField, DateTimeField


class Project(Document):
    name = StringField(required=True, primary_key=True)
    url = StringField()


class House(Document):
    project = ReferenceField(Project)
    address = StringField(required=True, primary_key=True)
    settlement_date = StringField()
    title = StringField(required=True)


class Flat(Document):
    id = IntField(required=True, primary_key=True)
    section = IntField(required=True)
    house = ReferenceField(House)
    project = ReferenceField(Project)
    area = IntField(required=True)
    floor = IntField(required=True)
    price = IntField(required=True)
    price_per_m = IntField(required=True)
    rooms = IntField(required=True)
    status = StringField(required=True)

