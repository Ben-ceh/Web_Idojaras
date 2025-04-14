//47.53333 21.63333
//47.53333 21.644821

let latitude = 47.53333
let longitude = 21.63333

fetchFuggveny()

function keres() {
    let ujLat = document.getElementById("lat").value
    let ujLong = document.getElementById("long").value
    latitude = ujLat
    longitude = ujLong
    fetchFuggveny()

}
function fetchFuggveny() {
 fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`)
.then(x=>x.json())
.then(y=>megJelenit(y))   
}




function megJelenit(y){
    console.log(y)

    document.getElementById("koordinatak").innerHTML=`
    Szélesség: ${y.longitude} Hosszúság: ${y.latitude}

    `

    let sz=`
    <table>
    <tr>
    <th>Dátum</th>
    <th>Idő</th>
    <th>Hőmérséklet</th>
    </tr>
    `
    for (let i = 0; i < y.hourly.time.length; i++) {
        let kecske=y.hourly.time[i].split("T")
        sz+=`
        <tr>
        <td>${kecske[0]}</td>
        <td>${kecske[1]}</td>
        <td>${y.hourly.temperature_2m[i]}</td>
        </tr>
        `
        
    }
    sz+="</table>"
    document.getElementById("tablazat").innerHTML=sz

    //diagram óránként
    var data = [
        {
          x: y.hourly.time,
          y: y.hourly.temperature_2m,
          type: 'bar'
        }
      ];
      
      Plotly.newPlot('myDiv', data);

    //diagram minimum hőm
    let minIdoTomb=[]
    let minHomTomb=[]

    let legkisebbIdo=y.hourly.time[0]
    let legkisebbHom=y.hourly.temperature_2m[0]

    for (let i = 0; i < y.hourly.time.length; i++) {
        if (i%24!=0 &&  y.hourly.temperature_2m[i]<legkisebbHom){
            kecske=y.hourly.time[i].split("T")
            legkisebbIdo=kecske[0]
            //legkisebbIdo= y.hourly.time[i]
            legkisebbHom=y.hourly.temperature_2m[i]
        }
        if ((i%24==0 && i!=0) || i==y.hourly.time.length-1){
            console.log(i+legkisebbIdo+legkisebbHom)
            minIdoTomb.push( legkisebbIdo)
            minHomTomb.push( legkisebbHom)
            legkisebbIdo=y.hourly.time[i]
            legkisebbHom=y.hourly.temperature_2m[i]
            
        }
        
    }
    console.log(minIdoTomb)
    console.log(minHomTomb)
    var dataMin = [
        {
          x: minIdoTomb,
          y: minHomTomb,
          type: 'bar'
        }
      ];
     
      Plotly.newPlot('minDiv', dataMin);


    let maxIdoTomb=[]
    let maxHomTomb=[]
    for (let i = 0; i < 7; i++) {
        let legnIdo=""
        let legnagyobb=y.hourly.temperature_2m[i*24]
        for (let j = 0; j < 24; j++) {
            if (y.hourly.temperature_2m[i*24+j]>legnagyobb){
                legnIdo=y.hourly.time[i*24+j]
                kecske=legnIdo.split("T")
                legnIdo=kecske[0]
                legnagyobb=y.hourly.temperature_2m[i*24+j]
            }
          
        }
        maxIdoTomb.push(legnIdo)
        maxHomTomb.push(legnagyobb) 
        
    }
    console.log(maxIdoTomb)
    console.log(maxHomTomb)
    //diagram Max
    var dataMax = [
        {
        x: maxIdoTomb,
        y: maxHomTomb,
        type: 'bar'
        }
    ];
    
    Plotly.newPlot('maxDiv', dataMax);


    //diagram összehasonlit min-max
    var trace1 = {

        x: minIdoTomb,
      
        y: minHomTomb,
      
        name: 'Minimum hőmérsékletek',
      
        type: 'bar',

        marker:{
            color:"purple"
        }
      
      };
      
      
      var trace2 = {
      
        x: maxIdoTomb,
      
        y: maxHomTomb,
      
        name: 'Maximum hőmérsékletek',
      
        type: 'bar',

        marker:{
            color:"green"
        }
      
      };
      
      
      var dataHasonlit = [trace1, trace2];
      
      
      var layout = {barmode: 'group'};
      
      
      Plotly.newPlot('hasonlitDiv', dataHasonlit, layout);

//Térkép

var dataTerkep = [

    {

        type: "scattermap",

        text: "Debrecen",

        lon: [longitude],

        lat: [latitude],

        marker: { color: "fuchsia", size: 4 }

    }

];


var layout = {

    dragmode: "zoom",

    map: { style: "open-street-map", center: { lat: latitude, lon: longitude }, zoom: 10 },

    margin: { r: 0, t: 0, b: 0, l: 0 }

};


Plotly.newPlot("myDivTerkep", dataTerkep, layout);

}