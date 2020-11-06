/** Data structure for the data associated with an individual county. */
class InfoBoxData {
    /**
     *
     * @param county name of the active county
     * @param region region of the active county
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(county, region, indicator_name, value) {
        this.county = county;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {

        //TODO - your code goes here -
        this.data = data;
        let infoBox = d3.select("#county-detail");
        infoBox.append("div")
            .classed("label", true)
            .attr("id", "infobox-title");
        d3.select(".label").append("i")
            .classed("fas", true)
            .style("opacity", 0);
        d3.select(".label").append("text")
            .attr("id", "label-text");
        for (let i=1; i<=5; i++){
            let stat = infoBox.append("div").classed("stat", true);
            stat.append("span")
                .classed("label", true)
                .attr("id", "infobox-prop"+i);
        }
    }

    /**
     * Renders the county description
     * @param activeCounty the IDs for the active county
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCounty, activeYear) {
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected county, region, population and stats associated with the county.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCounty data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

         //TODO - your code goes here -
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let propCount = 0;
        let text = null;
        Object.values(this.data).forEach(element => {
            propCount += 1;
            element.forEach(county => {
                if (county.geo === activeCounty && county.county){
                    if (propCount == 1){
                        let region = county.region;
                        if (region === "europe")
                            region = "asia";
                        d3.select(".fas")
                            .classed("fa-globe-"+this.activeRegion, false)
                            .classed("fa-globe-"+region, true)
                            .classed(county.region, true)
                            .style("opacity", 1);
                        d3.select("#label-text").text(' '+county.county);
                        this.activeRegion = county.region;
                    }
                    text = new Intl.NumberFormat().format(county[activeYear]);
                    d3.select("#infobox-prop"+propCount)
                        .text(capitalizeFirstLetter(county.indicator_name) + ":  "+text);
                    //d3.select("#infobox-stat"+propCount).text(text);
                }
            });
        });
    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {

        //TODO - your code goes here -
        d3.select(".fas."+this.activeRegion)
            .classed(this.activeRegion, false)
            .classed("fa-globe-"+this.activeRegion, false)
            .style("opacity", 0);
        d3.select("#label-text").text("");
        for (let i =1; i <= 5; i++){
            d3.select("#infobox-prop"+i).text("");
        }
    }

}