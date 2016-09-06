# HotSpot

HotSpot is an ESP8266 powered hotplate designed for use in small reflow operations.

## Software

### Software Installation

1. Download/Clone repository
2. Extract if nessesary
3. Open hotspot.html using Google Chrome, FireFox or Microsoft Edge

### Software Usage

The hotspot user interface is written in html, javascript and css. If those sound familiar, they should. These are the langudges that make up the web, and you already have the viewer installed. The UI runs 
in any modern browser and communicates with the hotspot via wifi.

Screenshot:

<img src="./github/hotspot-full-screenshot.png" alt="HotSpot UI Screenshot" align="center" />

#### Controls

##### On Button
The on button starts the reflow process. Make sure your board is in position, because there is no delay before the initial ramp.

##### Off Button
The off button stops any current reflow proccess.

##### Set Button
The set button can be used to set hotspot to a specific temperature for an unlimited amount of time.

##### Temperature Graph
The temperature graphs displays the measured temperature in relation to time (in milliseconds).

##### Hamburger button
![Hamburger button](./github/hamburger.png)

The hamburger button can be clicked to export the temperature graph to a png or jpg image

##### Information Arena
![Information Arena](./github/info.png)

The information arena contains information about HotSpot's current status.
The Output and Input are indicated along with a graphical representation of the setpoint vs the current point. The target temperature can be directly edited just like a normal textbox.

##### Status Bar
The status bar is a graphical representation of the progress of a currently running reflow process.
The label under the bar indicates the current stage in conjunction with the color and position of the bar.

## Hardware

![Breadboard Layout](./github/breadboard-layout.png)

### BOM (Bill of Materials)

| Part                | Price ($)|
|---------------------|-------|
| [MAX6675 Module](http://www.ebay.com/itm/201560353188?_trksid=p2060353.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT)      | 4.59  |
| [Thermal Compound](http://www.ebay.com/itm/112001034146?_trksid=p2060353.m1438.l2649&ssPageName=STRK%3AMEBIDX%3AIT)    | 1.51  |
| [K type thermocouple](http://www.ebay.com/itm/171920541812?_trksid=p2060353.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT) | 1.06  |
| 2 x [MCH Heater](http://www.ebay.com/itm/321728796330?_trksid=p2060353.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT)      | 22.13 |
| [NodeMcu](http://www.ebay.com/itm/112037403030?_trksid=p2060353.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT)             | 3.48  |
| [5V SPDT Relay](http://www.ebay.com/itm/400244727175?_trksid=p2060353.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT)       | 1.59  |
| [Small transistor](http://www.ebay.com/sch/i.html?_odkw=tip21c&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.Xtip31c.TRS0&_nkw=tip31c&_sacat=0)    | 0.1   |

### Disclaimer

HotSpot was made from things I had on hand. These may not be the best/chapest componenets available.
