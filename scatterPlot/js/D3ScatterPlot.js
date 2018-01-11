this.d3 = this.d3 || {};

(function () {
  var d3spP,
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
      };
  
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

  function D3ScatterPlot(options) {
    this.setOptions(options);
  }

  d3spP = D3ScatterPlot.prototype = new Object();

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
    // Set the dimensions of the canvas
    var _this = this,
        margin = {top: 20, right: 20, bottom: 100, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        tooltip = d3.select("body").append("div").attr("class", "tool-tip"),
        x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().domain([0, 40]).range([height, 0]),

        // Add the SVG element
        svg = d3.select(container).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Load the data
    d3.json(datasetUrl, function(error, dataset) {
      var legendGroup,
          tooltip = d3.select("body").append("div").attr("class", "tool-tip"),
          data = dataset.data;

      // Scale the range of the data
      x.domain([d3.min(dataset, function(d) { return d.Seconds; }), d3.max(dataset, function(d) { return d.Seconds; })]);

      // Add the X Axis
      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      // X axis label
      svg.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                            (height + margin.top + 35) + ")")
        .style("text-anchor", "middle")
        .style('font-size', getOption(_this.options, FONT_SIZE))
        .style('fill', getOption(_this.options, TEXT_FILL))
        .text("Performance Time (Seconds)");
  
      // Add the Y Axis
      svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

      // Y axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('font-size', getOption(_this.options, FONT_SIZE))
        .style('fill', getOption(_this.options, TEXT_FILL))
        .text("Ranking");    

      // Add scatter plot
      svg.selectAll("circle")
        .data(dataset)
      .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { console.log(d.Seconds); return x(d.Seconds); })
        .attr("cy", function(d) { return y(d.Place); })
        .attr("fill", getOption(_this.options, CIRCLE_FILL))
        .attr('stroke', function(d) {
          if (d.Doping) {
            return getOption(_this.options, CIRCLE_STROKE);
          }

          return '';
        })
        .on("mouseover", function(d) {
          console.log('mousemove');
          d3.select(this).style('fill', getOption(_this.options, CIRCLE_HOVER_FILL));
          tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 90 + "px")
          .style('display', 'block')
          .html(d.Name + ': ' + d.Nationality + '<br>' +
                'Year: ' + d.Year + ' Time: ' + d.Time  + '<br>' + '<br>' +
                d.Doping);
        })
        .on("mouseout", function() { 
          console.log('mouseout');
          d3.select(this).style('fill', getOption(_this.options, CIRCLE_FILL));
          tooltip.style('display', 'none');
        })
      .append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);   
      
      // Scatter plot legend
      legendGroup = svg.append('g');
      legendGroup.append("circle")
      .attr("r", 5) 
      .attr("cy", 450)
      .attr("cx", 100)
      .attr("fill", getOption(_this.options, CIRCLE_FILL));
  
      legendGroup.append("text")             
        .attr("y", 455)
        .attr("x", 150)
        .style("text-anchor", "middle")
        .style('font-size', getOption(_this.options, FONT_SIZE))
        .text("No Doping");

      legendGroup.append("circle")
      .attr("r", 5) 
      .attr("cy", 470)
      .attr("cx", 100)
      .attr("fill", getOption(_this.options, CIRCLE_FILL))
      .attr("stroke", getOption(_this.options, CIRCLE_STROKE));
      
      legendGroup.append("text")             
        .attr("y", 475)
        .attr("x", 176)
        .style("text-anchor", "middle")
        .style('font-size', getOption(_this.options, FONT_SIZE))
        .text("Doping Allegations");
      });
  }

  // Bind globally
  d3.D3ScatterPlot = D3ScatterPlot; 
    
})();