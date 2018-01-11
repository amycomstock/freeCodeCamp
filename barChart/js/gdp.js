(function () {
  function init() {
    var datasetUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
        container = document.getElementById('bar-chart'),
        options = {
          barFill: '#87CEEB',
          barHoverFill: 'red'
        },
        d3BarChart = new d3.D3BarChart(options);

    d3BarChart.render(datasetUrl, container);

  }

  init();

})();