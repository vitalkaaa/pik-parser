from flask import Blueprint
from web.models import Flats, Projects

bp = Blueprint("projects", __name__)


@bp.route('/projects')
def test():
    html = ''
    for project in Projects.objects().all():
        html += f'{project.name} {project.url} {project.found_at} {project.last_flats}<br>'
    return html
