/** Data structure for the data associated with an individual county. */

/** Class representing the scatter plot view. */
class LinePlot2 {

    /**
     * @param updateAll a callback function used to notify other parts of the program when a year was updated
     */
    constructor(data) {

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 500 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.data = data;
        this.data.plotDataLine = {};
        for (let state of this.data.states){
            this.data.plotDataLine[state] = {};
        }
        this.linecolorScale ='';

    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot(viewer) {
        let that = this;
        // console.log("LIne chart");
        // console.log(this.data.labels);
        

        d3.select('#line2')
            .append('div').attr('id', 'line-chart-view2');

        d3.select('#line-chart-view2')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#line-chart-view2').select('.plot-svg').append('g').classed('line-wrapper-group2', true).attr("transform", "translate("+this.margin.left+","+this.margin.top+")");

        let plot = d3.select(".line-wrapper-group2")

        plot.append("g").attr("id","lines2");
        
        plot.append("g").classed("x-axis", true)
            .attr("id","x-axis-line2")
            .attr("transform","translate(0,"+this.height+ ")");
        plot.append("text").classed("axis-label-x-line",true);
        plot.append("g").classed("y-axis", true)
            .attr("id","y-axis-line2");
        plot.append("text").classed("axis-label-y-line2",true);
        

        /* Below is the setup for the dropdown menu- no need to change this */
        let dropdownWrap = d3.select('#line-chart-view2').append('div').classed('dropdown-wrapper-line2', true);
        
        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

         yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data:  ');
        yWrap.append('div').classed('y-label', true)
            .attr('id','line2-y-label')
            .append('text')
            .text('Axis selection');

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
        yIndicator = this.data.settings.dropOptions[yIndicator].x;
        this.data.transitionDuration = 500;
        let state = this.data.states[0];
        let activeYear = this.data.settings.activeYear
        let selectedcounties = [];
        if(this.data.settings.selectedCounties){
            selectedcounties = this.data.settings.selectedCounties;
        }
        if(this.data.settings.focusCounty){
            selectedcounties.push(this.data.settings.focusCounty);
        }

        
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
                if(selectedcounties.indexOf('utah'+String(countyID)) == -1 ){
                    continue;
                }
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
        let xAxis = d3.select("#x-axis-line2").call(d3.axisBottom(xScale).tickValues(this.data.settings.years).tickFormat(d3.format('.4')));
        



        let yScale = d3.scaleLinear().range([0,this.height]).domain([yMax,0]).nice();

        let axisYLabel = d3
            .select(".axis-label-y-line2")
            .text(this.data.labels[yIndicator])
            .style("text-anchor", "middle")
            .attr("transform", "translate(-65,"+(this.height/2)+") rotate(-90)");
        let yAxis = d3.select("#y-axis-line2").call(d3.axisLeft(yScale));
        // let colorScale = d3.scaleSequential().domain([colorMin, colorMax])
        //     .interpolator(d3.interpolateBlues);
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

        //color list reference: https://jnnnnn.blogspot.com/2017/02/distinct-colours-2.html
        this.linecolorScale = d3.scaleOrdinal().domain(countyname).range(d3.schemeTableau10);
        console.log(countyname);
        let lineGroup = d3.select('#lines2').selectAll('path').data(countyname);
        console.log(lineGroup);
        lineGroup.join('path')
        .attr("fill",'none')
      .attr("stroke", d => this.linecolorScale(d))
      .attr("stroke-width", 1)
            .classed('line-path', true)
            // .attr('stroke', d => this.colorScale(d))
            .attr('d', d => {
                return lineGen(lineData[d]) })
            .append("svg:title")
          .text(function(d, i) { return d; })
            .transition()
            .duration(this.data.transitionDuration);
        lineGroup.exit().remove();

        d3.select('#line2-y-label').text(this.data.labels[yIndicator]);
        //this.drawLegend(rMin, rMax);
        // this.drawDropDown(yIndicator);
    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(yIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper-line2');
        let dropData = [];

        let obj = this.data[this.data.states[0]][1][this.data.settings.activeYear];
        for (let key in obj) {
            dropData.push({
                indicator: key,
                indicator_name: key
            });
        }

        
        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y-line2').select('.dropdown-content').select('select');

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
            that.updateAllLine2();
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
