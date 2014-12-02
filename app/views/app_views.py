from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render

import json

from app.models import CensusHistory as hist, CountyData as cd, StateCensusHistory as sc
from app.models import FamilyData as fam, HousingData as house
from app.models import PopulationData as pop, DemographicData as demo

@ensure_csrf_cookie
def index(request):
    return render(request, "app/index.html")

@csrf_protect
def getCountyData(request):
    countyFips = request.POST.get("fips", None)
    print countyFips

    if countyFips is not None:
        countyData = cd.objects.filter(fips = countyFips)

        return HttpResponse(json.dumps({"success" : "true", "data" : serializers.serialize("json", countyData)}))
    else:
        return HttpResponse(json.dumps({"success" : "false", "message" : "%s fips number is invalid" % (countyFips)}))

@csrf_protect
def getCensusYearData(request):
    censusYear = request.POST.get("year", None)

    if censusYear is not None:
        data = sc.objects.filter(year = censusYear)
        return HttpResponse(json.dumps({"success" : "true", "data" : serializers.serialize("json", data)}))

    else:
        return HttpResponse(json.dumps({"success" : "false", "message" : "%s year number is invalid" % (censusYear)}))


