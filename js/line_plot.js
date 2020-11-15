/** Data structure for the data associated with an individual county. */
class DataPointLine {
    // *
    //  *
    //  * @param county county name from the x data object
    //  * @param yVal value from the data object chosen for y at the active year
    //  * @param id county id
     
    constructor(county, yVal, id) {
        this.county = county;
        this.yVal = yVal;
        // this.yVal = yVal;
        this.id = id;
    }
}

/** Class representing the scatter plot view. */
class LinePlot {

    /**
     * @param updateAll a callback function used to notify other parts of the program when a year was updated
     */
    constructor(data,updateAllLine) {

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 500 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.data = data;
        this.data.plotDataLine = {};
        for (let state of this.data.states){
            this.data.plotDataLine[state] = {};
        }
        this.updateAllLine = updateAllLine;


    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot(viewer) {
        // console.log("LIne chart");
        // console.log(this.data.labels);
        d3.select('#line1')
            .append('div').attr('id', 'line-chart-view');
        d3.select('#line-chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#line-chart-view').select('.plot-svg').append('g').classed('line-wrapper-group', true).attr("transform", "translate("+this.margin.left+","+this.margin.top+")");

        let plot = d3.select(".line-wrapper-group")

        plot.append("g").attr("id","lines");
        
        plot.append("g").classed("x-axis", true)
            .attr("id","x-axis-line")
            .attr("transform","translate(0,"+this.height+ ")");
        plot.append("text").classed("axis-label-x-line",true);
        plot.append("g").classed("y-axis", true)
            .attr("id","y-axis-line");
        plot.append("text").classed("axis-label-y-line",true);
        

        /* Below is the setup for the dropdown menu- no need to change this */
        let dropdownWrap = d3.select('#line-chart-view').append('div').classed('dropdown-wrapper-line', true);

        /*
        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');
        */

        
        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y-line').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        /*
        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');
        */
    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(yIndicator) {
        /**
         * @param d the data value to encode
         * @returns {number} the radius
         */
        // let circleSizer = function (d) {
        //     let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
        //     return d.circleSize ? cScale(d.circleSize) : 3;
        // };

        this.data.transitionDuration = 500;
        let state = this.data.states[0];
        let activeYear = this.data.settings.activeYear

        
        let yMax = 0;
        let colorMax = 0;
        let yMin = 100000;
        // let yMin = this.data[state][Object.keys(this.data[state])[0]][activeYear][yIndicator];
        // let rMin = this.data[state][Object.keys(this.data[state])[0]][activeYear][circleSizeIndicator];
        let colorMin = yMin;
        this.regions = {}
        let lineData = {};
        let countyname = [];
        for (let state of this.data.states){
            for (let countyID in this.data[state]){
                let county = this.data[state][countyID];
                let valy = [];
                lineData[county.name] = [];
                countyname.push(county.name);
                for (let i = 1985; i<=2015; i+=5){
                    let value = county[i][yIndicator];
                    let year = i;
                    // valy.push(county[i][yIndicator]);
                    
                    lineData[county.name].push({value: value,
                                 year: year});
                    // console.log(county[i][yIndicator]);
                    if (+county[i][yIndicator] > yMax)
                        yMax = +county[i][yIndicator];
                    if (+county[i][yIndicator] < yMin)
                        yMin = +county[i][yIndicator];
                    let slope = +county[i][yIndicator];
                    if (slope > colorMax && i == activeYear)
                        colorMax = slope;
                    if (slope < colorMin && i == activeYear)
                        colorMin = slope;
                }

                let dataPoint = new DataPointLine(county.name, valy, countyID);
                this.data.plotDataLine[state][+countyID] = dataPoint;

            }
        }
        // console.log(this.data.plotDataLine[state]);
        let xMin = 1985;
        let xMax = 2015;

        let xScale = d3.scaleLinear().range([0,this.width]).domain([xMin,xMax]).nice();
        let xAxis = d3.select("#x-axis-line").call(d3.axisBottom(xScale).tickValues(this.data.settings.years).tickFormat(d3.format('.4')));
        



        let yScale = d3.scaleLinear().range([0,this.height]).domain([yMax,0]).nice();

        let axisYLabel = d3
            .select(".axis-label-y-line")
            .text(this.data.labels[yIndicator])
            .style("text-anchor", "middle")
            .attr("transform", "translate(-65,"+(this.height/2)+") rotate(-90)");
        let yAxis = d3.select("#y-axis-line").call(d3.axisLeft(yScale));
        let colorScale = d3.scaleSequential().domain([colorMin, colorMax])
            .interpolator(d3.interpolateBlues);
        // this.data.colorScale = colorScale;

        // let minSize = rMin;
        // let maxSize = rMax;

        console.log("---------------------");
        console.log(this.data.plotDataLine[state]);
// --------------------------------------------------------------------------------------------------------------------------------------------------------
        let lineGen = d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.value));
        // Data are categories (each line that is drawn), serves as key to lineData[key] for lineGen
        
        console.log(countyname);
        let lineGroup = d3.select('#lines').selectAll('path').data(countyname);
        console.log(lineGroup);
        lineGroup.join('path')
        .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
            .classed('line-path', true)
            // .attr('stroke', d => this.colorScale(d))
            .attr('d', d => {
                return lineGen(lineData[d]) })
            .transition()
            .duration(this.data.transitionDuration);
        lineGroup.exit().remove();


        //this.drawLegend(rMin, rMax);
        this.drawDropDown(yIndicator);
    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(yIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper-line');
        let dropData = [];

        let obj = this.data[this.data.states[0]][1][this.data.settings.activeYear];
        for (let key in obj) {
            dropData.push({
                indicator: key,
                indicator_name: key
            });
        }

        
        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y-line').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function (d, i) {
            that.updateAllLine();
        });

    }

    /**
     * Reacts to a highlight/click event for a county; draws that county darker
     * and fades counties on other continents out
     */
    updateHighlightClick() {
        
    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data) {
        let text = "<h2>" + data['county'] + "</h2>";
        return text;
    }

}
