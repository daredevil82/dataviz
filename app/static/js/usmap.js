/*
    File:   usmap.js
    Author: Jason Johns
    Date:   1-14-2014
    Desc:   Render map of paths input from specified JSON file and handle user interactions
*/

$(document).ready(function(){

    var defaults = new Defaults(),
        q,
        projection,
        path,
        zoom, 
        svg,
        tooltip,
        data,
        pop;

    init();

    function init(){

        initElements();

        //initialize projection with default scale.  
        projection = d3.geo.albersUsa()
                        .scale(1)
                        .translate([0, 0]);

        //set up the path attribute
        path = d3.geo.path()
                    .projection(projection);

        //define zoom behavior and set limit of [1, 10]
        zoom = d3.behavior.zoom()
                    .scaleExtent([1, 3])
                    .on("zoom", zoom);

        //initialize map element with basic attribute settings
        svg = d3.select("#map_container")
                    .append("svg")
                    .attr("width", defaults.getWidth())
                    .attr("height", defaults.getHeight())
                    .attr("transform", "translate(-5, -5)")
                    .call(zoom);

        d3.select("body")
            .on("keydown", keyHandler);
                    

        svg.append("rect")
            .attr("class", "background")
            .attr("width", defaults.getWidth())
            .attr("height", defaults.getHeight());

        //initialize tooltip overlay
        tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 1e-6)
                    .style("background", "rgba(250, 250, 250, .7)");

        tooltip.append("div")
            .attr("id", "countyName");

        d3.json(defaults.getUrls().maine, function(e, map){

            //use hancock county to center the map in a 500x600 svg element with some fancy math
            //See http://bl.ocks.org/mbostock/4707858 for the source of the code below
            var b = path.bounds(map.features[10]),
                s = .22 / Math.max((b[1][0] - b[0][0]) / defaults.getWidth(), (b[1][1] - b[0][1]) / defaults.getHeight()),
                t = [(defaults.getWidth() - s * (b[1][0] + b[0][0])) / 2.16, (defaults.getHeight() - s * (b[1][1] + b[0][1])) / 2.06];

            console.log(s + "\n" + t);

            projection.scale(s).translate(t);
            g = svg.append("g");

            g.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(map.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("transform", function(d){
                    return "rotate(17)";
                })
                .attr("class", function(d){
                    return d.properties.NAME;
                })
                .on("mouseover", showTooltip)
                .on("mousemove", updateTooltip)
                .on("mouseout", hideTooltip)
                .on("contextmenu", rightClick)
                .on("click", mouseClick);
            });

    }

    function keyHandler(d, i){
        if (d3.event.ctrlKey)
            console.log("control key pressed");
    }

    function mouseClick(d, i){
        console.log(d.properties.FIPS);

        $.ajax({
            url : "getCountyData/",
            type : "POST",
            data : {"fips" : d.properties.FIPS},
            dataType : "json",
            success : function(results){
                if (results.success == "true")
                    var data = JSON.parse(results.data);
                    console.log(data);
            }

        })
    }

    function rightClick(d, i){
        d3.event.preventDefault();
        hideTooltip(d, i);
    }


    //Handles the slide event for the population slider
    function populationSliderHandler(year){
        $.ajax({
            url : "getCensusYearData",
            type : "POST",
            data : {"year" : year},
            dataType : "json",
            success : function(results){
                if (results.success == "true"){
                    chloropleth(JSON.parse(results.data));
                }
            }
        });
    }

    function updateTooltip(d, i){
        tooltip.style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 5) + "px");

    }

    //Shows the tooltip on mouseover of a county
    function showTooltip(d, i){
        tooltip.style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 5) + "px")
                .transition()
                .duration(300)
                .style("opacity", 1)
                //.style("background-color", "")
                .style("display", "block");

        $(this).css("stroke", "#0000FF")
                .css("stroke-width", 1.5 + "px");

        console.log(d.properties);
        $("#countyName").text("County name:\t" + d.properties.NAME + ", " + d.properties.STATE_NAME + "\n\nFIPS:\t" + d.properties.FIPS);

    }

    //Hides the tooltip once the mouse pointer leaves the county
    function hideTooltip(d, i){
        tooltip.transition()
                .duration(200)
                .style("opacity", 0);

        $(this).css("stroke", "#000000")
                .css("stroke-width", 1.0 + "px");
    }

    //Handles the zoom and panning of the map element
    function zoom(){
        //console.log(d3.event.translate);
        g.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    }


    //Handle the initialization of jquery ui elements and event binding
    function initElements(){
        $("#map_selection").buttonset();

        $("#pop_heatmap").click(function(e){
            $("#population_slider_wrapper").removeClass("hide_element").addClass("show_element");
            mapColors();
            populationSliderHandler(2000);
        });

        $("#population_slider").slider({
            orientation : "vertical",
            range : "max",
            min : 1790,
            max : 2000,
            value : 2000,
            step : 10,
            slide : function(e, u){
                $("#slider_value").text(u.value);
                populationSliderHandler(u.value);
            },
            create : function(e, u){
                $("#slider_value").text($(this).slider("value"));
            }
        });
    }

    function chloropleth(data){
        pop = JSON.parse(data[0].fields.json);
        var popDomain = defaults.getPopulationDomain();
        var scale = defaults.getScale(popDomain[0], popDomain[1], 10);
        var colors = defaults.getPopColors();

        for (key in pop){
            for (var i = 0; i < scale.length; i++){
                if (pop[key] >= scale[i]){
                    $("." + key).css("fill", colors[i])
                                .css("stroke", "#000000");
                }

            }
        }
    }

    function mapColors(){
        var colors = defaults.getPopColors();
        var appendString = "";

        for (var i = 0; i < colors.length; i++)
            appendString += "<div class = 'chloropleth_boxes' id = 'chloropleth_" + i + "'></div>"

        $("#map_colors").append(appendString);

        for (var i = 0; i < colors.length; i++)
            $("#chloropleth_" + i).css("background-color", colors[i]);

    }


});