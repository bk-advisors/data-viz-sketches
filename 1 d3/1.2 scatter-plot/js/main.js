async function drawScatterPlot() {
  // 1. Access the data

  // We build our code inside a function because we need to think of this like starting a scatter-plot recipe, we can replicate again and again

  // It’s "async" because sometimes we have to wait for ingredients (data) to arrive from the store (the CSV file).

  // 1.1 Load the data

  const humdew2024 = await d3.csv(
    "./data/kiziri_humdew_max_2024.csv",
    d3.autoType
  ); //d3.autoType method automatically changes the max-temp & date to JS format

  // 1.2 Create Accessor for y and x data points

  const yAccessor = (d) => d.humidity;
  const xAccessor = (d) => d.dew_point;
  const colorAccessor = (d) => d.cloud_cover;

  console.log(yAccessor(humdew2024[0])); // confirm by console loging

  console.log(xAccessor(humdew2024[0])); // confirm by console loging
  console.log(colorAccessor(humdew2024[0])); // confirm by console loging

  // 2. Create chart dimensions

  // 2.1 Store the dimensions that wraps around the 1st layer "wrapper" of the chart (width, height and margins) in an array

  const width = d3.min([
    // we want the scatterplot to be in a square canvas, so we use d3.min to decide which is smaller (height or width) and make that the width of the square
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ]);

  let dimensions = {
    width: width, // Use the innerwidth of the screen-window to determine the width
    height: width,
    margin: {
      // The margin between the wrapper layer and the inner boundary i.e. 2nd layer
      top: 10,
      right: 10,
      bottom: 50, // Creates room for the x-axis
      left: 50, // Creates room for the y-axis
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right; // The width of the inner layer
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom; // The height of the inner layer
  console.log(dimensions);
  // 3. Draw canvas

  const wrapper = d3
    .select("#wrapper") // Select the div with id "wrapper" in the html file
    .append("svg") // Append an svg element to the wrapper div
    .attr("width", dimensions.width) // Set the width of the svg element
    .attr("height", dimensions.height) // Set the height of the svg element
    .style("background-color", "lavender") // Set the background color of the svg element
    .style("border", "1px solid black"); // Set a border around the svg element

  const bounds = wrapper
    .append("g") // Append a g element to the svg element
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    ); // Move the g element to the right and down by the margin amount

  // 4. Create scales

  const yScale = d3
    .scaleLinear() // Create a linear scale for the y-axis
    .domain(d3.extent(humdew2024, yAccessor)) // Set the domain of the y-axis to the extent of the humidity data
    .range([dimensions.boundedHeight, 0]) // Set the range of the y-axis to the height of the inner layer (inverted because svg origin is top-left)
    .nice(); // Make the y-axis ticks look nice by rounding the domain values

  const xScale = d3
    .scaleLinear() // Create a linear scale for the x-axis
    .domain(d3.extent(humdew2024, xAccessor)) // Set the domain of the x-axis to the extent of the dew-point data
    .range([0, dimensions.boundedWidth]) // Set the range of the x-axis to the width of the inner layer
    .nice(); // Make the x-axis ticks look nice by rounding the domain values
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(humdew2024, colorAccessor))
    .range(["lightblue", "darkslategray"]);

  // 5. Draw data

  const dots = bounds
    .selectAll("circle") // Select all circle elements in the bounds g element (there are none yet)
    .data(humdew2024) // Bind the data to the circle elements
    .join("circle") // Join the data to the circle elements (create a circle for each data point)
    .attr("cx", (d) => xScale(xAccessor(d))) // Set the x position of each circle based on the dew-point data
    .attr("cy", (d) => yScale(yAccessor(d))) // Set the y position of each circle based on the humidity data
    .attr("r", 4) // Set the radius of each circle
    .attr("fill", (d) => colorScale(colorAccessor(d))) // Set the fill color of each circle based on the cloud-cover data
    .attr("opacity", 0.7); // Set the opacity of each circle

  // 6. Draw peripherals

  const yAxisGenerator = d3.axisLeft().scale(yScale); // Create a left-oriented y-axis generator using the yScale
  const yAxis = bounds.append("g").call(yAxisGenerator); // Append a g element to the bounds g element and call the y-axis generator to create the y-axis

  const xAxisGenerator = d3.axisBottom().scale(xScale); // Create a bottom-oriented x-axis generator using the xScale
  const xAxis = bounds
    .append("g") // Append a g element to the bounds g element
    .style("transform", `translateY(${dimensions.boundedHeight}px)`) // Move the g element to the bottom of the inner layer
    .call(xAxisGenerator); // Call the x-axis generator to create the x-axis
  const xAxisLabel = xAxis
    .append("text") // Append a text element to the x-axis g element
    .attr("x", dimensions.boundedWidth / 2) // Set the x position of the text element to the middle of the x-axis
    .attr("y", dimensions.margin.bottom - 10) // Set the y position of the text element to be slightly above the bottom margin
    .attr("fill", "black") // Set the fill color of the text element
    .style("font-size", "1.4em") // Set the font size of the text element
    .html("Dew Point (&deg;C)"); // Set the text content of the text element
  const yAxisLabel = yAxis
    .append("text") // Append a text element to the y-axis g element
    .attr("x", -dimensions.boundedHeight / 2) // Set the x position of the text element to be in the middle of the y-axis (rotated)
    .attr("y", -dimensions.margin.left + 15) // Set the y position of the text element to be slightly to the right of the left margin
    .attr("fill", "black") // Set the fill color of the text element
    .style("font-size", "1.4em") // Set the font size of the text element
    .style("transform", "rotate(-90deg)") // Rotate the text element 90 degrees counter-clockwise
    .style("text-anchor", "middle") // Center the text element
    .html("Humidity (%)"); // Set the text content of the text element
}
drawScatterPlot();
