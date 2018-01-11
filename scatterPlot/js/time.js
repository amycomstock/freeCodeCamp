(function () {
  function init() {
    var datasetUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
        container = document.getElementById('scatter-plot'),
        options = {
          circleFill: '#87CEEB',
          circleHoverFill: 'red',
          circleStroke: '#000000',
          textFill: '#1414bf',
          fontSize: '0.9em'
        },
        d3ScatterPlot = new d3.D3ScatterPlot(options);

    d3ScatterPlot.render(datasetUrl, container);

  }

  init();

})();