class CountyData {
    /**
     *
     * @param type refers to the geoJSON type- counties are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the county paths
     * @param region the county region
     */
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

/** Class representing the map view. */
class CountyMap {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateAll a callback function used to notify other parts of the program when the selected
     * county was updated (clicked)
     */
    constructor(data, updateAll) {
        this.data = data
        this.updateAll = updateAll;
        this.autoSelector = new AutoSelector(this.data, this.updateAll);
    }

    getTooltipInfo(state, county) {
        let html = `<h2>${this.data[state][county].name} County</h2>` +  
            `<h2>Population: ${this.data[state][county][this.data.settings.activeYear].population*1000} </h2>` +  
            `<h2>Annual Precipitation: ${this.data[state][county][this.data.settings.activeYear].precip} inches </h2>` +
            `<h2>Average Temperature: ${this.data[state][county][this.data.settings.activeYear].temp} F </h2>`
        return html
    }

    /**
     * Renders the map
     * @param world the jso5 data with the shape of all counties and a string for the activeYear
     */
    drawMap(divided_geoJSON) {
        //note that projection is global!
        let that = this;
        let width =  this.data.settings.cell.width;
        let height = this.data.settings.cell.height;
        this.divided_geoJSON = divided_geoJSON;
        let svg = d3.select("#county-map").append("svg")
            .attr('width', width)
            .attr('height', height);
        svg.append("g").attr("id", "map-layer");
        svg.append("g").attr("id", "text-layer");

        for (let state of this.data.states){
            let geoJSON = divided_geoJSON[state]
            let projection = d3.geoCylindricalEqualArea()
                .fitSize([width-10,height-10],geoJSON)
            let path = d3.geoPath().projection(projection);
            d3.select("#text-layer").selectAll("text")
                .data(geoJSON.features)
                .join('text')
                .classed('map-label', true)
                .attr('x', d => projection(d3.geoCentroid(d))[0])
                .attr('y', d => projection(d3.geoCentroid(d))[1])
                .text(d => d.properties.NAME);
            d3.select("#map-layer").selectAll("path")
                .data(geoJSON.features)
                .join("path")
                .classed("boundary", true)
                .classed(`${state}-path`, true)
                .attr("id", d => state+(+d.properties.COUNTY))
                .attr("d",path)
                .on("mouseover", d => {
                    let county = +d.properties.COUNTY;
                    d3.select(".tooltip")
                        .style("opacity",0.9)
                        .style("left",d3.event.pageX+"px")
                        .style("top",d3.event.pageY+"px")
                        .html(that.getTooltipInfo(state, county));
                })
                .on('mousemove', d => {
                    d3.select('.tooltip')
                        .style("left",d3.event.pageX+"px")
                        .style("top",d3.event.pageY+"px");
                })
                .on("mouseout", d => {
                    d3.select(".tooltip")
                        .style("opacity",0);
                })
                .on("click", d => {
                    let county = state+(+d.properties.COUNTY);
                    if (that.data.settings.selectedCounties.includes(county)){
                        let index = that.data.settings.selectedCounties.indexOf(county);
                        that.data.settings.selectedCounties.splice(index, 1);
                    }
                    else{
                        if(this.data.settings.selectedCounties.length >= 5){
                            alert("Only 5 Counties can be selected");
                        }
                        else{
                            that.data.settings.selectedCounties.push(county);
                        }
                    }
                    that.updateAll();
                })
                .on('contextmenu', d => {
                    d3.event.preventDefault();
                    if (that.data.settings.focusCounty == state+(+d.properties.COUNTY))
                        that.data.settings.focusCounty = null;
                    else
                        that.data.settings.focusCounty = state+(+d.properties.COUNTY);
                    that.autoSelector.autoSelect();
                    that.updateAll();
                });
        }
        this.updateMap();
    }

    updateMap(){
        let that = this;
        for (let state of this.data.states){
            let counties = d3.select('#map-layer').selectAll('path').filter(`.${state}-path`);
            counties.data(this.divided_geoJSON[state].features)
                .transition()
                .duration(this.data.transitionDuration)
                .attr("fill", d => {
                    if(this.data.linecolor[0]){
                        let linecolorScale =  this.data.linecolor[1];
                        return linecolorScale(d.properties.NAME);

                    }
                    return that.data.colorScale(that.data.plotData[state][+d.properties.COUNTY].colorVal);
                });
        }
    }


    /**
     * Highlights the selected conuty and region on mouse click
     */
    updateHighlightClick() {
        let counties = d3.select("#map-layer");
        counties.selectAll("path")
            .classed("selected-county", false)
            .classed("focus-county", false);
        for (let county of this.data.settings.selectedCounties)
        {
            counties.select("#"+county)
                .classed("selected-county", true);
        }
        let focus = d3.select(`#${this.data.settings.focusCounty}`)
            .classed('focus-county', true)
    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
    }
}

class Map {

    constructor(data, updateCountry) {

    }

    drawMap(world) {

        var data = topojson.feature(world, world.objects.states).features;
        console.log(data);

        d3.select('#map-chart-usa')
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

