async function drawLineChart() {
  // 1. Access the data

  // We build our code inside a function because we need to think of this like starting a line-chart recipe, we can replicate again and again

  // It’s "async" because sometimes we have to wait for ingredients (data) to arrive from the store (the CSV file).

  // 1.1 Load the data

  const dataset2 = await d3.csv(
    // await means: “Don’t start cooking yet, wait until the groceries (data) actually arrive.”
    "./data/nyc_weekly_temperature.csv",
    d3.autoType // d3.autoType is like a helper who automatically converts the groceries into the right type: numbers, dates, etc.
  );

  // 1.2 Create Accessor for y and x data points

  // An accessor is like a special tool that helps us pick out the exact ingredients (data points) we need from larger the dataset.

  yAccessor = (d) => d.max_temp_F; // d is each row of the dataset, we want to access the max_temp_F column
  xAccessor = (d) => d.date; // d is each row of the dataset, we want to access the date column

  //console.log(yAccessor(dataset2[0])); // Test the accessor by logging the first data point's max_temp_F value

  //console.log(xAccessor(dataset2[0])); // Test the accessor by logging the first data point's date value

  // 2. Create chart dimensions
  // 2.1 Store the dimensions that wraps around the 1st layer "wrapper" of the chart (width, height and margins) in an array

  let dimensions = {
    width: window.innerWidth * 0.9, // Use the innerwidth of the screen-window to determine the width
    height: 400,
    margin: {
      // The margin between the wrapper layer and the inner boundary i.e. 2nd inner layer
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };

  // 2.2 Calculate the bounded width and height of the inner layer (where the data is drawn)

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.right - dimensions.margin.left;

  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw the canvas
  // 3.1 Select the wrapper container in the HTML and append the SVG canvas element

  const wrapper = d3
    .select("#wrapper") // Select the div with id "wrapper" in the HTML
    .append("svg") // Append an SVG element to the wrapper div
    .attr("width", dimensions.width) // Set the width of the SVG element
    .attr("height", dimensions.height); // Set the height of the SVG element

  // 3.2 Append a "g" element to the SVG and move it to the top left margin

  const bounds = wrapper
    .append("g") // Append a "g" element to the SVG, this "g" will contain all the data elements
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)` // Move the "g" element to the top left margin
    );

  // 4. Create scales
  // 4.1 Create the y scale (temperature scale)

  const yScale = d3
    .scaleLinear() // Create a linear scale for the y axis
    .domain(d3.extent(dataset2, yAccessor)) // Set the domain of the y scale to the extent (min and max) of the max_temp_F values in the dataset
    .range([dimensions.boundedHeight, 0]); // Set the range of the y scale to be from the bottom to the top of the bounded height
  // Note: In SVG, the y=0 coordinate is at the top, so we reverse the range

  // console.log(d3.extent(dataset2, yAccessor)); // confirm by console logging it

  // 4.2 Create the x scale (time scale)
  const xScale = d3
    .scaleTime() // Create a time scale for the x axis
    .domain(d3.extent(dataset2, xAccessor)) // Set the domain of the x scale to the extent (min and max) of the date values in the dataset
    .range([0, dimensions.boundedWidth]); // Set the range of the x scale to be from left to right of the bounded width

  // console.log(d3.extent(dataset2, xAccessor)); // confirm by console logging it

  // 5. Draw data

  // 5.1 Create a line generator function

  const lineGenerator = d3
    .line() // Create a line generator
    .x((d) => xScale(xAccessor(d))) // Set the x value of each point in the line using the x scale and x accessor
    .y((d) => yScale(yAccessor(d))) // Set the y value of each point in the line using the y scale and y accessor
    .curve(d3.curveBasis); // Apply a curve to the line for smoothness  // Other curve options: d3.curveLinear, d3.curveStep, d3.curveCardinal, etc.

  // 5.2 Use the line generator to create the "d" attribute for a "path" element
  const line = bounds
    .append("path") // Append a "path" element to the bounds "g"
    .attr("d", lineGenerator(dataset2)) // Use the line generator to create the "d" attribute for the path, passing in the dataset
    .attr("fill", "none") // Set fill to none because we only want a line, not a filled shape
    .attr("stroke", "#af9358") // Set the stroke color of the line
    .attr("stroke-width", 2); // Set the stroke width of the line

  // 6. Draw peripherals
  // 6.1 Create and draw the y axis

  const yAxisGenerator = d3.axisLeft().scale(yScale); // Create a left-oriented axis generator using the y scale
  const yAxis = bounds.append("g").call(yAxisGenerator); // Append a "g" element to the bounds and call the y axis generator to draw the y axis

  // 6.2 Create and draw the x axis

  const xAxisGenerator = d3.axisBottom().scale(xScale); // Create a bottom-oriented axis generator using the x scale
  const xAxis = bounds
    .append("g") // Append a "g" element to the bounds
    .style("transform", `translateY(${dimensions.boundedHeight}px)`) // Move the x axis to the bottom of the bounded height
    .call(xAxisGenerator); // Call the x axis generator to draw the x axis

  // 6.3 Add a label to the y axis

  const yAxisLabel = bounds
    .append("text") // Append a "text" element to the y axis "g"
    .attr("x", -dimensions.boundedHeight / 2) // Position the label in the middle of the y axis
    .attr("y", -dimensions.margin.left + 15) // Position the label to the left of the y axis
    .html("Max Temperature (ºF)") // Set the text of the label
    .style("font-size", "1.4em") // Set the font size of the label
    .style("text-anchor", "middle") // Center the text anchor
    .style("transform", "rotate(-90deg)"); // Rotate the label to be vertical
  // 6.4 Add a label to the x axis

  const xAxisLabel = bounds
    .append("text") // Append a "text" element to the x axis "g"
    .attr("x", dimensions.boundedWidth / 2) // Position the label in the middle of the x axis
    .attr("y", dimensions.margin.bottom + 345) // Position the label below the x axis
    .html("Month") // Set the text of the label
    .style("font-size", "1.4em") // Set the font size of the label
    .style("text-anchor", "middle"); // Center the text anchor

  // 7. Set up interactions (if any)

  // No interactions for this simple line chart
}

drawLineChart();
