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
}
drawScatterPlot();
