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
        cityTooltip,
        data,
        pop,
        default_tooltip = true;
        chloropleth_selected = false;

    init();

    function init(){

        initElements();

        //initialize projection with default scale.  
        projection = d3.geo.mercator()
                        .scale(5500)
                        .translate([0, 0])
                        .center([-71.8, 47.5])
                        .precision(0);

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
        
        cityTooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 1e-6)
                        .style("background", "rgba(250, 250, 250, .7)");

        tooltip.append("div")
            .attr("id", "countyName");

        cityTooltip.append("div")
            .attr("id", "cityData");

        $("#countyName").append(defaults.defaultTooltipTemplate());
        $("#cityData").append(defaults.cityTooltip());

        d3.json(defaults.getUrls().maine, function(e, map){

            //use hancock county to center the map in a 500x600 svg element with some fancy math
            //See http://bl.ocks.org/mbostock/4707858 for the source of the code below
            var b = path.bounds(map.features[10]),
            s = .22 / Math.max((b[1][0] - b[0][0]) / defaults.getWidth(), (b[1][1] - b[0][1]) / defaults.getHeight()),
            t = [(defaults.getWidth() - s * (b[1][0] + b[0][0])) / 2.16, (defaults.getHeight() - s * (b[1][1] + b[0][1])) / 2.06];

            //projection.scale(s).translate(t);
            //projection.scale(s);
            g = svg.append("g");

            g.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(map.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", function(d){
                    return d.properties.name;
                })
                .on("mouseover", showTooltip)
                .on("mousemove", updateTooltip)
                .on("mouseout", hideTooltip)
                .on("contextmenu", rightClick)
                .on("click", mouseClick);

            
        });
            
        //handles the insertion of city points on the map
        d3.csv(defaults.getUrls().cities, function(e, map){
            g.selectAll("circle")
                .data(map)
                .enter()
                .append("circle")
                .attr("transform", function(d) {
                    return "translate(" + projection([d.lon,d.lat]) + ")";
                })
                .attr("r", 5)
                .style("fill", "red")
                .style("stroke", "black")
                .on("mouseover", showCityTooltip)
                .on("mouseout", hideCityTooltip);
        });
        
    }

    function keyHandler(d, i){
        if (d3.event.ctrlKey)
            console.log("control key pressed");
    }

    function mouseClick(d, i){
        console.log(d.properties.fips);

        $.ajax({
            url : "getCountyData/",
            type : "POST",
            data : {"fips" : d.properties.fips},
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

    function showCityTooltip(d, i){
        cityTooltip.style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 5) + "px")
                .transition()
                .duration(300)
                .style("opacity", 1)
                //.style("background-color", "")
                .style("display", "block");

        $("#city_name").text(d.city);

        $(this).css({
            "stroke" :"#FF0000", 
            "stroke-width" : 1.5 + "px",
            "fill" : "#00FF00"
        });

    }

    function hideCityTooltip(d, i){
        cityTooltip.transition()
                .duration(200)
                .style("opacity", 0);

        $(this).css({
            "stroke" : "#000000", 
            "stroke-width" : 1.0 + "px",
            "fill" : "#FF0000"
        });
    }

    function updateTooltip(d, i){
        tooltip.style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 5) + "px");

    }

    //Shows the tooltip on mouseover of a county
    function showTooltip(d, i){
        tooltipText(d);
        tooltip.style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 5) + "px")
                .transition()
                .duration(300)
                .style("opacity", 1)
                //.style("background-color", "")
                .style("display", "block");

        $(this).css("stroke", "#FF0000")
                .css("stroke-width", 1.5 + "px");
    }

    function tooltipText(d){
        if (default_tooltip) {
            $("#county").text(d.properties.name);
            $("#fips").text(d.properties.fips);
        } else if (chloropleth_selected){

            if (!($("#chloropleth_data").length < 0)){
                $("#countyName").empty()
                                .append(defaults.chloroplethTooltipTemplate());
            }

            $("#county").text(d.properties.name);
            $("#fips").text(d.properties.fips);
            $("#year").text($("#slider_value").text());
            $("#year_pop").text(pop[d.properties.name]);
        }
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
            if (!chloropleth_selected) {
                $("#population_slider_wrapper").removeClass("hide_element").addClass("show_element");
                mapColors();
                populationSliderHandler(2000);
                default_tooltip = false;
                chloropleth_selected = true;
            }
        });

        $("#population_slider").slider({
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
        var scale = defaults.getScale(popDomain[0], popDomain[1], 9);
        var colors = defaults.getPopColors();

        for (key in pop){
            for (var i = 0; i < scale.length; i++){
                if (pop[key] == 0) {
                    $("." + key).css("fill", "#FFFFFF")
                                .css("stroke", "#000000");
                } 
                else if (pop[key] >= scale[i]){
                    $("." + key).css("fill", colors[i + 1])
                                .css("stroke", "#000000");
                }
                

            }
        }
    }

    function mapColors(){
        var colors = defaults.getPopColors();
        var appendString = "";

        for (var i = 0; i < colors.length; i++)
            appendString += "<div class = 'chloropleth_boxes' id = 'chloropleth_" + i + "'>" + 
                            "<div class = 'box_label' id = 'box_" + i + "'></div></div>"

        $("#map_colors").append(appendString);
        var domain = defaults.getPopulationDomain();
        var scale = defaults.getScale(domain[0], domain[1], 10);

        for (var i = 0; i < colors.length; i++) {
            $("#chloropleth_" + i).css("background-color", colors[i]);
            $("#box_" + i).text(Math.floor(scale[i]));
        }



    }


});