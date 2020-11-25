class AutoSelector {

    constructor(data, updateAll) {
        this.data = data
        this.updateAll = updateAll;
    }

    defaultDistance(a,b){
        let popScale = 10;
        let precipScale = 1;
        let tempScale = 1;
        return Math.sqrt( ((a.population-b.population)/popScale)**2  + ((a.precip - b.precip )/precipScale)**2 + ((a.temp - b.temp)/tempScale)**2); 
    }

    getClosest(focusCounty, counties, distance=this.defaultDistance){
        // Default metric is Sqrt( (a_pop - b_pop )/ 100,000 **2  + (a_precip - b_precip )/ 1 **2 + (a_temp - b_temp) / 1 ** 2
        let activeYear = this.data.settings.activeYear;
        counties.sort(function(a,b) {
            return distance(focusCounty[activeYear], a.county[activeYear]) - distance(focusCounty[activeYear], b.county[activeYear]);
        });
        let countyKeys = []
        for (let i=0; i<5; i++){
            countyKeys.push(counties[i].key)
        }
        return countyKeys;
    }

    autoSelect() {
        let focusKey = this.data.settings.focusCounty;
        if (focusKey === undefined || focusKey === null){
            this.data.settings.selectedCounties = [];
            return;
        }
        let focusState = focusKey.replace(/[0-9]/g, '');
        let focusCounty = +focusKey.replace(/[A-z]/g, '');
        focusCounty = this.data[focusState][focusCounty]
        let counties = [];

        for (let state of this.data.states){
            for (let countyKey in this.data[state]){
                counties.push({key: state+countyKey, county: this.data[state][countyKey]});
            }
        }
        let closest = this.getClosest(focusCounty, counties);
        this.data.settings.selectedCounties = closest;
    }
}