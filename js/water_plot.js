/** Data structure for the data associated with an individual county. */
class DataPoint {
    /**
     *
     * @param county county name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id county id
     * @param region county region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(county, xVal, yVal, id, circleSize) {
        this.county = county;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class ScatterPlot {

    /**
     * @param updateAll a callback function used to notify other parts of the program when a year was updated
     */
    constructor(data, updateAll) {

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 500 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.data = data;
        this.data.plotData = {};
        for (let state of this.data.states){
            this.data.plotData[state] = {};
        }

        this.updateAll = updateAll;

    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {
        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');
        d3.select('#scatter-plot')
            .append('div').attr('id', 'activeYear-bar');
        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);
        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true).attr("transform", "translate("+this.margin.left+","+this.margin.top+")");

        let plot = d3.select(".wrapper-group")
        plot.append("text")
            .classed("activeYear-background",true)
            .attr("transform",`translate(${this.width-150},${this.height-this.margin.top})`)
            .text(this.data.activeYear);
        plot.append("g").attr("id","points");
        plot.append("g").classed("x-axis", true)
            .attr("id","x-axis")
            .attr("transform","translate(0,"+this.height+ ")");
        plot.append("text").classed("axis-label-x",true);
        plot.append("g").classed("y-axis", true)
            .attr("id","y-axis");
        plot.append("text").classed("axis-label-y",true);
        

        /* Below is the setup for the dropdown menu- no need to change this */
        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        /*
        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');
        */

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
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
    updatePlot(xIndicator, yIndicator, circleSizeIndicator) {
        /**
         * @param d the data value to encode
         * @returns {number} the radius
         */
        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };

        this.data.transitionDuration = 500;
        let state = this.data.states[0];
        let activeYear = this.data.settings.activeYear

        let xMax = 0;
        let yMax = 0;
        let rMax = 0;
        let colorMax = 0;
        let xMin = this.data[state][Object.keys(this.data[state])[0]][activeYear][xIndicator];
        let yMin = this.data[state][Object.keys(this.data[state])[0]][activeYear][yIndicator];
        let rMin = this.data[state][Object.keys(this.data[state])[0]][activeYear][circleSizeIndicator];
        let colorMin = yMin / xMin;
        this.regions = {}

        for (let state of this.data.states){
            for (let countyID in this.data[state]){
                let county = this.data[state][countyID];
                for (let i = 1985; i<=2015; i+=5){
                    if (+county[i][xIndicator] > xMax)
                        xMax = +county[i][xIndicator];
                    if (+county[i][xIndicator] < xMin)
                        xMin = +county[i][xIndicator];
                    if (+county[i][yIndicator] > yMax)
                        yMax = +county[i][yIndicator];
                    if (+county[i][yIndicator] < yMin)
                        yMin = +county[i][yIndicator];
                    if (+county[i][circleSizeIndicator] > rMax)
                        rMax = +county[i][circleSizeIndicator];
                    if (+county[i][circleSizeIndicator] < rMin)
                        rMin = +county[i][circleSizeIndicator];
                    let slope = +county[i][yIndicator]/+county[i][xIndicator];
                    if (slope > colorMax && i == activeYear)
                        colorMax = slope;
                    if (slope < colorMin && i == activeYear)
                        colorMin = slope;
                }
                let dataPoint = new DataPoint(county.name, county[activeYear][xIndicator], county[activeYear][yIndicator], countyID,  county[activeYear][circleSizeIndicator]);
                this.data.plotData[state][+countyID] = dataPoint;
            }
        }

        let xScale = d3.scaleLinear().range([0,this.width]).domain([0,xMax]).nice();
        let axisXLabel = d3
            .select(".axis-label-x")
            .text(this.data.labels[xIndicator])
            .style("text-anchor", "middle")
            .attr("transform", "translate("+this.width/2+","+(this.height+35)+")");
        let xAxis = d3.select("#x-axis").call(d3.axisBottom(xScale));

        let yScale = d3.scaleLinear().range([0,this.height]).domain([yMax,0]).nice();
        let axisYLabel = d3
            .select(".axis-label-y")
            .text(this.data.labels[yIndicator])
            .style("text-anchor", "middle")
            .attr("transform", "translate(-65,"+(this.height/2)+") rotate(-90)");
        let yAxis = d3.select("#y-axis").call(d3.axisLeft(yScale));
        let colorScale = d3.scaleSequential().domain([colorMin, colorMax])
            .interpolator(d3.interpolateBlues);
        this.data.colorScale = colorScale;

        let minSize = rMin;
        let maxSize = rMax;

        console.log("---------------------");
        console.log(this.data.plotData[state]);
        for (let state of this.data.states){
            let circleGroup = d3.select("#points").selectAll("circle").data(Object.values(this.data.plotData[state]));

            let that = this;
            let enterPoint = circleGroup.join("circle")
                .classed(state+'-dot', true)
                .attr("id", d => state+d.id)
                .on("mouseover", d => {
                    d3.select(".tooltip")
                        .style("opacity",0.9)
                        .style("left",d3.event.pageX+15+"px")
                        .style("top",d3.event.pageY-25+"px")
                        .html(this.tooltipRender(d));
                })
                .on("mouseout", d => {
                    d3.select(".tooltip")
                        .style("opacity",0);
                })
                .on("click", d => {
                    let county = state+d.id;
                    if (that.data.settings.selectedCounties.includes(county)){
                        let index = that.data.settings.selectedCounties.indexOf(county);
                        that.data.settings.selectedCounties.splice(index, 1);
                    }
                    else{
                        that.data.settings.selectedCounties.push(county);
                    }
                    that.updateAll();
                })
                .transition()
                .duration(this.data.transitionDuration)
                //.attr("r", d => circleSizer(d))
                .attr("r", 6)
                .attr("cx", d => xScale(d.xVal))
                .attr("cy", d => yScale(d.yVal))
                .attr("fill", d => colorScale(d.yVal/d.xVal))
            circleGroup.exit().remove();
        }
        d3.select(".activeYear-background").text(this.data.settings.activeYear);

        //this.drawLegend(rMin, rMax);
        this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator);
    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        let obj = this.data[this.data.states[0]][1][this.data.settings.activeYear];
        for (let key in obj) {
            dropData.push({
                indicator: key,
                indicator_name: key
            });
        }

        /* CIRCLE DROPDOWN */
        /*
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function (d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updateAll();
        });
        */

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function (d, i) {
            that.updateAll();
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

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
            that.updateAll();
        });

    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {
        let that = this;

        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([1985, 2015]).range([30, this.width]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input')
            .classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1985)
            .attr('max', 2015)
            .attr('step', 5)
            .attr('value', this.data.settings.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.data.settings.activeYear);

        sliderText.attr('x', yearScale(this.data.settings.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function () {
            //TODO - your code goes here -
            that.data.settings.activeYear = this.value;
            sliderText.text(this.value)
                .attr('x', yearScale(this.value));
            that.updateAll();
        });
    }

    /**
     * Draws the legend for the circle sizes
     *
     * @param min minimum value for the sizeData
     * @param max maximum value for the sizeData
     */
    drawLegend(min, max) {
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    /**
     * Reacts to a highlight/click event for a county; draws that county darker
     * and fades counties on other continents out
     */
    updateHighlightClick() {
        let points = d3.select("#points");
        if (this.data.settings.selectedCounties.length === 0)
        {
            points.selectAll("circle")
                .classed("selected-county", false)
                .classed("hidden",false);
        }
        else {
            points.selectAll("circle")
                .classed("selected-county", false)
                .classed("hidden",true);
        }
        for (let county of this.data.settings.selectedCounties)
        {
            points.select(`#${ county }`)
                .classed("hidden",false)
                .classed("selected-county", true);
        }
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
