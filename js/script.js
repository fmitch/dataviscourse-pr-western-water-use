let states = ['utah'];
loadData().then(data => {
    data.settings = {
        selectedCounties: [],
        activeYear: '2015',
        years: [1985,1990,1995,2000,2005,2010,2015]
    }
    data.states = states;
    let that = this;

    console.log(data)

    function updateCounty(countyID) {
        console.log(countyID);
        return;
        that.activeCounty = countyID;

        // TODO - your code goes here
        if (countyID === null)
        {
            scatterPlot.clearHighlight();
            countyMap.clearHighlight();
            infoBox.clearHighlight();
        }
        else
            scatterPlot.updateHighlightClick(countyID);
            countyMap.updateHighlightClick(countyID);
            infoBox.updateTextDescription(countyID);

    }

    function updateAll() {
        let xValue = d3.select('#dropdown_x').select('.dropdown-content').select('select').node().value;
        let yValue = d3.select('#dropdown_y').select('.dropdown-content').select('select').node().value;
        //let cValue = d3.select('#dropdown_c').select('.dropdown-content').select('select').node().value;
        console.log(data.settings.selectedCounties);
        scatterPlot.updatePlot(xValue, yValue, xValue);
        countyMap.updateMap();
        focusLines.updatePlot();
        if (data.settings.activeCounty !== null){
            scatterPlot.updateHighlightClick()
            countyMap.updateHighlightClick();
            //infoBox.updateTextDescription()
        }
    }
    // Creates the view objects
    //const infoBox = new InfoBox(data);
    const countyMap = new CountyMap(data, updateAll);
    const scatterPlot = new ScatterPlot(data, updateAll);
    const focusLines = new FocusLines(data, updateAll);


    scatterPlot.drawPlot();
    scatterPlot.drawYearBar();
    scatterPlot.updatePlot("precip", "temp", "precip");
    focusLines.drawPlot();
    focusLines.updatePlot();


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
