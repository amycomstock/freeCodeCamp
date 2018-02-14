// Upgraded to use d3 v4 from example: https://codepen.io/freeCodeCamp/full/aNLYPp
this.d3 = this.d3 || {};

(function () {
  var d3hP,
      CIRCLE_FILL = 'circleFill',
      CIRCLE_HOVER_FILL = 'circleHoverFill',
      CIRCLE_STROKE = 'circleStroke',
      FONT_SIZE = 'fontSize',
      TEXT_FILL = 'textFill',
      defaultOptions = {
        CIRCLE_FILL: 'steelblue',
        CIRCLE_HOVER_FILL: 'brown',
        CIRCLE_STROKE: 'yellow',
        FONT_SIZE: '1.0em',
        TEXT_FILL: 'black'
      },
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"],
      buckets = colors.length;

  // Private

  /**
   * Returns the property value based on the input property name.
   * @param {object} options - Object containing property values.
   * @param {string} property - Name of property to retrieve value for.
   */
  function getOption(options, property) {
    if (options && options[property]) {
      return options[property];
    }

    return defaultOptions[property];
  }  

  // Public

  function D3Heatmap(options) {
    this.setOptions(options);
  }

  d3spP = D3Heatmap.prototype = new Object();

  /**
   * Sets rendering options.
   * @param {object} options - Object containing rendering options.
   */
  d3spP.setOptions = function(options) {
    this.options = options;
  }

  /**
   * Draws the data view.
   * @param {string} datasetUrl - Url to retrieve the dataset from.
   * @param {object} container - DOM element to append the svg to.
   */
  d3spP.render = function (datasetUrl, container) {

    var margin = {
        top: 5,
        right: 0,
        bottom: 90,
        left: 100
      },
      width = 1200 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom,
      legendElementWidth = 35,

      axisYLabelX = -65,
      axisYLabelY = height / 2,

      axisXLabelX = width / 2,
      axisXLabelY = height + 45;

    d3.json(datasetUrl, function(error, data) {
      if (error) throw error;

      var gridWidth,
          gridHeight,
          svg,
          div,
          monthLabels,
          xScale,
          temps,
          legend,
          gridSize = Math.floor(width / 24),
          baseTemperature = data.baseTemperature,
          monthlyVariance = data.monthlyVariance,
          varianceData = monthlyVariance.map(function(obj) {
            return obj.variance;
          }),
          colorScale = d3.scaleQuantile()
            .domain(d3.extent(varianceData, function(d) { return d; }))
            .range(colors),
          
          yearData = monthlyVariance.map(function(obj) {
            return obj.year;
          });

      yearData = yearData.filter(function(v, i) {
        return yearData.indexOf(v) == i;
      });

      lowYear = d3.min(yearData);
      gridWidth = width / yearData.length,
      gridHeight = height / months.length;

      svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      div = d3.select(container).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      monthLabels = svg.selectAll(".monthLabel")
        .data(months)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", 0)
        .attr("y", function(d, i) {
          return i * gridHeight;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
        .attr("class", "monthLabel scales axis axis-months");

      xScale = d3.scaleTime()
        .domain(d3.extent(yearData, function(d) { return new Date(d, 0); }))
        .range([0, width]);

     svg.append("g")
        .attr("class", "axis axis-years")
        .attr("transform", "translate(0," + (height + 1) + ")")
        .call(d3.axisBottom(xScale)
        .ticks(d3.timeYear.every(10)))

      svg.append('g')
        .attr('transform', 'translate(' + axisYLabelX + ', ' + axisYLabelY + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr("class", "axislabel")
        .text('Months');

      svg.append('g')
        .attr('transform', 'translate(' + axisXLabelX + ', ' + axisXLabelY + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr("class", "axislabel")
        .text('Years');

      temps = svg.selectAll(".years")
        .data(monthlyVariance, function(d) {
          return (d.year + ':' + d.month);
        });

      temps.enter()
        .append("rect")
        .attr("x", function(d) {
          return ((d.year - lowYear) * gridWidth);
        })
        .attr("y", function(d) {
          return ((d.month - 1) * gridHeight);
        })
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("width", gridWidth)
        .attr("height", gridHeight)
        .attr('fill', (d) => colorScale(d.variance))
        .on("mouseover", function(d) {
          div.transition()
            .duration(100)
            .style("opacity", 0.8);
          div.html("<span class='year'>" + d.year + " - " + months[d.month - 1] + "</span><br>" +
              "<span class='temperature'>" + (Math.floor((d.variance + baseTemperature) * 1000) / 1000) + " &#8451" + "</span><br>" +
              "<span class='variance'>" + d.variance + " &#8451" + "</span>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 75) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(200)
            .style("opacity", 0);
        });

      temps.transition().duration(1000)
        .style("fill", function(d) {
          return colorScale(d.variance + baseTemperature);
        });

      legend = svg.selectAll(".legend")
      .data([0].concat(colorScale.quantiles()), (d) => d);
  
      const legend_g = legend.enter().append("g")
        .attr("class", "legend");

        legend_g.append("rect")
        .attr("x", function(d, i) {
          return legendElementWidth * i;
        })
        .attr("y", height + 50)
        .attr("width", legendElementWidth)
        .attr("height", gridHeight / 2)
        .style("fill", function(d, i) {
          return colors[i];
        });

        legend_g.append("text")
        .attr("class", "scales")
        .text(function(d) {
          return (Math.floor(d * 10) / 10);
        })
        .attr("x", function(d, i) {
          return ((legendElementWidth * i));
        })
        .attr("y", height + gridSize);

        legend.exit().remove();
      });
  }

  // Bind globally
  d3.D3Heatmap = D3Heatmap;     
})();