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
        this.colorclick = false;
    }
}

/** Class representing the scatter plot view. */
class LinePlot {

    /**
     * @param updateAll a callback function used to notify other parts of the program when a year was updated
     */
    constructor(data) {

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = data.settings.cell.width - this.margin.left - this.margin.right;
        this.height = data.settings.cell.height - this.margin.top - this.margin.bottom;

        this.data = data;
        this.data.plotDataLine = {};
        for (let state of this.data.states){
            this.data.plotDataLine[state] = {};
        }
        // this.buttonclick = buttonclick;
        this.linecolorScale = '';

    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot(viewer) {
        let that = this;
        // console.log("LIne chart");
        // console.log(this.data.labels);
        // let toggleheader = d3.select("#line1")
        //     .append("div").attr("id", "toggle-header");

        // //reference : w3 school : https://www.w3schools.com/howto/howto_css_switch.asp
        // toggleheader.html('Color the MAP: <input id="checkboxbtn" type="checkbox">');
    
        // d3.select("#checkboxbtn")
        //     .on("click",function(){
        //     that.buttonclick();
        // });


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
        
        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data:  ');
        yWrap.append('div').classed('y-label', true)
            .attr('id','line1-y-label')
            .append('text')
            .text('Axis selection');

        // yWrap.append('div').attr('id', 'dropdown_y-line').classed('dropdown', true).append('div').classed('dropdown-content', true)
        //     .append('select');

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
        
        yIndicator = this.data.settings.dropOptions[yIndicator].y;

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
        let xAxis = d3.select("#x-axis-line").call(d3.axisBottom(xScale).tickValues(this.data.settings.years).tickFormat(d3.format('.4')));
        



        let yScale = d3.scaleLinear().range([0,this.height]).domain([yMax,0]).nice();

        let axisYLabel = d3
            .select(".axis-label-y-line")
            .text(this.data.labels[yIndicator])
            .style("text-anchor", "middle")
            .attr("transform", "translate(-65,"+(this.height/2)+") rotate(-90)");
        let yAxis = d3.select("#y-axis-line").call(d3.axisLeft(yScale));
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
        // let color_scale = d3.scaleOrdinal().domain(countyname).range(["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a",
        //  "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae",
        //   "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9",
        //    "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba",
        //     "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf",
        //      "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8",
        //       "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d",
        //        "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a",
        //         "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"]);
        this.linecolorScale = d3.scaleOrdinal().domain(countyname).range(d3.schemeTableau10);
        console.log(countyname);
        let lineGroup = d3.select('#lines').selectAll('path').data(countyname);
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

        d3.select('#line1-y-label').text(this.data.labels[yIndicator]);
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
