from app.models import StateCensusHistory as hist, CountyData as cd
import json

class Calculations:

    def __init__(self):
        self.counties = cd.objects.all().values("county_name", "area")
        self.population = hist.objects.all().values("year", "population").order_by("year")
        

    def calculateDensity():
        yearData = {}

        for y in self.population:
            data = json.loads(y["population"])
            yearData[y["year"]] = {}
            for c in self.counties:
                if c["county_name"] != "state":
                    yearData[y["year"]][c["county_name"]] = data[c["county_name"]] / c["area"]

        for y in yearData:
            obj = hist.objects.get(year = y)
            obj.density = yearData[y]
            obj.save()


        

