import {
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  transition,
} from 'd3';

export const barPlot = () => {
  let width;
  let height;
  let margin;
  let data;
  let xValue;
  let yValue;
  let race;
  let axisPadding;

  const my = (selection) => {
    const xScale = scaleLinear()
      .domain(extent(data.map((d) => d[xValue])))
      .range([margin.left, width - margin.right])
      .nice();

    const yScale = scaleLinear()
      .domain(extent(data.map((d) => d[yValue])))
      .range([height - margin.bottom, margin.top])
      .nice();

    const t = transition().duration(1000);
    
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
