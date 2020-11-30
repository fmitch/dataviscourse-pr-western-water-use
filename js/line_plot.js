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

    constructor(data) {

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = data.settings.cell.width - this.margin.left - this.margin.right;
        this.height = data.settings.cell.height - this.margin.top - this.margin.bottom;

        this.data = data;
        this.linecolorScale = '';
        this.countyname = [];

    }


    drawPlot(viewer) {
        let that = this;

        d3.select('#line1')
            .append('div').attr('id', 'line-chart-view');

        d3.select('#line-chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        d3.select('#placeholder1')
            .append('svg').classed('placeholder1svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append('text')
            .text("Select a county on the map to start")
            .style('fill', 'red')
            .attr("transform", "translate("+(this.margin.left+30)+","+(this.height-100)+")");
        d3.select('#placeholder2')
            .append('svg').classed('placeholder1svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append('text')
            .text("Select a county on the map to start")
            .style('fill', 'red')
            .attr("transform", "translate("+(this.margin.left+30)+","+(this.height-100)+")");

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
        this.updateplaceholder();
    }

    
    updatePlot(yIndicator) {
        this.data.plotDataLine = {};
        
        yIndicator = this.data.settings.dropOptions[yIndicator].y;

        this.data.transitionDuration = 500;
        let state = this.data.states[0];
        let activeYear = this.data.settings.activeYear
        
        this.countyname = [];

        for (let x of this.data.settings.selectedCounties){
            for (let state of this.data.states){
                for (let countyID in this.data[state]){
                    if(x == 'utah'+String(countyID)){
                        let county = this.data[state][countyID];
                        this.countyname.push(county.name);
                    }
                }
            }
        }
        
        let yMax = 0;
        let colorMax = 0;
        let yMin = 100000;
        let colorMin = yMin;
        this.regions = {}
        let lineData = {};
        // let countyname = [];
        for (let state of this.data.states){
            for (let countyID in this.data[state]){
                let county = this.data[state][countyID];
                if(this.data.settings.selectedCounties.indexOf('utah'+String(countyID)) == -1 ){
                    continue;
                }
                let valy = [];
                lineData[county.name] = [];
                // countyname.push(county.name);
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
                this.data.plotDataLine[state+(+countyID)] = dataPoint;

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

        console.log("---------------------");
        console.log(this.data.plotDataLine);
// --------------------------------------------------------------------------------------------------------------------------------------------------------
        let lineGen = d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.value));
        
        this.linecolorScale = d3.scaleOrdinal().domain(this.countyname).range(d3.schemeTableau10);
        console.log(this.countyname);
        let lineGroup = d3.select('#lines').selectAll('path').data(this.countyname);
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
        this.drawLegend();
        this.updateplaceholder();
        
    }

    
    drawLegend() {
         var that = this;
         d3.select('#line-legend').selectAll('svg').remove();
        let legendsvg = d3.select('#line-legend')
            .append('svg').classed('plot-svg-line-legend', true)
            .attr("width", this.margin.left + this.width)
            .attr("height", 300 + this.margin.top + this.margin.bottom);
        var lineLegend = d3.select('.plot-svg-line-legend')
            .selectAll(".lineLegend")
            .data(this.countyname)
            .enter()
            .append("g")
            .attr("transform", function (d,i) {
                    return "translate(" + (that.width - 50) + "," + (10 + i*20)+")";
                });
        lineLegend.append("rect")
            .attr("fill", function (d, i) {return that.linecolorScale(d); })
            .attr("width", 12)
            .attr("height", 12);

        lineLegend.append("text").text(function (d) {return d;})
            .attr("transform", "translate(17,11)"); //align texts with boxes
        }


    updateplaceholder(){
        if(this.countyname.length <1){
            d3.select('#placeholder1').classed('hidden',false);
            d3.select('#placeholder2').classed('hidden',false);
        }
        else{
            d3.select('#placeholder1').classed('hidden',true);
            d3.select('#placeholder2').classed('hidden',true);
        }

    }

}
