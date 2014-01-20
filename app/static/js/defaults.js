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
        return ["#FFBABA", "#FFADAD", "#FF9C9C", "#FF8585", "#FC6F6F",
                    "#FF5E5E", "#FF4A4A", "#FF3636", "#FF1F1F", "#FF0000"];
    }

    this.getUrls = function(){
        return {
            counties : "/static/data/us_counties.json",
            states : "/static/data/us-states.json",
            maine : "/static/data/maine.json"
        }
    }

    this.getPopulationDomain = function(){
        return [0, 77634];
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
}