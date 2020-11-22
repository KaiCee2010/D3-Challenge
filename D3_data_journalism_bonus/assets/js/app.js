// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart

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
    bottom: 100,
    right: 50,
    left: 100
};

var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8, d3.max(healthData, d => d[chosenXAxis]) * 1.2])
    .range([0, chartWidth]);

  return xLinearScale;

}

function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8, d3.max(healthData, d => d[chosenYAxis]) * 1.2])
      .range([chartHeight, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function xRenderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

function yRenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
}


function renderCirclesLabels(circlesLabelsGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesLabelsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return circlesLabelsGroup;
}



// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var xlabel = "Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        var xlabel = "Age (Median)";
      }
    else {
      var xlabel = "Household Income (Median)";
    }

    if (chosenYAxis === "healthcare") {
        var ylabel = "Healthcare (%)";
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes (%)";
    }
    else {
    var ylabel = "Obese (%)";
    }


    var toolTip = d3.tip()
        .attr("class", "d3-tip") //toolTip doesn't have a "classed()" function like core d3 uses to add classes, so we use the attr() method.
        .offset([80, 50]) // (vertical, horizontal)
        .html(function(d) {
            return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br> ${ylabel}: ${d[chosenYAxis]}`);
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

  return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(healthData){

    // parse data
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;

        console.log(data)
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(healthData, chosenYAxis);
    // var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(healthData, d => d.healthcare)])
    // .range([chartHeight, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    // chartGroup.append("g")
    //     .call(leftAxis);
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(40, 0)`)
        .call(leftAxis);

    var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10);


    var circlesLabelsGroup = chartGroup.append("g")
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
        .attr("x",  d => xLinearScale(d[chosenXAxis]))
        .attr("y",  d => yLinearScale(d[chosenYAxis])*1.00625)
        .attr("font-size", 10)
        .text(d => d.abbr);  

    // Create group for 3 x- axis labels
    var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`);

    var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("xvalue", "poverty") // value to grab for event listener
    .attr("id", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("xvalue", "age") // value to grab for event listener
    .attr("id", "age") 
    .classed("inactive", true)
    .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("xvalue", "income") // value to grab for event listener
    .attr("id", "income")
    .classed("inactive", true)
    .text("Household Income (Median)");

    // Create group for 3 y- axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")

    var healthcareLabel = yLabelsGroup.append("text")
    .attr("y",  0 - margin.left + 50)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("yvalue", "healthcare") // value to grab for event listener
    .attr("id", "healthcare")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
    .attr("y",  0 - margin.left + 50)
    .attr("x", 0 - (chartHeight / 2))
    .attr("yvalue", "smokes") // value to grab for event listener
    .attr("id", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
    .attr("y",  0 - margin.left + 30)
    .attr("x", 0 - (chartHeight / 2))
    .attr("yvalue", "obesity") // value to grab for event listener
    .attr("id", "obesity")
    .classed("inactive", true)
    .text("Obese (%)");


    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xvalue = d3.select(this).attr("xvalue");

      if (d3.select("#healthcare").classed("active")){
        var yvalue = d3.select("#healthcare").attr("yvalue")
      }
      else if (d3.select("#smokes").classed("active")){
        var yvalue = d3.select("#smokes").attr("yvalue")
      }
      else{
        var yvalue = d3.select("#obesity").attr("yvalue")
      }

      console.log(`xlabels group yvalue: ${yvalue}`)
      
      
      if (xvalue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;
        chosenYAxis = yvalue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = xRenderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        circlesLabelsGroup = renderCirclesLabels(circlesLabelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
        }
      }
    });

    yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("yvalue");

      if (d3.select("#poverty").classed("active")){
        var xvalue = d3.select("#poverty").attr("xvalue")
      }
      else if (d3.select("#age").classed("active")){
        var xvalue = d3.select("#age").attr("xvalue")
      }
      else{
        var xvalue = d3.select("#income").attr("xvalue")
      }

      console.log(`ylabels group xvalue: ${xvalue}`)

      if (yvalue !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;
        chosenYAxis = yvalue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        yAxis = yRenderAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        circlesLabelsGroup = renderCirclesLabels(circlesLabelsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenYAxis === "obesity") {
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", true)
                .classed("inactive", false);
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);


});