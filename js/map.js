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
    }

    /**
     * Renders the map
     * @param world the jso5 data with the shape of all counties and a string for the activeYear
     */
    drawMap(divided_geoJSON) {
        //note that projection is global!
        let that = this;
        let width =  500;
        let height = 500;
        this.divided_geoJSON = divided_geoJSON;
        let mapDiv = document.getElementById("county-map");
        let svg = d3.select("#county-map").append("svg")
            .attr('viewBox', `0 0 ${width} ${height}`);
        svg.append("g").attr("id", "map-layer");

        for (let state of this.data.states){
            let geoJSON = divided_geoJSON[state]
            let projection = d3.geoCylindricalEqualArea()
                .translate([width/2, height/2])
                .fitSize([width-10,height-10],geoJSON)
                //.scale([500]);
            let path = d3.geoPath().projection(projection);
            let counties = d3.select("#map-layer").selectAll("path")
                .data(geoJSON.features)
                .join("path")
                .classed("boundary", true)
                .classed(`${state}-path`, true)
                .attr("id", d => state+(+d.properties.COUNTY))
                .attr("d",path)
                .on("click", d => {
                    let county = state+(+d.properties.COUNTY);
                    if (that.data.settings.selectedCounties.includes(county)){
                        let index = that.data.settings.selectedCounties.indexOf(county);
                        that.data.settings.selectedCounties.splice(index, 1);
                    }
                    else{
                        that.data.settings.selectedCounties.push(county);
                    }
                    that.updateAll();
                })
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
                    return that.data.colorScale(that.data.plotData[state][+d.properties.COUNTY].yVal/that.data.plotData[state][+d.properties.COUNTY].xVal);
                });
        }
    }


    /**
     * Highlights the selected conuty and region on mouse click
     */
    updateHighlightClick() {
        let counties = d3.select("#map-layer");
        counties.selectAll("path")
            .classed("selected-county", false);
        for (let county of this.data.settings.selectedCounties)
        {
            counties.select("#"+county)
                .classed("selected-county", true);
        }
    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3 *******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //TODO - your code goes here
        let counties = d3.select("#map-layer");
        counties.select("#"+this.data.settings.activeCounty)
            .classed("selected-county", false);
    }
}
