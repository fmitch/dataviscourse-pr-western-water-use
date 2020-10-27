# Project Proposal

#### Names, emails, and uIDs
Name: Pranav Kiran Shah, Email: shahpranavpks@gmail.com | U1266563@utah.edu, UID:U1266563

## Background and Motivation
* Consider any government website which provides data for Water usage; they never show visual statistics. This data is difficult to read by people. 
* Visualizing the water consumption against a different group of data can provide us insights into the country's condition.
* Water is an essential resource that keeps depleting, and hence, it needs to be analyzed by not just the government but also the local people.
* Knowing how much water is consumed every year and comparing it with other facts can help devise a solution to various climate change problems.
* Example: Comparing water usage with temperature can help us know how global warming is affecting consumption and precipitation. By knowing and understanding the data carefully, we can prevent another global crisis.
* Therefore, this project's motivation is to spread information in a visual form that is readable and understandable by the general public.


## Project Objectives
With this project, we are trying to answer the following question for any viewer:
* How much water is consumed by a state or its counties?
* How does a state/county perform to others in terms of water usage?
* How does water usage vary as per the temperature and precipitation?
* What categories of water usage consume the most freshwater?
* Which category usage must be reduced to protect water resources?
* How to plan on saving water?
* Which areas to target for saving water?
* Which county/state has unused abundant resources that can help others?
* Is global warming affecting water usage?

Other objectives include:
* Learning about maps in visualization.
* Learning and understanding interactive and synchronized layout.
* Building and hosting a website on github.
* Learning and developing various types of visualization charts.


## Data and Processing
The main data for our project comes from the USGS survey of water usage (https://waterdata.usgs.gov/ut/nwis/water_use/). This data is available for every county in the continental US every 5 years. In particular, the data for Utah is available from 1985-2015.

However, this data has considerable problems in terms of consistency. Over 250 different data categories are defined for each county, but only a small fraction of these contain data. Over time, the reporting system for counties changed and measurements that were reported in one category were changed into another. 

We will need to determine which categories should be combined, which data is not available for each county and should not be reported, and decide which of the categories are relevant for our visualization.

Country precipitation and temperature data is available for every county in the continental US at ftp://ftp.ncdc.noaa.gov/pub/data/cirs/climdiv/. This data requires aggregation and processing to match the timeline of the water-use data.

US County GEOJson data is available here: https://eric.clst.org/tech/usgeojson/


## Visualization Design

Design starts with a hoe page which displays the map of United States of America, and a scatter plot (Optional feature) which displays water use, temperature and precipitation data for every state.
Selecting any state on the map will open a new page to show detailed analysis of the state.

In the state-specific page, data is displayed in 3 main views, all of which include multiple plots. A scatterplot with changable axis data (including precipitation, temperature, total water use, and water use by category) is on the right, with a map of counties in Utah on the left, colored by the Y/X data from the scatterplot. A slider can be used to select the year

In the time view, the data from the X-axis and Y-axis are plotted over time in two separate line plots. Here, the Y-axis is changable and X-axis is Time. In the focus view, a single county can be set as the point-of-focus, which shows the change in water use categories over time.

The scatter and time view plot data for all counties for a selected state. The focus-view plots data for a selected county on the map.

Every view is synchronized, making a selection on one view will highlight the selection on other views. 

Additionally, we plan to provide user a checkbox table to select multiple counties to compare against each other and the county of interest. This comparison is highlighted in every view and an additional view is displayed which shows a stacked barchart fo water use categories for every selected county.

Color is used in several ways. First, to distinguish between data points on the map (counties) and to provide some context for the plotted data (Y/X). Separate colors are also used to distinguish between each category of water use.

Having these three views allows the visualization to be flexible. A user can compare different variables in the scatter plot, as well as view how those variables have changed over time in the time view. The focus view can be used to compare different counties, or how one particular county's water use has changed.
![Design3](Design3.png)


## Features
#### Required Features
* Add US map to select state (Home page)
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
* US View - 
  * Select a different state to load into all Views
  * Select Multiple states to bring both states into all Views

## Project Schedule
* Week 10 (Oct 25-31): Finalize working draft of design, submit project proposal
* Week 11 (Nov 1-7): 
  * Pranav: Setup US view. Clicking on a state should open a new page, printing state map/name. Setup hosting. 
  * Frost: Draw state view with counties, including scatterplot. Setup data object, process data.
* Week 12 (Nov 8-14): 
  * Pranav: Add line charts.
  * Frost: Add point of focus view, buttons and map selection
* Week 13 (Nov 15-21): 
  * Incorporate mentor feedback. 
  * Add linked highlighting and selection
  * Finalize visual choices (color, layout, etc)
* Week 14 (Nov 22-28): 
  * Add US view with multiple states, 
  * Add tooltip water category descriptions
* Week 15 (Nov 29): 
  * Add interesting data preset, 
  * Submit project
