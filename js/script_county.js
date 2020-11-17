
// ---------------------------------------------------------
let states = window.states;
console.log(states);
if (states === undefined)
    states = ['utah'];

loadData().then(data => {
    data.settings = {
        selectedCounties: [],
        activeYear: '2015',
        years: [1985,1990,1995,2000,2005,2010,2015],
        focusCounty: null
    }
    data.states = states;
    let that = this;
    console.log(data)

    function updateAll() {
        let xValue = d3.select('#dropdown_x').select('.dropdown-content').select('select').node().value;
        let yValue = d3.select('#dropdown_y').select('.dropdown-content').select('select').node().value;
        //let cValue = d3.select('#dropdown_c').select('.dropdown-content').select('select').node().value;
        scatterPlot.updatePlot(xValue, yValue, xValue);
        countyMap.updateMap();
        focusLines.updateFocus();
        focusLines.updateBars();

        scatterPlot.updateHighlightClick()
        countyMap.updateHighlightClick();
    }

    function updateAllLine() {
        let yValue = d3.select('#dropdown_y-line').select('.dropdown-content').select('select').node().value;
        //let cValue = d3.select('#dropdown_c').select('.dropdown-content').select('select').node().value;
        line1.updatePlot(yValue);
    }
    // Creates the view objects
    //const infoBox = new InfoBox(data);
    const countyMap = new CountyMap(data, updateAll);
    const scatterPlot = new ScatterPlot(data, updateAll);
    const focusLines = new FocusLines(data, updateAll);
    const line1 = new LinePlot(data,updateAllLine);
    
    console.log("data line");
    line1.drawPlot();
    line1.updatePlot("precip");
    scatterPlot.drawPlot();
    scatterPlot.drawYearBar();
    scatterPlot.updatePlot("precip", "temp", "precip");
    focusLines.drawPlot();
    focusLines.drawBars();
    focusLines.updateFocus();
    focusLines.updateBars();



    // here we load the map data
    async function drawMap() {
        let countyData = await d3.json('data/us_counties.json');
        let stateData = await d3.json('data/us_states.json');
        let dividedCounties = {};
        let codes = {};
        for (let state of stateData.features){
            codes[+state.properties.STATE] = state.properties.NAME.toLowerCase();
            dividedCounties[state.properties.NAME.toLowerCase()] = {
                features: [], 
                state_features: state, 
                type:'FeatureCollection'}
        }
        for (let county of countyData.features){
            let name = codes[+county.properties.STATE];
            dividedCounties[name].features.push(county);
        }
        countyMap.drawMap(dividedCounties);
    }
    drawMap();

    // This clears a selection by listening for a click
    //document.addEventListener("click", function (e) {
    //    updateCounty(null);
    //}, true);
});