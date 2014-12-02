"""
WSGI config for dataviz project.
"""
import os, sys

sys.path.append("/home/vagrant/django")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "dataviz.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# django.core.handlers.wsgi
#application=django.core.handlers.wsgi.WSGIHandler()
