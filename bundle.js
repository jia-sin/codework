(function (d3) {
  'use strict';

  const scatterPlot = () => {
    let width;
    let height;
    let margin;
    let data;
    let xValue;
    let yValue;
    let race;
    let axisPadding;
    let radius;

    const my = (selection) => {
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data.map((d) => d[xValue])))
        .range([margin.left, width - margin.right])
        .nice();

      const yScale = d3.scaleLinear()
        .domain(d3.extent(data.map((d) => d[yValue])))
        .range([height - margin.bottom, margin.top])
        .nice();

      const t = d3.transition().duration(1000);

      const positionCircles = (circles) => {
        circles
          .attr('cx', (d) => xScale(d[xValue]))
          .attr('cy', (d) => yScale(d[yValue]));
      };

      const initialzeRadius = (circles) => {
        circles.attr('r', 0);
      };

      const growCircles = (circles) => {
        circles.attr('r', radius);
      };

      const circles = selection
        .selectAll('circle')
        .data(data.filter((d) => d.race === race))
        .join(
          (enter) =>
            enter
              .append('circle')
              .call(positionCircles)
              .call(initialzeRadius)
              .call(growCircles),
          (update) =>
            update.call((update) =>
              update.transition(t).call(positionCircles)
            ),
          (exit) => exit.remove()
        );

      const xAxis = selection
        .selectAll('.x-axis')
        .data([null])
        .join('g')
        .attr('class', 'x-axis')
        .attr(
          'transform',
          `translate(0, ${height - margin.bottom + axisPadding
          })`
        )
        .call(d3.axisBottom(xScale).ticks(10, '.0f'));

      const yAxis = selection
        .selectAll('.y-axis')
        .data([null])
        .join('g')
        .attr('class', 'y-axis')
        .attr(
          'transform',
          `translate(${margin.left - axisPadding}, 0)`
        )
        .call(d3.axisLeft(yScale).ticks(10, '$s'));

      return selection;
    };

    my.width = function (_) {
      return arguments.length ? ((width = +_), my) : width;
    };

    my.height = function (_) {
      return arguments.length ? ((height = +_), my) : width;
    };

    my.margin = function (_) {
      return arguments.length ? ((margin = _), my) : margin;
    };

    my.data = function (_) {
      return arguments.length ? ((data = _), my) : data;
    };

    my.xValue = function (_) {
      return arguments.length ? ((xValue = _), my) : xValue;
    };

    my.yValue = function (_) {
      return arguments.length ? ((yValue = _), my) : yValue;
    };

    my.race = function (_) {
      return arguments.length ? ((race = _), my) : race;
    };

    my.axisPadding = function (_) {
      return arguments.length
        ? ((axisPadding = _), my)
        : axisPadding;
    };

    my.radius = function (_) {
      return arguments.length ? ((radius = _), my) : radius;
    };

    return my;
  };

  const barPlot = () => {
    let width;
    let height;
    let margin;
    let data;
    let xValue;
    let yValue;
    let race;
    let axisPadding;

    const my = (selection) => {
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data.map((d) => d[xValue])))
        .range([margin.left, width - margin.right])
        .nice();

      const yScale = d3.scaleLinear()
        .domain(d3.extent(data.map((d) => d[yValue])))
        .range([height - margin.bottom, margin.top])
        .nice();

      const t = d3.transition().duration(1000);

      const positionBars = (bars) => {
        bars
          .attr('x1', (d) => xScale(d[xValue]))
          .attr('x2', (d) => xScale(d[xValue]))
          .attr('y1', height - margin.bottom + axisPadding)
          .attr('y2', (d) => yScale(d[yValue]));
      };

      const bars = selection
        .selectAll('line')
        .data(data.filter((d) => d.race === race))
        .join(
          (enter) =>
            enter
              .append('line')
              .attr('stroke', 'black')
              .call(positionBars),
          (update) =>
            update.call((update) =>
              update.transition(t).call(positionBars)
            ),
          (exit) => exit.remove()
        );
    };

    my.width = function (_) {
      return arguments.length ? ((width = +_), my) : width;
    };

    my.height = function (_) {
      return arguments.length ? ((height = +_), my) : width;
    };

    my.margin = function (_) {
      return arguments.length ? ((margin = _), my) : margin;
    };

    my.data = function (_) {
      return arguments.length ? ((data = _), my) : data;
    };

    my.xValue = function (_) {
      return arguments.length ? ((xValue = _), my) : xValue;
    };

    my.yValue = function (_) {
      return arguments.length ? ((yValue = _), my) : yValue;
    };

    my.race = function (_) {
      return arguments.length ? ((race = _), my) : race;
    };

    my.axisPadding = function (_) {
      return arguments.length
        ? ((axisPadding = _), my)
        : axisPadding;
    };

    return my;
  };

  const menu = () => {
    let id;
    let labelText;
    let options;
    const listeners = d3.dispatch('change');

    const my = (selection) => {
      selection
        .selectAll('label')
        .data([null])
        .join('label')
        .attr('for', id)
        .text(labelText);

      selection
        .selectAll('select')
        .data([null])
        .join('select')
        .attr('id', id)
        .on('change', (event) => {
          listeners.call('change', null, event.target.value);
        })
        .selectAll("option")
        .data(options)
        .join("option")
        .attr("value", d => d.value)
        .text(d => d.value);
    };

    my.id = function (_) {
      return arguments.length ? ((id = _), my) : id;
    };

    my.labelText = function (_) {
      return arguments.length
        ? ((labelText = _), my)
        : labelText;
    };

    my.options = function (_) {
      return arguments.length ? ((options = _), my) : options;
    };

    my.on = function () {
      let value = listeners.on.apply(listeners, arguments);
      return value === listeners ? my : value;
    };

    return my;
  };

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

  // const dataLink = [
  //   'https://raw.githubusercontent.com/',
  //   'rfordatascience/tidytuesday/',
  //   'master/data/',
  //   '2021/2021-02-09/',
  //   'race_wealth.csv',
  // ].join('');
  const dataLink = "./data2.csv"

  // console.log(dataLink)

  const parseRow = (d) => {
    d.wealth_family = +d.wealth_family;
    d.year = +d.year;
    return d;
  };

  const menuContainer = d3.select('body')
    .append('div')
    .attr('class', 'menu-container');

  const raceMenu = menuContainer.append('div');

  const main = async () => {
    // Read in the data
    let data = await d3.csv(dataLink, parseRow);

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
    const svg = d3.select('body')
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
      .race('Taiwanese monthly income')
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
      .race('Taiwanese monthly income')
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

}(d3));
