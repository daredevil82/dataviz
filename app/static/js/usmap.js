$(document).ready(function(){

    var width = 500,
        height = 600;
        
    var urls = {
            counties : "/static/data/us_counties.json",
            states : "/static/data/us-states.json",
            maine : "/static/data/maine.json"
        },
        q,
        projection,
        path,
        zoom, 
        svg,
        tooltip;

    init();

    function init(){

        //initialize projection with default scale.  
        projection = d3.geo.albersUsa()
                        .scale(1)
                        .translate([0, 0]);

        //set up the path attribute
        path = d3.geo.path()
                    .projection(projection);



        //define zoom behavior and set limit of [1, 10]
        zoom = d3.behavior.zoom()
                    .scaleExtent([1, 2])
                    .on("zoom", zoom);

        //initialize map element with basic attribute settings
        svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform", "translate(-5, -5)")
                    .call(zoom);

        d3.select("body")
            .on("keydown", keyHandler);
                    

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

        //initialize tooltip overlay
        tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 1e-6)
                    .style("background", "rgba(250, 250, 250, .7)");

        tooltip.append("span")
            .attr("id", "countyName");

        d3.json(urls.maine, function(e, map){

            //use hancock county to center the map in a 500x600 svg element with some fancy math
            //See http://bl.ocks.org/mbostock/4707858 for the source of the code below
            var b = path.bounds(map.features[10]),
                s = .22 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                t = [(width - s * (b[1][0] + b[0][0])) / 2.1, (height - s * (b[1][1] + b[0][1])) / 2.03];

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
                .on("mouseover", showTooltip)
                .on("mousemove", updateTooltip)
                .on("mouseout", hideTooltip)
                .on("contextmenu", rightClick);
            });

    }

    function keyHandler(d, i){
        if (d3.event.ctrlKey)
            console.log("control key pressed");
    }

    function rightClick(d, i){
        d3.event.preventDefault();
        hideTooltip(d, i);
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

        console.log(d.properties);
        $("#countyName").text("County name:\t" + d.properties.NAME + ", " + d.properties.STATE_NAME + "\n\nFIPS:\t" + d.properties.FIPS);

    }

    //Hides the tooltip once the mouse pointer leaves the county
    function hideTooltip(d, i){
        tooltip.transition()
                .duration(200)
                .style("opacity", 0);
    }

    //Handles the zoom and panning of the map element
    function zoom(){
        console.log(d3.event.translate);
        g.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    }

});