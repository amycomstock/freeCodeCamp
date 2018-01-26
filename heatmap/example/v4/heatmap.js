const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',
months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
colors = ['#2C7BB6', '#00A6CA','#00CCBC','#90EB9D','#FFFF8C','#F9D057','#F29E2E','#E76818','#D7191C'],
margin = {top: 100,right: 20,bottom: 100,left: 60},
width = 1000,
height = 400;

const tooltip = d3.select('body').append('div')
.attr('id', 'tooltip');

const x = d3.scaleTime()
.range([0, width]);

const y = d3.scaleLinear()
.range([height, 0]);

const chart = d3.select('#chart')
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`);

chart.append('text')             
.attr('transform', `translate(${width/2},${ -45})`)
.attr('id', 'title')
.text('Monthly Global Land Surface Temperatures: 1753-2015');

chart.append('text')             
.attr('transform', `translate(${width/2},${ -20})`)
.attr('id', 'description')
.text('Temperatures are relative to the Jan 1951 - Dec 1980 estimated average global temperature: 8.66°C ± 0.07');

chart.append('g')
.selectAll('text')
.data(months)
.enter().append('text')
.attr('class','months')
.attr('x', (d) => `${-10}`)
.attr('y', (d, i) => `${20 + (i * 33.4)}`)
.attr('text-anchor','end')
.text((d) => `${d}`);

d3.json(url, (data) => {

  const date = (year) => new Date(Date.parse(year));

  x.domain([date(data.monthlyVariance[0].year), date(data.monthlyVariance[data.monthlyVariance.length - 1].year)]);
  y.domain([0,12]);

  const xTicks = x.ticks().concat(new Date(data.monthlyVariance[data.monthlyVariance.length - 1].year, 0));

  chart.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(xTicks));  

  const colorScale = d3.scaleQuantize()
    .domain([d3.min(data.monthlyVariance, (d) => d.variance), d3.max(data.monthlyVariance, (d) => d.variance)])
    .range(colors);

  chart.selectAll('.bar')
    .data(data.monthlyVariance)
    .enter().append('rect')
    .attr('class','bar')
    .attr('x', (d) => x(new Date(d.year, 0)))
    .attr('width', ((width / data.monthlyVariance.length) + 40) / 12)
    .attr('y', (d) => y(d.month))
    .attr('height', height / 12)
    .attr('fill', (d) => colorScale(d.variance))
    .on('mouseover', (d) => {
      tooltip.transition()
        .duration(100)		
        .style('opacity', .9);
      tooltip.text(`${months[months.length - d.month]} ${d.year} ${d.variance.toFixed(3)}°C`)
        .style('left', `${d3.event.pageX - 55}px`)	
        .style('top', `${d3.event.pageY - 40}px`);
    })
    .on('mouseout', () => {		
      tooltip.transition()		
      .duration(400)		
      .style('opacity', 0);	
    });
});

const gradientScale = d3.scaleLinear()
.range(colors);

const linearGradient = chart.append('linearGradient')
.attr('id', 'linear-gradient');  

linearGradient.selectAll('stop') 
.data(gradientScale.range())                  
.enter().append('stop')
.attr('offset', (d,i) => i/(gradientScale.range().length - 1))
.attr('stop-color', (d) => d);

chart.append('rect')
.attr('width', 300)
.attr('height', 20)
.style('fill', 'url(#linear-gradient)')
.attr('transform', 'translate(350,440)');

chart.append('g')
.selectAll('text')
.data(Array.from(Array(13).keys()))
.enter().append('text')
.attr('class','temperatures')
.attr('x', (d) => `${352 + (Math.ceil(300 / 13) * d)}`)
.attr('y', '470')
.text((d) => `${d - 6}`);