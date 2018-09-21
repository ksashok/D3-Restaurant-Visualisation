function donutChart() {
    var width7,
        height7,
        margin7 = {top: 10, right: 10, bottom: 10, left: 10},
        colour7 = d3.scaleOrdinal(d3.schemeCategory20c), 
        variable, // value in data that will dictate proportions on chart
        category, // compare data by
        padAngle, // effectively dictates the gap between slices
        floatFormat = d3.format('.4r'),
        cornerRadius, // sets how rounded the corners are on each slice
        percentFormat = d3.format(',.2%');

    function chart(selection){
        selection.each(function(data) {
            
            var radius = Math.min(width7, height7) / 2;

            var pie = d3.pie()
                .value(function(d) { return floatFormat(d[variable]); })
                .sort(null);

            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.6)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
           
            var svg7 = selection.append('svg')
                .attr('width', width7 + margin7.left + margin7.right)
                .attr('height', height7 + margin7.top + margin7.bottom)
              .append('g')
                .attr('transform', 'translate(' + width7 / 2 + ',' + height7 / 2 + ')');
            
            svg7.append('g').attr('class', 'slices');
            svg7.append('g').attr('class', 'labelName');
            svg7.append('g').attr('class', 'lines');

            var path = svg7.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
              .enter().append('path')
                .attr('fill', function(d) { return colour7(d.data[category]); })
                .attr('d', arc);

            var label = svg7.select('.labelName').selectAll('text')
                .data(pie)
              .enter().append('text')
                .attr('dy', '.35em')
                .html(function(d) {
                    
                    return d.data[category] + ': <tspan>' + (d.data[variable]) + '</tspan>';
                })
                .attr('transform', function(d) {


                    var pos = outerArc.centroid(d);

                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function(d) {

                    return (midAngle(d)) < Math.PI ? 'start' : 'end';
                });

            var polyline = svg7.select('.lines')
                .selectAll('polyline')
                .data(pie)
              .enter().append('polyline')
                .attr('points', function(d) {

                    // see label transform function for explanations of these three lines.
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                });
           
            d3.selectAll('.labelName text, .slices path').call(toolTip);
            
            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

            function toolTip(selection) {

              
                selection.on('mouseenter', function (data) {

                    svg7.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html(toolTipHTML(data)) // add text to the circle.
                        .style('font-size', '.9em')
                        .style('text-anchor', 'middle'); // centres text in tooltip

                    svg7.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.55) // radius of tooltip circle
                        .style('fill', colour7(data.data[category])) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);

                });

                selection.on('mouseout', function () {
                    d3.selectAll('.toolCircle').remove();
                });
            }


            function toolTipHTML(data) {

                var tip = '',
                    i   = 0;

                for (var key in data.data) {

                    // if value is a number, format it as a percentage
                    var value = (!isNaN(parseFloat(data.data[key]))) ? (data.data[key]) : data.data[key];

                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                    else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                    i++;
                }

                return tip;
            }
           

        });
    }

    
    chart.width = function(value) {
        if (!arguments.length) return width;
        width7 = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height7 = value;
        return chart;
    };

    chart.margin7 = function(value) {
        if (!arguments.length) return margin7;
        margin7 = value;
        return chart;
    };

    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function(value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function(value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.colour = function(value) {
        if (!arguments.length) return colour7;
        colour7 = value;
        return chart;
    };

    chart.variable = function(value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function(value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}
