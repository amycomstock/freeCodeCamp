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
        d3Scatterplot = new d3.D3Scatterplot(options);

        d3Scatterplot.render(datasetUrl, container);

  }

  init();

})();