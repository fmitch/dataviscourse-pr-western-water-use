
// ---------------------------------------------------------
/*
if(!window.states && (document. title == 'County')){
    console.log("Undefined");
    console.log(window.states);
    alert("Note: You will have to select a state again to proceed to statistics. Thankyou!");
    window.location.replace("index.html");
                  
} 
*/

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

console.log(document. title);
//let states = window.states;
//if (states === undefined)
let states = ['utah']
let allStates = ['arizona', 'california', 'colorado', 'idaho', 'montana', 
                  'nevada', 'new mexico', 'oregon','utah', 'washington', 'wyoming'];
console.log(states);

loadData(allStates).then(data => {
    data.settings = {
        selectedCounties: [],
        activeYear: '2015',
        years: [1985,1990,1995,2000,2005,2010,2015],
        focusCounty: null,
        cell: { width: 440, height: 340}
    }
    data.allStates = allStates;
    data.settings.dropOptions = [
        {
            key: 0,
            label: 'Common Water Usage vs Population', 
            x: 'population', y: 'domestic_commercial_supply'},
        {
            key: 1,
            label: 'Total Water Usage vs Population', 
            x: 'population', y: 'total_water'},
        {
            key: 2,
            label: 'Total Water Usage vs Temperature', 
            x: 'temp', y: 'total_water'},
        {
            key: 3,
            label: 'Total Water Usage vs Precipitation', 
            x: 'precip', y: 'total_water'},
        {
            key: 4,
            label: 'Irrigation per Acre vs Temperature', 
            x: 'temp', y: 'irrigation_per_acre'},
        {
            key: 5,
            label: 'Irrigation per Acre vs Precipitation', 
            x: 'precip', y: 'irrigation_per_acre'},
    ];

    data.states = states;
    let that = this;
    console.log(data)

    function updateAll() {
        console.log(data)
        let categoryValue = d3.select('#dropdown_category').select('.dropdown-content').select('select').node().value;
        scatterPlot.updatePlot(categoryValue);
        countyMap.updateMap();
        focusLines.updateFocus();
        focusLines.updateBars();
        line1.updatePlot(categoryValue);
        line2.updatePlot(categoryValue);
        scatterPlot.updateHighlightClick()
        countyMap.updateHighlightClick();
    }

    
    const countyMap = new CountyMap(data, updateAll);
    const scatterPlot = new ScatterPlot(data, updateAll);
    const focusLines = new FocusLines(data, updateAll);
    const line1 = new LinePlot(data);
    const line2 = new LinePlot2(data);
    
    console.log("data line");
    line1.drawPlot();
    line1.updatePlot(0);
    line2.drawPlot();
    line2.updatePlot(0);
    scatterPlot.drawPlot();
    scatterPlot.drawYearBar();
    scatterPlot.updatePlot(0);
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

    async function drawMapUSA(data2,updateAll,drawMap) {

        d3.json('data/world.json').then(mapData => {
    // https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
    // https://github.com/topojson/us-atlas
        const worldMap = new Mapsmall(mapData, data2,updateAll,drawMap);
        worldMap.drawMap(mapData);
        });
    }
    
    drawMap();
    drawMapUSA(data,updateAll,drawMap);

});