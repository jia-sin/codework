import { csv, select } from 'd3';
import { scatterPlot } from './scatterPlot.js';
import { barPlot } from './barPlot.js';
import { menu } from './menu.js';

const numPoints = 70;

const x = Array(numPoints)
  .fill(0)
  .map((d) => Math.floor(Math.random() * 20));

const y = Array(numPoints)
  .fill(0)
  .map((d) => Math.floor(Math.random() * 20));

const dataset = x.map((d, i) => [d, y[i]]);

const width = window.innerWidth;
const height = window.innerHeight;

const margin = { top: 30, right: 30, bottom: 40, left: 70 };

const dataLink = [
  'https://raw.githubusercontent.com/',
  'rfordatascience/tidytuesday/',
  'master/data/',
  '2021/2021-02-09/',
  'race_wealth.csv',
].join('');

const parseRow = (d) => {
  d.wealth_family = +d.wealth_family;
  d.year = +d.year;
  return d;
};

const menuContainer = select('body')
  .append('div')
  .attr('class', 'menu-container');

const raceMenu = menuContainer.append('div');

const main = async () => {
  // Read in the data
  let data = await csv(dataLink, parseRow);

  // The data has info on both "average" income as well as "median" income.
  // For this chart I will be plotting only the "median" income.
  // Further, the variable "race" is categorised into:
  // 1. White
  // 2. Non-White
  // 3. Black, and
  // 4. Hispanic
  // But information about "Non-White" is mostly missing, so I'll remove this
  // from the dataset as well.
  data = data.filter(
    (d) =>
      d.type === 'Median' &&
      d.race !== 'Non-White' &&
      d.year !== 1963
  );

  // Inilialize the plot region
  const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create the scatter plot
  const points = scatterPlot()
    .width(width)
    .height(height)
    .data(data)
    .xValue('year')
    .yValue('wealth_family')
    .race('White')
    .radius(7)
    .margin(margin)
    .axisPadding(5);

  // Draw the bars
  const bars = barPlot()
    .width(width)
    .height(height)
    .data(data)
    .margin(margin)
    .xValue('year')
    .yValue('wealth_family')
    .race('White')
    .axisPadding(5);

  svg.call(bars).call(points);

  //Create a lookup table for the "race" options
  const options = [
    { value: 'Taiwanese monthly income' },
    { value: 'egg price' },
    { value: 'how much egg you can buy' },
  ];

  //Add the "race" options menu to the chart
  raceMenu.call(
    menu()
      .id('race-menu')
      .labelText('Race: ')
      .options(options)
      .on('change', (column) => {
        svg
          .call(bars.race(column))
          .call(points.race(column));
      })
  );
};

main();
