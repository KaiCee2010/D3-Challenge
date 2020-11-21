// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart


function makeResponsive() {

    var svgArea = d3.select("#scatter").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
    svgArea.remove();
    }
    
    svgWidth = document.getElementById('scatter').clientWidth;
    svgHeight = svgWidth / 1.25;
    
    
    // Append SVG element
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

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
        .domain([d3.min(healthData, d => d.poverty)/1.25, d3.max(healthData, d => d.poverty)*1.05])
        .range([0, chartWidth]);

        var yHealthScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare)/1.25, d3.max(healthData, d => d.healthcare)*1.05])
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

        var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xPovertyScale(d.poverty))
        .attr("cy", d => yHealthScale(d.healthcare))
        .attr("r", "10");
        

              
    

    });



}

  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
