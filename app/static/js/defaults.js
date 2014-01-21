/*
    File:   defaults.js
    Author: Jason Johns
    Date:   1-17-2014
    Desc:   Javascript object to hold the default values of
            application-specific values
*/

function Defaults(){

    var width = 500,
        height = 600;

    this.getDimensions = function(){
        return [width, height];
    }

    this.getWidth = function(){
        return width;
    }

    this.getHeight = function(){
        return height;
    }

    this.getPopColors = function(){
        return ["#FFFFFF", "#E6E6FF", "#CDCDFF", "#B4B4FF", "#9B9BFF",
                    "#8282FF", "#6969FF", "#5050FF", "#3737FF", "#0000FF"];
    }

    this.getUrls = function(){
        return {
            counties : "/static/data/us_counties.json",
            states : "/static/data/us-states.json",
            maine : "/static/data/maine.json",
            cities : "/static/data/maine_cities.csv"
        }
    }

    this.getPopulationDomain = function(){
        return [0, 100000];
    }

    //Returns a JS object with the values for each step in the scale
    this.getScale = function(min, max, steps){
        var stepRange = (max - min)/steps;

        var scale = [stepRange];
        min += stepRange;

        for (var i = 1; i <=steps; i++)
            scale[i] = min += stepRange;

        return scale;
    }

    this.defaultTooltipTemplate = function(){
        return "<div id = 'county_name' class = 'county_record'>County: <span id = 'county'></span></div>" + 
                        "<div id = 'county_fips' class = 'county_record'>FIPS: <span id = 'fips'></span></div>";
    }

    this.chloroplethTooltipTemplate = function(){
        var template = this.defaultTooltipTemplate();
        template += "<div id = 'chloropleth_data'><div class = 'county_record'><span id = 'year'></span> Population: <span id = 'year_pop'></span></div></div>"

        return template;
    }

    this.cityTooltip = function(){
        return "<div id = 'city_info' class = city_record'>City: <span id = 'city_name'></span></div>"
    }
}