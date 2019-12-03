import json

from flask import Blueprint, render_template
from web.models import Flats, Projects

bp = Blueprint("projects", __name__)


@bp.route('/projects')
def projects():
    return render_template('projects.html')


@bp.route('/api/projects')
def api_projects():
    return json.dumps(dict(data=Projects.get_contexts()))


@bp.route('/projects/<int:project_id>')
def flats(project_id):
    project = Projects.objects(project_id=project_id)[0]
    if project is not None:
        return render_template('flats.html', flats=Flats.objects(project=project).all())
