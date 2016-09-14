#include <PID_v1.h>
#include <ESP8266WiFi.h>
const int LED_PIN = 5; // Thing's onboard, green LED
const int DIGITAL_PIN = 12; // Digital pin to be read
const char HEADER[] = "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin:null\r\nAccess-Control-Allow- Methods POST, GET\r\nAccess-Control-Allow-Headers *AUTHORISED*\r\nContent-Type: text/html\r\n\r\n";
const char CONTENT[] = "<!DOCTYPE html><meta content='width=device-width,initial-scale=1'name=viewport><title>ESP8266</title><style>.canvasjs-chart-credit{display:none}</style><script>function led(t){var e=new XMLHttpRequest;t?e.open('GET','http://";
const char CONTENTTWO[] = "/led/1',!0):e.open('GET','http://192.168.0.14/led/0',!0),e.send()}window.onload=function(){var t=[],e=new CanvasJS.Chart('chartContainer',{title:{text:'Temperature'},data:[{type:'line',dataPoints:t}],exportEnabled:!0,exportFileName:'temperatureData',zoomEnabled:!0,axisY:{title:'Degress Celcius',titleFontSize:12},axisX:{title:'Milliseconds',titleFontSize:12},toolTip:{contentFormatter:function(t){return t.entries[0].dataPoint.y+' &#x2103;<br/><span style=\"font-size:.8em;\">'+t.entries[0].dataPoint.x+' ms</span>'}}}),n=0,a=100,o=300,i=300,r=function(){var r=new XMLHttpRequest;r.onreadystatechange=function(){4==r.readyState&&200==r.status&&(a=Math.round(r.responseText),t.push({x:n,y:a}),n+=o,t.length>i&&t.shift(),e.render())},r.open('GET','http://192.168.0.14/temp',!0),r.send()};r(i),setInterval(function(){r()},o)}</script><script src=https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.min.js></script><div id=chartContainer style=height:300px;width:100%></div><button onclick=led(!1)>OFF</button> <button onclick=led(!0)>ON</button>";
String IP = "";
WiFiServer server(80);
#include "max6675.h"

int ktcSO = 4;
int ktcCS = 5;
int ktcCLK = 16;


const char* ssid     = "";
const char* password = "";

unsigned long previousMillis = 0;
const long interval = 300;
unsigned long previousMillisTwo = 0;
const long intervalTwo = 2000;

MAX6675 ktc(ktcCLK, ktcCS, ktcSO);

//Define Variables we'll be connecting to
double Setpoint, Input, Output, AvgOutput;

//Specify the links and initial tuning parameters
double Kp=10, Ki=.5, Kd=1.5;
PID myPID(&Input, &Output, &Setpoint, Kp, Ki, Kd, DIRECT);

void setup()
{
  Serial.begin(9600);
  pinMode(14, OUTPUT);
  // give the MAX a little time to settle
  WiFi.mode(WIFI_AP);
  WiFi.softAP("ESPTHING", "ESP826607");
  //  WiFi.begin(ssid, password);
  
  /*while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }*/
 
  Serial.println("");
  //Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.begin();
  delay(500);
  //initialize the variables we're linked to
  Input = ktc.readCelsius();
  Setpoint = 100;

  //turn the PID on
  myPID.SetMode(AUTOMATIC);
  IP = String(WiFi.localIP());
}

void loop()
{
  unsigned long currentMillis = millis();
   if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;    
    Input = ktc.readCelsius();
    myPID.Compute();
    if (currentMillis - previousMillisTwo >= intervalTwo) {
      previousMillisTwo = currentMillis;  
          if(AvgOutput>=50){
            digitalWrite(14,HIGH);
          }else{
            digitalWrite(14,LOW);
          }
          AvgOutput=0;
    }    
    Serial.print(Input);
    Serial.print("  : ");
    Serial.print(Output);
    Serial.print("  : ");
    Serial.println(AvgOutput);
    if(AvgOutput==0){     
    AvgOutput = Output;
    }else{      
    AvgOutput = (Output+AvgOutput)/2;
    }
  }
    
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Read the first line of the request
  String req = client.readStringUntil('\r');
  Serial.println(req);
  client.flush();

  // Match the request
  int val = -1; // We'll use 'val' to keep track of both the
                // request type (read/set) and value if set.
  if (req.indexOf("/temp") != -1)
  {
    val = 1;
  }
  else if (req.indexOf("/random") != -1)
    val = 3;
  else if (req.indexOf("/set/setpoint") != -1)
  {
    //GET /temp HTTP/1.1
    Serial.println(getValue(req, 'P', 1));
    Setpoint = getValue(req, 'P', 1).toFloat();
    val = 5;
  }

  client.flush();
  if(val == 3)
  {
  client.print(HEADER+String(random(300)));
  delay(1);
  Serial.println("Client disonnected");
  }
  else if(val == 1){
      client.print(HEADER+String(Input)+":"+String(Setpoint)+":"+String(Output));
  }
  else if(val == 5){
      client.print(HEADER+String(Input)+":"+String(Setpoint)+":"+String(Output));
  }
  else
  {
  client.print(HEADER+String(CONTENT)+WiFi.localIP()+String(CONTENTTWO));
  delay(1);
  Serial.println("Client disonnected");
  }
}

String getValue(String data, char separator, int index)
{
 int found = 0;
  int strIndex[] = {
0, -1  };
  int maxIndex = data.length()-1;
  for(int i=0; i<=maxIndex && found<=index; i++){
  if(data.charAt(i)==separator || i==maxIndex){
  found++;
  strIndex[0] = strIndex[1]+1;
  strIndex[1] = (i == maxIndex) ? i+1 : i;
  }
 }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}

