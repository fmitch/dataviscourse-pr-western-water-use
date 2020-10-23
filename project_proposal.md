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

## Features
#### Required Features
* View 1
  * Scatterplot of each county
    * X axis (A)
      * Population
      * Precipitation
      * Avg Temperature 
    * Y axis (B)
      * Water Use
      * Domestic Water Use
    * Slider to select year
    * Color and Size channels?
  * Map of Utah counties
    * Colored by Y/X
  * Buttons to select each county (since location may not be known on map)
* View 2 - Bottom Right 
  * Line Plot A
    * Y axis is A from above
    * X axis is time 
  * Line Plot B
    * Y axis is B from above
    * X axis is time 
* View 3 - Bottom Left
  * Stacked bar charts of Water Use Categories for selection and state average
* Linked view highlighting:
  * Highlight county on map
  * Highlight dot on scatterplot
  * Highlight county lines in View 2
  * Highlight year on all counties in View 2 (from slider)
#### Optional Features
* State View - 
  * Select a different state to zoom to Views 1-3
  * Select Multiple states to bring them all into Views 1-3

## Project Schedule






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
