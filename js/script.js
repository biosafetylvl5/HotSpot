var ip = "192.168.0.13";

var avgY;
var yVal;
var cyVal;
//document.designMode='on';
window.onload = function () {

    var dps = []; // dataPoints

    var chart = new CanvasJS.Chart("chartContainer", {
        title: {},
        data: [{
            markerType: "none",
            type: "line",
            color: "#F44336",
            dataPoints: dps

        }],
        exportEnabled: true,
        exportFileName: "temperatureData",
        zoomEnabled: true,
        axisY: {
            gridThickness: 0
        },
        axisX: {
            interval: 20000
        },
        toolTip: {
            contentFormatter: function (e) {
                return e.entries[0].dataPoint.y + " &#x2103;<br/><span style='font-size:.8em;'>" + e.entries[0].dataPoint.x + " ms</span>";
            }
        }
    });
    avgY = 0;
    var x = 6;
    var xVal = 0;
    yVal = 100;
    var updateInterval = 1000;
    var dataLength = 300; // number of dataPoints visible at any point

    var updateChart = function () {


        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //alert(xhttp.responseText);
                var responces = xhttp.responseText.split(":");
                //alert(responces);
                //document.getElementById('current').innerHTML = Math.round(responces[0]);
                document.getElementById('setpoint').innerHTML = Math.round(responces[1]);
                document.getElementById('output').innerHTML = Math.round((responces[2]/255)*100);
                yVal = Math.round(responces[0]);
                temp = responces[0];
                setpoint = responces[1];
                yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
                dps.push({
                    x: xVal,
                    y: yVal
                });
                xVal = xVal + updateInterval;

                if (dps.length > dataLength) {
                    dps.shift();
                }
                //alert(yVal);
                chart.render();
                x = x+1;
                if(x>1){
                    x=0;
                    cyVal = yVal;
                    bar.animate(cyVal/responces[1]);
                }
            }
        };

        xhttp.open("GET", "http://"+ip+"/temp", true);
        xhttp.send();

    };

    // generates first set of dataPoints
    //updateChart(dataLength);

    // update chart after specified time.
    setInterval(function () {
        updateChart()
    }, updateInterval);

};

function led(on) {

    var xhttp = new XMLHttpRequest();
    if (on) {
        xhttp.open("GET", "http://"+ip+"/led/1", true);
    } else {
        xhttp.open("GET", "http://"+ip+"/led/0", true);
    }
    xhttp.send();
}
function setSetPoint(){
    var setpoint = prompt("Please enter the desired setpoint", document.getElementById('setpoint').innerHTMLexit);
    if (setpoint != null) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://"+ip+"/set/setpointP"+setpoint+"P", true);
        xhttp.send();
        //alert("http://"+ip+"/set/setpoint%"+setpoint+"%");
    }
}
function reflowSetPoint(temp, addition, max) {
    var xhttp = new XMLHttpRequest();
    var point = (Math.round(temp) + addition);
    if (point < max) {
        xhttp.open("GET", "http://" + ip + "/set/setpointP" + point + "P", true);
        console.log("Setting... " + (Math.round(temp) + addition));
    } else {
        xhttp.open("GET", "http://" + ip + "/set/setpointP" + (Math.round(max)) + "P", true);
        console.log("Setting... " + (Math.round(temp) + addition));
        clearInterval(refreshIntervalID);
        refreshMode();
    }
    xhttp.send();
}
function reflowF() {
    document.getElementById("setBtn").disabled = true;
    refreshIntervalID = setInterval(function () {
        reflowSetPoint(setpoint, 10, 160);
    }, 5000);
}
function soak() {
    console.log("Starting Soak...");
    reflowSetPoint(160, 0, 165);
    setTimeout(function () {
        refreshMode();
    }, 90000);
}
function rPeak() {
    refreshIntervalID = setInterval(function () {
        reflowSetPoint(setpoint, 10, 250);
    }, 5000);
}
function peak() {
    reflowSetPoint(250, 0, 255);
    setTimeout(function () {refreshMode();
    }, 7000);
}
function cooling() {
    if (setpoint > 10) {
        reflowSetPoint(setpoint, -15, 255);
        setTimeout(cooling, 5000);
    } else {
        coolingB = false;
        rampB = true;
        checkIfCool();
    }
}
function checkIfCool(){
    if(temp<30){
        reflow.animate(1);
        document.getElementById('setBtn').disabled = false;
    }else{
        console.log("Still cooling... "+temp);
        setTimeout(checkIfCool, 500);
    }
}
function animateGraph(){
    /*
     if(path.value()==1){
     document.getElementById('state').innerHTML = "Start?";
     }
     else if(path.value()>.605){
     document.getElementById('state').innerHTML = "Cool";
     }
     else if(path.value()>.46){
     document.getElementById('state').innerHTML = "Ramp Up";
     }
     else if(path.value()>.255){
     document.getElementById('state').innerHTML = "Soak";
     }
     else{
     document.getElementById('state').innerHTML = "Preheat";
     }
     */
    if (rampB) {
        reflow.animate(.25);
        console.log(.25);
    } else if (soakB) {
        reflow.animate(.45);
        console.log(.45);
    } else if (rPeakB) {
        reflow.animate(.55);
        console.log(.55);
    } else if (peakB) {
        reflow.animate(.6);
        console.log(.6);
    }else if (coolingB){
        reflow.animate(.99);
    }
}

function refreshMode() {
    console.log("Refreshing mode...");
    if (rampB) {
        rampB = false;
        soakB = true;
        animateGraph();
        console.log("Soak.");
        soak();
    } else if (soakB) {
        soakB = false;
        rPeakB = true;
        animateGraph();
        console.log("Ramping to Peak.");
        rPeak();
    } else if (rPeakB) {
        rPeakB = false;
        peakB = true;
        animateGraph();
        console.log("Peak");
        peak();
    } else if (peakB) {
        peakB = false;
        coolingB = true;
        animateGraph();
        console.log("Cooling");
        cooling();
    }
}
rampB = true;
soakB = false;
rPeakB = false;
peakB = false;
coolingB = false;
iTime = 0;
iTemp = -1;
first = true;

function reflowInit() {
    //reflow.animate(0);
    initialTime = Date.now();
    animateGraph();
    reflowF();
}