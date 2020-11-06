/** Class representing the map view. */
class Map {

    constructor(data, updateCountry) {

    }

    drawMap(world) {

        var data = topojson.feature(world, world.objects.states).features;
        console.log(data);

        d3.select('#map-chart')
            .append('svg').attr('id', 'map-view-svg')
            .attr("preserveAspectRatio", "xMinYMin meet");
        
        const projection = d3.geoAlbersUsa();
        const path = d3.geoPath().projection(projection);
        d3.select('#map-view-svg')
        .append('g')
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', path)
            .style("fill", "#FFFFFF")
    //.attr("fill", d => colorScale(d => +d.count.split(",").join("")))
    .attr("fill-opacity", 1)
    .attr("stroke", "black")
    .attr("id",d => d.properties.name);

    }

    updateHighlightClick(activeCountry) {

    }

    /**
     * Clears all highlights
     */
    clearHighlight() {

    }
}
