from __future__ import unicode_literals
from django.db import models

class CensusHistory(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 200L, db_column = "place_name")
    county = models.CharField(max_length = 25L)
    year = models.IntegerField()
    pop = models.IntegerField()

    class Meta:
        app_label = "app"
        db_table = "census_history"

class StateCensusHistory(models.Model):
    id = models.AutoField(primary_key = True)
    year = models.IntegerField()
    population = models.TextField()
    density = models.TextField()
    pop_change = models.TextField()

    def __unicode__(self):
        return "%d, %s\n" % (self.year, self.population)

    class Meta:
        app_label = "app"
        db_table = "state_census_history"


class CountyData(models.Model):
    id = models.AutoField(primary_key = True)

    county_name = models.CharField(max_length = 30)
    state_name = models.CharField(max_length = 40)

    fips = models.CharField(max_length = 10)
    county_fips = models.CharField(max_length = 10)
    state_fips = models.CharField(max_length = 10)

    oid = models.IntegerField()
    other = models.IntegerField()
    area = models.FloatField()

    def __unicode__(self):
        return u'%s, %s\nfips: %s\n' % (self.county_name, self.state_name, self.fips)

    class Meta:
        app_label = "app"
        db_table = "county_data"

class HousingData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData, unique = True)
    census_year = models.IntegerField()

    housing_units = models.IntegerField()
    owner_occupied = models.IntegerField()
    rental_occupied = models.IntegerField()
    vacant = models.IntegerField()

    def __unicode__(self):
        return u'%s Housing Data' % (self.county.county_name)

    class Meta:
        app_label = "app"
        db_table = "county_housing_data"

class FamilyData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData, unique = True)
    census_year = models.IntegerField()

    households = models.IntegerField()
    single_male = models.IntegerField()
    single_female = models.IntegerField()
    avg_household_size = models.FloatField()

    married_child = models.IntegerField()
    married_no_child = models.IntegerField()
    mhh_child = models.IntegerField()
    fhh_child = models.IntegerField()
    families = models.IntegerField()
    avg_family_size = models.FloatField()

    def __unicode__(self):
        return u'%s Family Data' % (self.county.county_name)

    class Meta:
        app_label = "app"
        db_table = "county_family_data"

class PopulationData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData, unique = True)
    census_year = models.IntegerField()

    pop = models.IntegerField()
    pop_density = models.FloatField()

    males = models.IntegerField()
    females = models.IntegerField()

    median_age = models.FloatField()
    median_age_male = models.FloatField()
    median_age_female = models.FloatField()

    def __unicode__(self):
        return u'%s %d\nPopulation:\t%d\n' % (self.county.county_name, self.census_year,
            self.pop)

    class Meta:
        app_label = "app"
        db_table = "county_pop_data"

class DemographicData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData, unique = True)
    census_year = models.IntegerField()

    race_white = models.IntegerField()
    race_black = models.IntegerField()
    race_hispanic = models.IntegerField()
    race_asian = models.IntegerField()
    race_multi = models.IntegerField()
    race_hawaiian_pi = models.IntegerField()
    race_american_indian = models.IntegerField()

    def __unicode__(self):
        return u'%s Demographic Data' % (self.county.county_name)

    class Meta:
        app_label = "app"
        db_table = "county_demographic_data"




