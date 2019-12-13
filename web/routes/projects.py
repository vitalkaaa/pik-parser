
import json
import logging

from flask import Blueprint, render_template, request

from web.models import Flats, Projects
from web.utils import get_logger, nocache

bp = Blueprint("projects", __name__)
log = get_logger('app')


@bp.route('/api/projects')
def api_projects():
    """Информация о проектах"""
    return json.dumps(Projects.get_contexts())


@bp.route('/api/projects/<int:project_id>')
def api_flats_by_project(project_id):
    """Информация о квартирах в проекте"""
    return json.dumps(Flats.get_contexts(project_id=project_id))


@bp.route('/api/projects/<int:project_id>/stats')
def api_flats_stats(project_id):
    """Информация о квартирах в проекте"""
    return json.dumps(Flats.get_stats(project_id=project_id))


@bp.route('/projects')
@bp.route('/')
@nocache
def projects():
    """Рендер страницы проектов"""
    log.info(f'{request.remote_addr} /projects')
    return render_template('projects.html')


@bp.route('/projects/<int:project_id>')
@nocache
def flats(project_id):
    """Рендер страницы квартир проекта"""
    log.info(f'{request.remote_addr} /projects/{project_id}')
    project = Projects.objects(project_id=project_id)[0]
    if project is not None:
        return render_template('flats.html', project_id=project_id)
