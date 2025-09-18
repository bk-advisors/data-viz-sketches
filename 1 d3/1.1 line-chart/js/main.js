async function drawLineChart() {
  // 1. Access the data

  // async because we might fetch data from an external source

  // 1.1 Load the data

  const dataset2 = await d3.csv(
    "./data/nyc_weekly_temperature.csv",
    d3.autoType // d3.autoType method automatically changes the max-temp & date to JS format
  );

  // 1.2 Create Accessor for y and x data points

  yAccessor = (d) => d.max_temp_F;
  xAccessor = (d) => d.date;

  console.log(yAccessor(dataset2[0])); // confirm by console loging

  console.log(xAccessor(dataset2[0])); // confirm by console loging
}

drawLineChart();
