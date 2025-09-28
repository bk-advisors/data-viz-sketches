async function drawHistogram() {
  // 1. Access the data

  // We build our code inside a function because we need to think of this like starting a histogram recipe, we can replicate again and again

  // It’s "async" because sometimes we have to wait for ingredients (data) to arrive from the store (the CSV file).

  // 1.1 Load the data

  const humdew2024 = await d3.csv(
    "./data/kiziri_humdew_max_2024.csv",
    d3.autoType
  ); //d3.autoType method automatically changes the max-temp & date to JS format

  // 1.2 Create Accessor for y and x data points

  const metricAccessor = (d) => d.humidity;
  const yAccessor = (d) => d.length; // each bin is an array of values, so length gives the number of values in each bin

  console.log(humdew2024[0]); // confirm by console loging
  console.log(metricAccessor(humdew2024[0])); // confirm by console loging
  console.log(yAccessor([1, 2, 3, 4, 5])); // confirm by console loging

  // 2. Create chart dimensions

  const width = 600;
  let dimensions = {
    width: width,
    height: width * 0.6, // 60% of width
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom; // bounded area is the area inside the margins

  // 3. Draw canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
    );
  // 4. Create scales

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(humdew2024, metricAccessor)) // extent gives min and max values of the array
    .range([0, dimensions.boundedWidth])
    .nice();

  // 5. Create bins

  const binsGenerator = d3
    .bin()
    .domain(xScale.domain()) // use the same domain as xScale
    .value(metricAccessor) // value to be binned
    .thresholds(12); // number of bins

  const bins = binsGenerator(humdew2024);
  console.log(bins);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)]) // max number of values in a bin
    .range([dimensions.boundedHeight, 0])
    .nice();

  // 6. Draw data

  const binsGroup = bounds.append("g");
  const binGroups = binsGroup.selectAll("g").data(bins).enter().append("g");
  const barPadding = 1;
  const barRects = binGroups
    .append("rect")
    .attr("x", (d) => xScale(d.x0) + barPadding / 2) // x0 is the start of the bin
    .attr("y", (d) => yScale(yAccessor(d))) // y position is based on number of values in the bin
    .attr("width", (d) =>
      d.x1 - d.x0 > barPadding ? xScale(d.x1) - xScale(d.x0) - barPadding : 0
    ) // x1 is the end of the bin
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d))) // height is based on number of values in the bin
    .attr("fill", "cornflowerblue");

  // 7. Draw peripherals

  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale)
    .ticks(6)
    .tickSizeOuter(0);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Humidity (%)");

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4).tickSizeOuter(0);
  const yAxis = bounds.append("g").call(yAxisGenerator);
  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Number of days")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");
}
drawHistogram();
