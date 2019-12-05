
import json

from flask import Blueprint, render_template

from web.models import Flats, Projects

bp = Blueprint("projects", __name__)


@bp.route('/api/projects')
def api_projects():
    """Информация о проектах"""
    return json.dumps(Projects.get_contexts())


@bp.route('/api/flats')
def api_flats():
    """Информация о всех квартирах"""
    return json.dumps(Flats.get_contexts())


@bp.route('/api/flats/<int:project_id>')
def api_flats_by_project(project_id):
    """Информация о квартирах в проекте"""
    return json.dumps(Flats.get_contexts(project_id=project_id))


@bp.route('/projects')
@bp.route('/')
def projects():
    """Рендер страницы проектов"""
    return render_template('projects.html')


@bp.route('/projects/<int:project_id>')
def flats(project_id):
    """Рендер страницы квартир проекта"""
    project = Projects.objects(project_id=project_id)[0]
    if project is not None:
        return render_template('flats.html', project_id=project_id)
