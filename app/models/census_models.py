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

    pop_2000 = models.IntegerField(db_column = "POP2000")
    pop_2007 = models.IntegerField(db_column = "POP2007")
    pop_2000_sqmi = models.FloatField(db_column = "POP00_SQMI")
    pop_2007_sqmi = models.FloatField(db_column = "POP07_SQMI")
    area = models.FloatField(db_column = "SQMI")

    oid = models.IntegerField(db_column = "OID")
    other = models.IntegerField(db_column = "OTHER")

    males = models.IntegerField(db_column = "MALES")
    females = models.IntegerField(db_column = "FEMALES")

    median_age = models.FloatField(db_column = "MED_AGE")
    median_age_male = models.FloatField(db_column = "MED_AGE_M")
    median_age_female = models.FloatField(db_column = "MED_AGE_F")

    households = models.IntegerField("HOUSEHOLDS")
    single_male = models.IntegerField(db_column = "HSEHLD_1_M")
    single_female = models.IntegerField(db_column = "HSEHLD_1_F")
    avg_household_size = models.FloatField(db_column = "AVE_HH_SZ")

    married_child = models.IntegerField(db_column = "MARHH_CHD")
    married__no_child = models.IntegerField(db_column = "MARHH_NO_C")
    mhh_child = models.IntegerField(db_column = "MHH_CHILD")
    fhh_child = models.IntegerField(db_column = "FHH_CHILD")
    families = models.IntegerField(db_column = "FAMILIES")
    avg_family_size = models.FloatField(db_column = "AVE_FAM_SZ")

    housing_units = models.IntegerField(db_column = "HSE_UNITS")
    owner_occupied = models.IntegerField(db_column = "OWNER_OCC")
    rental_occupied = models.IntegerField(db_column = "RENTER_OCC")
    vacant = models.IntegerField(db_column = "VACANT")
    
    age_under_5 = models.IntegerField(db_column = "AGE_UNDER5")
    age_5_17 = models.IntegerField(db_column = "AGE_5_17")
    age_18_21 = models.IntegerField(db_column = "AGE_18_21")
    age_22_29 = models.IntegerField(db_column = "AGE_22_29")
    age_30_39 = models.IntegerField(db_column = "AGE_30_39")
    age_40_49 = models.IntegerField(db_column = "AGE_40_49")
    age_50_64 = models.IntegerField(db_column = "AGE_50_64")
    age_65_older = models.IntegerField(db_column = "AGE_65_UP")

    race_white = models.IntegerField(db_column = "WHITE")
    race_black = models.IntegerField(db_column = "BLACK")
    race_hispanic = models.IntegerField(db_column = "HISPANIC")
    race_asian = models.IntegerField(db_column = "ASIAN")
    race_multi = models.IntegerField(db_column = "MULT_RACE")
    race_hawaiian_pi = models.IntegerField(db_column = "HAWN_PI")
    race_american_indian = models.IntegerField(db_column = "AMERI_ES")

    farm_count_2007 = models.FloatField(db_column = "NO_FARMS97")
    farm_avg_size_2007 = models.FloatField(db_column = "AVG_SIZE97")
    crop_acres_2007 = models.FloatField(db_column = "CROP_ACR97")
    avg_sale_2007 = models.FloatField(db_column = "AVG_SALE97")

    def __unicode__(self):
        return u'%s, %s\n2007 Population: %d\n' % (self.county_name, self.state_name, self.pop_2007)

    class Meta:
        app_label = "app"
        db_table = "county_data"



