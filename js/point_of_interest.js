/** Class representing the scatter plot view. */
class FocusLines {

    constructor(data) {

        this.margin = { top: 20, right: 20, bottom: 20, left: 50 };
        this.width = 450 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.data = data;
        let categories = Object.keys(this.data['utah'][1][1985]);
        this.water_categories = [];
        for (let category of categories){
            if (category.includes('supply')) { 
                this.water_categories.push(category);
            }
        }
        this.colorScale = d3.scaleOrdinal().domain(this.water_categories).range(d3.schemeTableau10);
    }

    /**
     * Sets up the plot, axes
     */
    drawPlot() {
        // poi-line-div is set in project.html, referencing div containing plot.
        d3.select('#poi-line-div')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#poi-line-div').select('.plot-svg').append('g').classed('wrapper-group', true).attr("transform", "translate("+this.margin.left+","+this.margin.top+")");

        let plot = d3.select('#poi-line-div').select(".wrapper-group")
        // Add group for paths
        plot.append("g").attr("id","poi-lines");
        // Add group for x-axis
        plot.append("g").classed("x-axis", true)
            .attr("id","poi-line-x-axis")
            .attr("transform","translate(0,"+this.height+ ")");
        plot.append("text").classed("poi-line-axis-label-x",true);
        // Add group for y-axis
        plot.append("g").classed("y-axis", true)
            .attr("id","poi-line-y-axis");
        plot.append("text").classed("poi-line-axis-label-y",true);
        plot.append("text")
            .attr('id', 'poi-county-title')
            .attr("transform",`translate(${this.margin.left/2},${-this.margin.top/3})`)
            .attr('text-anchor', 'center')
            .text('');
        
        //let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);
        this.drawLegend();
    }

    drawBars() {
        d3.select('#poi-bar-div')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        let svgGroup = d3.select('#poi-bar-div').select('.plot-svg')
            .append('g').classed('wrapper-group', true)
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
        let plot = d3.select('#poi-bar-div').select('.wrapper-group')
        plot.append('g').attr('id', 'poi-bars');
        plot.append('g').classed('x-axis', true)
            .attr("id","poi-bar-x-axis")
            .attr("transform","translate(0,"+this.height+ ")");
        plot.append("text").classed("poi-bar-axis-label-x",true);
        // Add group for y-axis
        plot.append("g").classed("y-axis", true)
            .attr("id","poi-bar-y-axis");
        plot.append("text").classed("poi-bar-axis-label-y",true);
    }

    updateBars() {
        let selectedCounties = this.data.settings.selectedCounties.slice();
        selectedCounties.sort((a,b) => +a.replace(/[A-z]/g, '') - +b.replace(/[A-z]/g, ''))
        if (this.data.settings.focusCounty !== null)
            selectedCounties.unshift(this.data.settings.focusCounty);
        let activeYear = this.data.settings.activeYear;
        let numCounties = this.data.settings.selectedCounties.length;

        let barData = [];
        let totalWater = {};
        let maxWidth = 0;
        for (let county of selectedCounties){
            let countyWater = 0;
            let currentState = county.replace(/[0-9]/g, '');
            let currentCounty = +county.replace(/[A-z]/g, '');
            let obj = this.data[currentState][currentCounty][activeYear];
            for (let key of this.water_categories) {
                barData.push({
                    start: countyWater,
                    value: obj[key], 
                    category: key,
                    county: county,
                });
                countyWater += obj[key];
            }
            maxWidth = countyWater > maxWidth ? countyWater : maxWidth;
            totalWater[county] = countyWater;
        }

        let xScale = d3.scaleLinear().range([0,this.width]).domain([0,1]).nice();
        let axisXLabel = d3.select('#poi-bars')
            .select(".poi-bar-axis-label-x")
            .text('Percentage of Water Used')
            .style("text-anchor", "middle")
            .attr("transform", "translate("+this.width/2+","+(this.height+35)+")");
        let xAxis = d3.select("#poi-bar-x-axis").call(d3.axisBottom(xScale).tickValues([.1,.2,.3,.4,.5,.6,.7,.8,.9,1]).tickFormat(d3.format('.0%')));

        let yScale = d3.scaleLinear()
            .range([0,this.height/Math.max(numCounties, 4)])
            .domain([0,maxWidth]).nice();
        let bandScale = d3.scaleBand()
            .domain(selectedCounties)
            .range([0, this.height])
            .paddingInner(0.05)
            .align(0.1);
        d3.select('#poi-bar-div').select('.wrapper-group').select('.y-axis')
            .attr("transform", `translate(0,${-bandScale.bandwidth()/2})`)
            .call(d3.axisLeft(bandScale).tickFormat(x => {
                let currentState = x.replace(/[0-9]/g, '');
                let currentCounty = +x.replace(/[A-z]/g, '');
                return this.data[currentState][currentCounty].name;
            }));
        
        d3.select('#poi-bar-div').select('.wrapper-group').select('.y-axis').select('.domain').remove();

        /*
        axisYLabel.text('Million Gallons per day')
            .style("text-anchor", "middle")
            .attr("transform", "translate(-35,"+(this.height/2)+") rotate(-90)");
        let yAxis = d3.select("#poi-bar-y-axis").call(d3.axisLeft(yScale));
        */

        let rectGroup = d3.select('#poi-bars').selectAll('rect').data(barData);
        rectGroup.join('rect')
            .attr('x', d => xScale(d.start/totalWater[d.county]))
            .attr('y', d => bandScale(d.county))
            .attr('height', d => yScale(totalWater[d.county]))
            .attr('width', d => xScale(d.value/totalWater[d.county]))
            .attr('fill', d => this.colorScale(d.category))
            .transition()
            .duration(this.data.transitionDuration);
        rectGroup.exit().remove();

    }

    /**
     * Renders the plot for the parameters specified
     */
    updateFocus() {
        let activeYear = this.data.settings.activeYear;
        // Ideally we'll have a separate focusCounty, right now I'm using the first
        let county = this.data.settings.focusCounty;
        if (county === null)
        {
            if (this.data.settings.selectedCounties.length > 0)
                this.showLegend(true);
            else
                this.showLegend(false);
            this.showLines(false);
            return;
        }
        let focusState = county.replace(/[0-9]/g, '');
        let focusCounty = +county.replace(/[A-z]/g, '');

        // Total values which are used to convert to percentage
        let yMin = 0
        let yMax = 0;
        // Make array of data so it reads nicely into lineGen function
        let lineData = {};

        for (let category of this.water_categories){
            lineData[category] = [];
            for (let year of this.data.settings.years){
                let value = this.data[focusState][focusCounty][year][category];
                if (yMax < value) {
                    yMax = value;
                }
                lineData[category].push({
                    value: value,
                    year: year});
            }
        }

        let xMin = 1985;
        let xMax = 2015;

        let xScale = d3.scaleLinear().range([0,this.width]).domain([xMin,xMax]).nice();
        /*
        let axisXLabel = d3.select('#poi-lines')
            .select(".poi-line-axis-label-x")
            .text(this.data.labels[xIndicator])
            .style("text-anchor", "middle")
            .attr("transform", "translate("+this.width/2+","+(this.height+35)+")");
            */
        let xAxis = d3.select("#poi-line-x-axis").call(d3.axisBottom(xScale).tickValues(this.data.settings.years).tickFormat(d3.format('.4')));

        let yScale = d3.scaleLinear().range([0,this.height]).domain([yMax,yMin]).nice();
        let axisYLabel = d3.select('.poi-line-axis-label-y');

        axisYLabel.text('Million Gallons per day')
            .style("text-anchor", "middle")
            .attr("transform", "translate(-35,"+(this.height/2)+") rotate(-90)");
        
        let yAxis = d3.select("#poi-line-y-axis");
        yAxis.call(d3.axisLeft(yScale));

        let lineGen = d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.value));

        // Data are categories (each line that is drawn), serves as key to lineData[key] for lineGen
        let lineGroup = d3.select('#poi-lines').selectAll('path').data(this.water_categories);
        lineGroup.join('path')
            .attr('fill', 'none')
            .classed('line-path', true)
            .attr('stroke', d => this.colorScale(d))
            .attr('d', d => {
                return lineGen(lineData[d]) })
            .transition()
            .duration(this.data.transitionDuration);
        lineGroup.exit().remove();

        d3.select("#poi-county-title").text(this.data[focusState][focusCounty].name);
        this.showLegend(true);
        this.showLines(true);
    }

    /**
     * Draws the legend for the color categories
     *
     */
    drawLegend() {
        d3.select('#poi-legend')
            .append('svg').classed('plot-svg', true)
            .attr("width", '100px')
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let legendGroup = d3.select('#poi-legend').select('.plot-svg')
            .append('g')
            .attr("transform", `translate(0,${this.margin.top})`);
        let legendOrdinal = d3.legendColor().scale(this.colorScale);
        legendGroup.call(legendOrdinal);
        this.showLegend(false);
    }

    showLegend(shouldShow){
        let div = d3.select('#poi-legend')
            .classed('hidden', !shouldShow);
    }

    showBars(shouldShow){
        let div = d3.select('#poi-bar-div')
            .classed('hidden', !shouldShow);
    }

    showLines(shouldShow){
        let div = d3.select('#poi-line-div')
            .classed('hidden', !shouldShow);
    }
}
