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
}

drawLineChart();
