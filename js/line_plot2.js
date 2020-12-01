

/** Class representing the line2 plot view. */
class LinePlot2 {

    constructor(data) {

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = data.settings.cell.width - this.margin.left - this.margin.right;
        this.height = data.settings.cell.height - this.margin.top - this.margin.bottom;

        this.data = data;
        this.linecolorScale ='';
        this.countyname = [];

    }

    /**
     * Sets up the plot, axes,
     */

    drawPlot(viewer) {
        let that = this;
        
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
    }

    updatePlot(yIndicator) {
        this.data.plotDataLine = {};
        
        yIndicator = this.data.settings.dropOptions[yIndicator].x;
        this.data.transitionDuration = 500;
        let state = this.data.states[0];
        let activeYear = this.data.settings.activeYear
        // let selectedcounties = [];
        this.countyname = [];

        for (let x of this.data.settings.selectedCounties){
            for (let state of this.data.states){
                for (let countyID in this.data[state]){
                    if(x == state+String(countyID)){
                        let county = this.data[state][countyID];
                        this.countyname.push(county.name);
                    }
                }
            }
        }
        
        
        let yMax = 0;
        let yMin = 100000;
        let lineData = {};
        let countyname = [];
        for (let state of this.data.states){
            for (let countyID in this.data[state]){
                let county = this.data[state][countyID];
                if(this.data.settings.selectedCounties.indexOf(state+String(countyID)) == -1 ){
                    continue;
                }
                let valy = [];
                lineData[county.name] = [];
                for (let i = 1985; i<=2015; i+=5){
                    let value = county[i][yIndicator];
                    let year = i;
                    
                    lineData[county.name].push({value: value,
                                 year: year});
                    if (+county[i][yIndicator] > yMax)
                        yMax = +county[i][yIndicator];
                    if (+county[i][yIndicator] < yMin)
                        yMin = +county[i][yIndicator];
                    }

                let dataPoint = new DataPointLine(county.name, valy, countyID);
                this.data.plotDataLine[state+(+countyID)] = dataPoint;

            }
        }
        
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
        

        console.log("---------------------");
        console.log(this.data.plotDataLine);
// --------------------------------------------------------------------------------------------------------------------------------------------------------
        let lineGen = d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.value));
        
        this.linecolorScale = d3.scaleOrdinal().domain(this.countyname).range(['#00ff00','#87CEEB', '#4000ff','#ff0080','#DAA520']);
        console.log(this.countyname);
        let lineGroup = d3.select('#lines2').selectAll('path').data(this.countyname);
        console.log(lineGroup);
        lineGroup.join('path')
        .attr("fill",'none')
          .attr("stroke", d => this.linecolorScale(d))
          .attr("stroke-width", 1)
          .attr('opacity', 0.8)
            .classed('line-path', true)
            .attr('d', d => {
                return lineGen(lineData[d]) })
            .append("svg:title")
          .text(function(d, i) { return d; })
        lineGroup.exit().remove();

        d3.select('#line2-y-label').text(this.data.labels[yIndicator]);
       
    }

}
