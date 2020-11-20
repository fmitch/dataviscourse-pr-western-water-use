/**
 * A file loading function for CSVs
 * @param file
 * @returns {Promise<T>}
 */
async function loadFile(file, loaderFunc = d3.csv) {
    let data = await loaderFunc(file).then(d => {
        let mapped = d.map(g => {
            for (let key in g) {
                let numKey = +KeyboardEvent;
                if (numKey) {
                    g[key] = +g[key];
                }
            }
            return g;
        });
        return mapped;
    });
    return data;
}

async function loadData() {
    let data = {};
    let usageCategories = {
        population: [["Total Population total population of area, in thousands"], 1e3],
        domestic_commercial_supply: [["Public Supply total self-supplied withdrawals, fresh, in Mgal/d", "Domestic total self-supplied withdrawals, fresh, in Mgal/d","Commercial total self-supplied withdrawals, fresh, in Mgal/d"], 1e6],
        industrial_self_supply: [["Industrial total self-supplied withdrawals, in Mgal/d","Total Thermoelectric Power total self-supplied withdrawals, total, in Mgal/d", "Total Thermoelectric Power total consumptive use, in Mgal/d"], 1e6],
        mining_self_supply: [ ["Mining total self-supplied withdrawals, in Mgal/d"], 1e6],
        livestock_self_supply: [["Livestock total self-supplied withdrawals, fresh, in Mgal/d", "Livestock (Stock) total self-supplied withdrawals, fresh, in Mgal/d", "Livestock (Animal Specialties) total self-supplied withdrawals, fresh, in Mgal/d", "Aquaculture total self-supplied withdrawals, in Mgal/d"], 1e6],
        irrigation_self_supply: [["Irrigation, Total total self-supplied withdrawals, fresh, in Mgal/d"],1e6],
        irrigation_acres: [["Irrigation, Total sprinkler irrigation, in thousand acres","Irrigation, Total microirrigation, in thousand acres",  "Irrigation, Total surface irrigation, in thousand acres", ],1e3]
    };
    data.labels = {
        precip: "Annual Precipitation (inches)",
        temp: "Average Yearly Temperature (F)",
        population: "Population, in thousands",
        domestic_commercial_supply: "Public Water Usage, in Mgal/d",
        industrial_self_supply: "Industrial Water Usage, in Mgal/d",
        mining_self_supply: "Mining Water Usage, in Mgal/d",
        livestock_self_supply: "Livestock Water Usage, in Mgal/d",
        irrigation_self_supply: "Irrigation Water Usage, in Mgal/d",
        irrigation_acres: "Irrigated Acres, in thousands",
        //Derived data
        irrigation_per_acre: 'Irrigation per Acre, Mgal/d',
        total_water: 'Total Water Usage, in Mgal/d',
    };
    data.axisVariables = {
    }
    console.log(states);
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
            let total_water = 0
            for (let key in usageCategories){
                let sum = 0; 
                usageCategories[key][0].forEach(innerKey => {
                    if (entry[innerKey] !== '-')
                        sum += +entry[innerKey]
                });
                //sum *= usageCategories[key][1];
                data[state][+entry.county_cd][+entry.year][key] = sum;
                if (key.includes('supply'))
                    total_water += sum
            }
            data[state][+entry.county_cd][+entry.year].irrigation_per_acre = data[state][+entry.county_cd][+entry.year].irrigation_self_supply / data[state][+entry.county_cd][+entry.year].irrigation_acres;

            data[state][+entry.county_cd][+entry.year].total_water = total_water;
        });
    }
    data.linecolor = [false,''];
    return data;
}