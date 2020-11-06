let states = ['utah'];
loadData().then(data => {
    data.settings = {
        selectedCounties: [],
        activeYear: '2015'
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
        scatterPlot.updatePlot(xValue, yValue, xValue);
        countyMap.updateMap();
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


    scatterPlot.drawPlot();
    scatterPlot.drawYearBar();
    scatterPlot.updatePlot("precip", "temp", "precip");


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

async function loadData() {
    let data = {};
    let usageCategories = {
        population: [["Total Population total population of area, in thousands"], 1e3],
        public_supply_population: [["Public Supply total population served, in thousands"], 1e3],
        public_supply_fresh_withdrawals: [["Public Supply total self-supplied withdrawals, fresh, in Mgal/d"], 1e6],
        public_supply_domestic: [["Public Supply deliveries to domestic, in Mgal/d"], 1e6],
        public_supply_commercial: [["Public Supply deliveries to commercial, in Mgal/d"], 1e6],
        public_supply_industrial: [["Public Supply deliveries to industrial, in Mgal/d"], 1e6],
        domestic_self_supply: [["Domestic total self-supplied withdrawals, fresh, in Mgal/d"], 1e6],
        commercial_self_supply: [["Commercial total self-supplied withdrawals, fresh, in Mgal/d"], 1e6],
        industrial_self_supply: [["Industrial total self-supplied withdrawals, in Mgal/d"], 1e6],
        power_self_supply: [ ["Total Thermoelectric Power total self-supplied withdrawals, total, in Mgal/d", "Total Thermoelectric Power total consumptive use, in Mgal/d"], 1e6],
        mining_self_supply: [ ["Mining total self-supplied withdrawals, in Mgal/d"], 1e6],
        livestock_self_supply: [["Livestock total self-supplied withdrawals, fresh, in Mgal/d", "Livestock (Stock) total self-supplied withdrawals, fresh, in Mgal/d", "Livestock (Animal Specialties) total self-supplied withdrawals, fresh, in Mgal/d", "Aquaculture total self-supplied withdrawals, in Mgal/d"], 1e6],
        irrigation_self_supply: [["Irrigation, Total total self-supplied withdrawals, fresh, in Mgal/d"],1e6],
        irrigation_acres: [["Irrigation, Total sprinkler irrigation, in thousand acres","Irrigation, Total microirrigation, in thousand acres",  "Irrigation, Total surface irrigation, in thousand acres", ],1e3]
    };
    data.labels = {
        precip: "Annual Precipitation (inches)",
        temp: "Average Yearly Temperature (F)",
        population: "Population, in thousands",
        public_supply_population: "Population served by public water, in thousands",
        public_supply_fresh_withdrawals: "Public water usage, in Mgal/d",
        public_supply_domestic: "Domestic public usage, in Mgal/d",
        public_supply_commercial: "Commercial public usage, in Mgal/d",
        public_supply_industrial: "Industrial public usage, in Mgal/d",
        domestic_self_supply: "Domestic total self-supplied withdrawals, fresh, in Mgal/d",
        commercial_self_supply: "Commercial total self-supplied withdrawals, fresh, in Mgal/d",
        industrial_self_supply: "Industrial total self-supplied withdrawals, in Mgal/d",
        power_self_supply: "Water usage for Power generation, in Mgal/d",
        mining_self_supply: "Water usage for Mining, in Mgal/d",
        livestock_self_supply: "Water usage for Livestock, in Mgal/d",
        irrigation_self_supply: "Water usage for Irrigation, in Mgal/d",
        irrigation_acres: "Irrigated acres, in thousands",
    };

    for (let state of states){
        data[state] = {};
        let usage = await loadFile(`data/${state}/water_use.tsv`, d3.tsv);
        let precip = await loadFile(`data/${state}/precip.csv`);
        let temp = await loadFile(`data/${state}/temp.csv`);
        precip.forEach(entry => {
            if (!data[state].hasOwnProperty(entry.county))
            {
                data[state][+entry.county] = {
                    1985: {}, 1990: {}, 1995: {}, 2000: {},
                    2005: {}, 2010: {}, 2015: {}
                };
            }
            data[state][+entry.county][+entry.year]['precip'] = +entry.precip;
        });
        temp.forEach(entry => {
            data[state][+entry.county][+entry.year]['temp'] = +entry.temp;
        });
        usage.forEach(entry => {
            data[state][+entry.county_cd]['name'] = entry.county_nm.replace(' County', '');
            for (let key in usageCategories){
                let sum = 0; 
                usageCategories[key][0].forEach(innerKey => {
                    if (entry[innerKey] !== '-')
                        sum += +entry[innerKey]
                });
                sum *= usageCategories[key][1];
                data[state][+entry.county_cd][+entry.year][key] = sum;
            }
        });
    }
    return data;
}
