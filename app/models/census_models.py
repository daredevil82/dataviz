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

class CountyData(models.Model):
    id = models.AutoField(primary_key = True)

    county_name = models.CharField(max_length = 30, db_column = "NAME")
    state_name = models.CharField(max_length = 40, db_column = "STATE_NAME")

    fips = models.CharField(max_length = 10, db_column = "FIPS")
    county_fips = models.CharField(max_length = 10, db_column = "CNTY_FIPS")
    state_fips = models.CharField(max_length = 10, db_column = "STATE_FIPS")

    oid = models.IntegerField(db_column = "OID")
    other = models.IntegerField(db_column = "OTHER")
    area = models.FloatField(db_column = "SQMI")

    def __unicode__(self):
        return u'%s, %s\nfips: %s\n' % (self.county_name, self.state_name, self.fips)

    class Meta:
        app_label = "app"
        db_table = "county_data"

class FarmData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData)

    farm_count_2007 = models.FloatField()
    farm_avg_size_2007 = models.FloatField()
    crop_acres_2007 = models.FloatField()
    avg_sale_2007 = models.FloatField( )

    def __unicode__(self):
        return u'%s Farm Data' % (self.county.county_name)

    class Meta:
        app_label = "app"
        db_table = "county_farm_data"

class HousingData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData)

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
    county = models.ForeignKey(CountyData)

    households = models.IntegerField()
    single_male = models.IntegerField()
    single_female = models.IntegerField()
    avg_household_size = models.FloatField()

    married_child = models.IntegerField()
    married__no_child = models.IntegerField()
    mhh_child = models.IntegerField()
    fhh_child = models.IntegerField()
    families = models.IntegerField()
    avg_family_size = models.FloatField()

    housing_units = models.IntegerField()
    owner_occupied = models.IntegerField()
    rental_occupied = models.IntegerField()
    vacant = models.IntegerField()

    def __unicode__(self):
        return u'%s Family Data' % (self.county.county_name)

    class Meta:
        app_label = "app"
        db_table = "county_family_data"

class PopulationData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData)

    pop_2000 = models.IntegerField()
    pop_2007 = models.IntegerField()
    pop_2000_sqmi = models.FloatField()
    pop_2007_sqmi = models.FloatField()

    males = models.IntegerField()
    females = models.IntegerField()

    median_age = models.FloatField()
    median_age_male = models.FloatField()
    median_age_female = models.FloatField()

    age_under_5 = models.IntegerField()
    age_5_17 = models.IntegerField()
    age_18_21 = models.IntegerField()
    age_22_29 = models.IntegerField()
    age_30_39 = models.IntegerField()
    age_40_49 = models.IntegerField()
    age_50_64 = models.IntegerField()
    age_65_older = models.IntegerField()

    def __unicode__(self):
        return u'%s\n2000 Population:\t%d\n2007 Population\t%d\n\n' % (self.county.county_name, 
            self.pop_2000, self.pop_2007)

    class Meta:
        app_label = "app"
        db_table = "county_pop_data"

class DemographicData(models.Model):
    id = models.AutoField(primary_key = True)
    county = models.ForeignKey(CountyData)

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




