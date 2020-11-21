// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
    svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth ;
    var svgHeight = window.innerHeight;
  
    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

      
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("/assets/data/data.csv").then(function(healthData){

        healthData.forEach(function(data) {
           
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;

            console.log(data)
        });

        var xPovertyScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.poverty)])
        .range([0, chartWidth]);

        var yHealthScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([chartHeight, 0]);

        // create axes
        var xAxis = d3.axisBottom(xPovertyScale).ticks(6);
        var yAxis = d3.axisLeft(yHealthScale).ticks(6);

        // append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

              
    

});

}

  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
