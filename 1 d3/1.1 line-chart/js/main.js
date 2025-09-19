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
  // 3.1 Select the chart container in the HTML and append the SVG canvas element

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
}

drawLineChart();
