# Project Proposal

#### Names, emails, and uIDs

## Background and Motivation

## Project Objectives

## Data and Processing
The main data for our project comes from the USGS survey of water usage (https://waterdata.usgs.gov/ut/nwis/water_use/). This data is available for every county in the continental US every 5 years. In particular, the data for Utah is available from 1985-2015.

However, this data has considerable problems in terms of consistency. Over 250 different data categories are defined for each county, but only a small fraction of these contain data. Over time, the reporting system for counties changed and measurements that were reported in one category were changed into another. 

We will need to determine which categories should be combined, which data is not available for each county and should not be reported, and decide which of the categories are relevant for our visualization.

Country precipitation and temperature data is available for every county in the continental US at ftp://ftp.ncdc.noaa.gov/pub/data/cirs/climdiv/. This data requires no cleanup.

US County GEOJson data is available here: https://eric.clst.org/tech/usgeojson/


## Visualization Design
Data is displayed in 3 main views, all of which include multiple plots. A scatterplot with changable axis data (including precipitation, temperature, total water use, and water use by category) is on the right, with a map of counties in Utah on the left, colored by the Y/X data from the scatterplot. A slider can be used to select the year

In the time view, the data from the X-axis and Y-axis are plotted over time in two separate line plots. In the focus view, a single county can be set as the point-of-focus, which shows the change in water use categories over time.

Color is used in several ways. First, to distinguish between data points on the map (counties) and to provide some context for the plotted data (Y/X). Separate colors are also used to distinguish between each category of water use.

Having these three views allows the visualization to be flexible. A user can compare different variables in the scatter plot, as well as view how those variables have changed over time in the time view. The focus view can be used to compare different counties, or how one particular county's water use has changed.
![Design3](Design3.png)


## Features
#### Required Features
* View 1
  * Scatterplot of each county
    * All options for Both axis
      * Water Use
      * Domestic Water Use
      * Population
      * Precipitation
      * Avg Temperature 
    * Slider to select year
    * Color is set as Y/X for each county 
  * Map of Utah counties
    * Colored by Y/X
  * Buttons to select each county (since location may not be known on map)
  * Double-click buttons, map, or scatter plot to set Point-of-focus
* View 2 - Far Right 
  * Line Plot A
    * Y axis is data from variable 1
    * X axis is time 
  * Line Plot B
    * Y axis is data from variable 2
    * X axis is time 
* View 3 - Bottom Left
  * Point of interest chart shows change over time.
  * Stacked bar charts of Water Use Categories for selection and state average
* Linked view highlighting:
  * Highlight county on map using single click
  * Set point of interest on map using double click
  * Highlight dot on scatterplot
  * Highlight county lines in View 2
  * Highlight year on all counties in View 2 (from slider)
#### Optional Features
* Scatterplot size for different variables. See what works.
* Hovering on water use categories shows description of category
* Selection average shown in focus view.
* If no point of focus is selected, use average of selection
* Include preset to highlight interesting data points.
* Add US map to select state
* US View - 
  * Select a different state to load into all Views
  * Select Multiple states to bring both states into all Views

## Project Schedule
* Week 10 (Oct 25-31): Finalize working draft of desing, submit project proposal
* Week 11 (Nov 1-7): Setup state view and time view with changable variables, apply feedback
* Week 12 (Nov 8-14): Add focus view and linked highlighting
* Week 13 (Nov 15-21): Incorporate mentor feedback, finalize visual choices (color, layout, etc)
* Week 14 (Nov 22-28): Add US view with multiple states, water category descriptions
* Week 15 (Nov 29): Add interesting data preset, submit project


#### Scratch
Utah Water Use 1985-2015: https://waterdata.usgs.gov/ut/nwis/water_use/ Other states are also available.

Suggest: Map with multiple colorings selectable
* Annual precipitation
* Water consumption
  * Domestic consumption
  * Domestic consumption per capita
  * Industrial consumption
  * Agriculture/Irrigation consumption
* Ability to set any variable over any other variable. (Precipitation per capita, Domestic consumption per precipitation
* Ability to select multiple counties and add their stats (Select Salt Lake + Utah + Summit + Wasatch, etc
  * Have pre-setting for drainage areas? Hard, but roughly doable.
  * Have pre-setting for state selection.
  * Group selection option based on currect selection of counties

On side of map, scatter plots of different axes, similar to HW4
Slider to select multiple years?

Full Data Categories:
 * Total population
 * Public
   * Public Supply population served
   * Public Supply self supplied groundwater withdrawals, fresh, Mgal/d
   * Public Supply self supplied surface-water withdrawals, fresh, Mgal/d
   * Public Supply self supplied total withdrawals, fresh, Mgal/d
 * Domestic
   * Domestic self-supplied groundwater withdrawals, fresh, Mgal/d
   * Domestic self-supplied surface-water withdrawals, fresh, Mgal/d
   * Domestic self-supplied total withdrawals, fresh, Mgal/d
   * Domestic self-supplied population
   * Domestic per capita use, self-supplied in gal/person/day
 * Industrial
   * Industrial self-supplied groundwater withdrawals, fresh, Mgal/d
   * Industrial self-supplied groundwater withdrawals, saline, Mgal/d
   * Industrial self-supplied surface-water withdrawals, fresh, Mgal/d
   * Industrial self-supplied surface-water withdrawals, saline, Mgal/d
   * Industrial totals (derived from prev 4)
 * Total Thermoelectric power
   * Total Thermoelectric power self-supplied groundwater withdrawals, fresh, Mgal/d
   * Total Thermoelectric power self-supplied groundwater withdrawals, saline, Mgal/d
   * Total Thermoelectric power self-supplied surface-water withdrawals, fresh, Mgal/d
   * Total Thermoelectric power self-supplied surface-water withdrawals, saline, Mgal/d
   * Total Thermoelectric power totals (derived from prev 4)
 * Mining 
   * Mining self-supplied groundwater withdrawals, fresh, Mgal/d
   * Mining self-supplied groundwater withdrawals, saline, Mgal/d
   * Mining self-supplied surface-water withdrawals, fresh, Mgal/d
   * Mining self-supplied surface-water withdrawals, saline, Mgal/d
   * Mining totals (derived from prev 4)
 * Livestock
   * Livestock self-supplied groundwater withdrawals, fresh, Mgal/d
   * Livestock self-supplied surface-water withdrawals, fresh, Mgal/d
   * Livestock totals (derived from prev 4)
   * (Need to combine Livestock and Livestock(stock), livestock(Animal Specialties) , see)
 * Irrigation
   * Irrigation Total self-supplied groundwater withdrawals, fresh, Mgal/d
   * Irrigation Total self-supplied surface-water withdrawals, fresh, Mgal/d
   * Irrigation Total sprinkler irrigation in thousand acres
   * Irrigation Total surface irrigation in thousand acres
