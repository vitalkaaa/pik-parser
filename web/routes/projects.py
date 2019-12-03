from flask import Blueprint, render_template, json
from web.models import Flats, Projects

bp = Blueprint("projects", __name__)


@bp.route('/projects')
def projects():
    return render_template('projects.html', Projects=Projects)


@bp.route('/api/projects')
def get_projects():
    projects = list()
    for project in Projects.objects().all():
        d = {
            'project_id': project.project_id,
            'name': project.name,
            'url': project.url,
            'found_at': project.found_at.isoformat(),
            'project_img': project.project_img,
            'last_check_at': project.last_check_at.isoformat(),
            'last_flats': project.last_flats,

        }
        check_at_list = flats_list = []

        for check in project.checks:
            check_at_list.append(check['check_at'].isoformat())
            flats_list.append(check['flats'])
        d['check_at_list'] = check_at_list
        d['flats_list'] = flats_list
        projects.append(d)

    return json.dumps(projects)


@bp.route('/projects/<int:project_id>')
def flats(project_id):
    project = Projects.objects(project_id=project_id)[0]
    if project is not None:
        return render_template('flats.html', flats=Flats.objects(project=project).all())
