from django.http import HttpResponse
from django.shortcuts import render
import json


def index(request):
    return render(request, "app/index.html")