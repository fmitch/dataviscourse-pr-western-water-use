d3.json('data/world.json').then(mapData => {
    // https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
    // https://github.com/topojson/us-atlas
    var active_state = "";
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
                window.open("indexmap.html",'popUpWindow');
                } 
                else {
                   

                }
             
            
        }
        catch(e){
            console.log("error : "+ e);
        }
    }, true);
});




