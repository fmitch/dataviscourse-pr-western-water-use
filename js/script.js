var active_state = "";
// states = ['utah'];
// console.log(states);
console.log(this.states);
d3.json('data/world.json').then(mapData => {
    // https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
    // https://github.com/topojson/us-atlas
    
        const worldMap = new Map(mapData, '');
        worldMap.drawMap(mapData);
document.addEventListener("click", function (e) {

        var data = topojson.feature(mapData, mapData.objects.states).features;
        let geolist = data.map(d => d.properties.name);
        console.log(geolist);
        let current_click = "";
        let classVal = e.srcElement.className; 
        
        try{
            
                current_click = e.srcElement.id; //received from the console

                if (current_click!="" && geolist.includes(current_click))
                {
                
                this.active_state = current_click;
                this.states = [this.active_state.toLowerCase()];
                // console.log(this.states);
                var newwindow = window.open("project.html",'popUpWindow');
                newwindow.states = this.states;
                } 
                else {
                }
        }
        catch(e){
            console.log("error : "+ e);
        }
    }, true);
});



