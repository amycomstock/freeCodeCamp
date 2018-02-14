(function () {
  function init() {
    var datasetUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',
        container = document.getElementById('heat-map'),
        options = {
          circleFill: '#87CEEB',
          circleHoverFill: 'red',
          circleStroke: '#000000',
          textFill: '#1414bf',
          fontSize: '0.9em'
        },
        d3Heatmap = new d3.D3Heatmap(options);

        d3Heatmap.render(datasetUrl, container);
  }

  init();

})();