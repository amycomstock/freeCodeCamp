this.d3 = this.d3 || {};

(function () {
  var d3bcP,
      BAR_FILL = 'barFill',
      BAR_HOVER_FILL = 'barHoverFill',
      defaultOptions = {
        BAR_FILL: 'steelblue',
        BAR_HOVER_FILL: 'brown'
      },
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
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

  function D3BarChart(options) {
    this.setOptions(options);
  }

  d3bcP = D3BarChart.prototype = new Object();

  /**
   * Sets rendering options.
   * @param {object} options - Object containing rendering options.
   */
  d3bcP.setOptions = function(options) {
    this.options = options;
  }

  /**
   * Draws the data view.
   * @param {string} datasetUrl - Url to retrieve the dataset from.
   * @param {object} container - DOM element to append the svg to.
   */
  d3bcP.render = function (datasetUrl, container) {
    // Set the dimensions of the canvas
    var _this = this,
        margin = {top: 20, right: 20, bottom: 100, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        tooltip = d3.select("body").append("div").attr("class", "tool-tip"),
        formatCurrency = d3.format("$,.2f"),
        parseDate = d3.timeParse("%Y-%m-%d"),
        x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),

        // Add the SVG element
        svg = d3.select(container).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // load the data
    d3.json(datasetUrl, function(error, dataset) {
      var tooltip = d3.select("body").append("div").attr("class", "tool-tip"),
          data = dataset.data,
          barWidth = Math.ceil(width / data.length);

        data.forEach(function(d) {
          d[0] = parseDate(d[0]);
          d[1] = +d[1];
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d[0]; }));
      y.domain([0, d3.max(data, function(d) { return d[1]; })]);

      // Add the X Axis
      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      // Add the Y Axis
      svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("US Gross Domestic Product");

      // Add bar chart
      svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
          return x(d[0]); 
        })
        .attr("width", barWidth)
        .attr("y", function(d) { 
          return y(d[1]); 
        })
        .attr("height", function(d) { 
          return height - y(d[1]);
         })
        .style('fill', getOption(_this.options, BAR_FILL))
        .on("mouseover", function(d) {
          var date = new Date(d[0]);
          console.log('mousemove' + date.getMonth());
          d3.select(this).style('fill', getOption(_this.options, BAR_HOVER_FILL));
          tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(formatCurrency(d[1]) + ' Billion' + "<br>" + months[date.getMonth()] + ' ' + date.getFullYear());
        })
        .on("mouseout", function() { 
          console.log('mouseout');
          d3.select(this).style('fill', getOption(_this.options, BAR_FILL));
          tooltip.style("display", "none");
        })
      .append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);     
    });
  }

    // Bind globally
    d3.D3BarChart = D3BarChart; 
    
})();