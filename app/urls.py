from django.conf import settings
from django.conf.urls import patterns, url

from django.views import generic
from django.views.generic import RedirectView
from app.views import app_views


urlpatterns = patterns("",
    url(r'^$', app_views.index),
)