var margin = {top: 30, right: 20, bottom: 90, left: 50},
    width = 650 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


var x = d3.scaleTime().range([0, width]);
//var x = d3.scaleLinear().range([0, 24]);  
var y = d3.scaleLinear().range([height, 0]);


var priceline = d3.line()	
    .x(function(d) { return x(d.Hour); })
    .y(function(d) { return y(d.Checkins); });

var svg3 = d3.select("#Checkins").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");


d3.csv("checkin.csv", function(error, data) {
    data.forEach(function(d) {
		d.Hour = +d.Hour;
		d.Checkins = +d.Checkins;
    });
  
    x.domain(d3.extent(data, function(d) { return d.Hour; }));
    //x.domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
    y.domain([0, d3.max(data, function(d) { return d.Checkins; })]);

    var dataNest = d3.nest()
    .key(function(d) {return d.Weekday;})
    .entries(data);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    legendSpace = width/dataNest.length;
    
    dataNest.forEach(function(d,i) { 

        svg3.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign an ID
            .attr("d", priceline(d.values));

        // Add the Legend
        svg3.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", 600)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .on("click", function(){
                // Determine if current line is visible 
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1; 
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity", newOpacity); 
                // Update whether or not the elements are active
                d.active = active;
                })  
            .text(d.key); 

    });
    
    svg3.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
    svg3.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));
    
});