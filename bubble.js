
var diameter = 600;

var svg = d3.select("#BubbleChart").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

var pack = d3.pack()
            .size([diameter, diameter])
            .padding(1.5);

var tooltip = d3.select("#BubbleChart").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

d3.csv("restloc.csv", function(d){
    d.value = +d["Count of Business Id"];
    d.City = d["City"]
    d.review = d["Review Count per Document"]
    
    return d;
}, function(error,data){
    
    if (error) throw error;
    
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    
    var root = d3.hierarchy({children: data})
      .sum(function(d) { return d.value; })
    
    var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
 
    node.append("circle")
    .attr("id", function(d) { return d.id; })
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return color(d.data.City); });
    
    node.append("title")
            .text(function(d) {
                return "City : " + d.data.City + "\nNumber of Restarants : " + d.value + "\nTotal number of Reviews : " + d.data.review;
            });

    

    
    
    
  node.append("text")
    .attr("text-anchor", "middle")
    .text(function(d) {
    if (d.data.value > 1500){
    return d.data.City;
    }
    return "";});
});
    
    
