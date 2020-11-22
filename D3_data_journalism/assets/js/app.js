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
    svgHeight = svgWidth / 1.45;
    
    var border=1;
    var bordercolor='gray';

    // Append SVG element
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .attr("border", border);

    var borderPath = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .style("stroke", bordercolor)
        .style("fill", "none")
        .style("stroke-width", border);

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

    d3.csv("../assets/data/data.csv").then(function(healthData){

        healthData.forEach(function(data) {
           
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;

            console.log(data)
        });

        var xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty)/1.35, d3.max(healthData, d => d.poverty)*1.15])
        .range([0, chartWidth]);

        var yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare)/1.35, d3.max(healthData, d => d.healthcare)*1.35])
        .range([chartHeight, 0]);

        // create axes
        var xAxis = d3.axisBottom(xScale).ticks(6);
        var yAxis = d3.axisLeft(yScale).ticks(6);

        // append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

        var radius = 10

        
        var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 10);
        

        var label = chartGroup.append("g")
            // .attr("font-family", "Yanone Kaffeesatz")
            // .attr("font-weight", 700)
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(healthData)
            .enter()
            .append("text")
            .attr("class", "stateText")
            // .attr("opacity", 0)
            // .attr("dy", "0.35em")
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare)*1.00625)
            .attr("font-size", 10)
            .text(d => d.abbr)
            ;  
            
        
        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2) - 50)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Lacks Healthcare (%)");


        chartGroup.append("text")
        .attr("transform", `translate(${(chartWidth / 2)- 50}, ${chartHeight + margin.top - 10})`)
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("In Poverty (%)");
        
        var toolTip = d3.tip()
        .attr("class", "d3-tip") //toolTip doesn't have a "classed()" function like core d3 uses to add classes, so we use the attr() method.
        .offset([80, 50]) // (vertical, horizontal)
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}%
            <br>Healthcare: ${d.healthcare}%`);
        });
            
        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
        })
        
        // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
            toolTip.hide(d);
            });
                

    }).catch(function(error) {
        console.log(error);
    });



}

  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
