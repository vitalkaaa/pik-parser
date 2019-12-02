from mongoengine import connect
from models import Flats, Projects
import json

if __name__ == '__main__':
    connect('pik')

    r = Projects.objects[:1][0]
    print(r.name)

    for i in Flats.objects().filter(project=r).all():
        print(json.loads(i.to_json()))

