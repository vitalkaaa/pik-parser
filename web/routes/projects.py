
import json

from flask import Blueprint, render_template
from web.models import Flats, Projects

bp = Blueprint("projects", __name__)


@bp.route('/api/projects')
def api_projects():
    return json.dumps(dict(data=Projects.get_contexts()))


@bp.route('/api/flats')
def api_flats():
    return json.dumps(dict(data=Flats.get_contexts()))


@bp.route('/api/flats/<int:project_id>')
def api_flats_by_project(project_id):
    return json.dumps(dict(data=Flats.get_contexts(project_id=project_id)))


@bp.route('/projects')
def projects():
    return render_template('projects.html')


@bp.route('/projects/<int:project_id>')
def flats(project_id):
    project = Projects.objects(project_id=project_id)[0]
    if project is not None:
        return render_template('flats.html', project_id=project_id)
