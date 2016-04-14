var data,
    months = ['January', 'February', 'March', 'April',
              'May', 'June', 'July', 'August',
              'September', 'October', 'November', 'December']

var margin = { top: 20, right: 30, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// changing to ordinal (from date)
var x = d3.time.scale()
    .rangeRound([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// fix labels
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.year, 5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10);

var chart = d3.select('.chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('class', 'container')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var div = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

d3.json('GDP-data.json', function(error, json) {
    if (error) return console.warn(error);

    data = json.data;

    x.domain([
        d3.min(data, function(d) {
            var date = new Date(d[0])
            return date;
        }),
        d3.max(data, function(d) {
            var date = new Date(d[0])
            return date;
        })
    ]);
    y.domain([0, d3.max(data, function(d) { return d[1] })]);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('GDP in billions, USA');

    chart.append('g')
        .attr('class', 'title')
      .append('text')
        .attr('y', 40)
        .attr('x', width / 2)
        .style('text-anchor', 'middle')
        .text('Gross Domestic Product');

    var bar = chart.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('x', function(d) {
            var date = new Date(d[0])
            return x(date);
        })
        .attr('y', function(d) { return y(d[1]); })
        .attr('height', function(d) { return height - y(d[1]); })
        .attr('width', function(d) { return ( width / data.length ) + 1 })
        .on('mouseover', function(d) {
            div.transition()
                .duration(0)
                .style('opacity', .9);
            div .html(function() {
                var date = new Date(d[0])
                return '<strong>$' + d[1].toLocaleString() + ' Billion</strong><br>' + months[date.getMonth() - 1] + ' ' + date.getFullYear()
            })
                .style('left', (d3.event.pageX + 10) + 'px')
                .style('top', (d3.event.pageY - 50) + 'px')
        })
        .on('mouseout', function(d) {
            div.transition()
                .duration(0)
                .style('opacity', 0)
        })
    })
