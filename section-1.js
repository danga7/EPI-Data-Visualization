var data = {
    nodes: [
        {name: "HLT", wt:"100", title:"Environmental Health", description: "Main index that are made from 4 different category."},
        {name: "AIR", wt:"50", title:"Air Quality", description: "PM2.5 Exposure, Household Solid Fuels, Ozone Exposure"},
        {name: "H2O", wt:"40", title:"Water & Sanitation", description: "Unsafe Sanitation, Unsafe Drinking Water"},
        {name: "HMT", wt:"5", title:"Heavy Metals", description: "Lead Exposure"},
        {name: "WMG", wt:"5", title:"Waste Management", description: "Controlled Solid Waste"}
    ],
    links: [
        {source: "HLT", target: "AIR"},
        {source: "HLT", target: "H2O"},
        {source: "HLT", target: "HMT"},
        {source: "HLT", target: "WMG"},
    ]
}

var margin = {top: 15, bottom: 15, left: 30, right: 30},
    width = innerWidth/3,
    height = innerHeight/3*2;

//setup force
var simulation = d3.forceSimulation(data.nodes)
    .force("charge", d3.forceManyBody().strength(-800))
    .force("center", d3.forceCenter(width/2, height/2))
    .force("link", d3.forceLink(data.links)
                    .id(function(d){
                        return d.name;
                    })
                    .distance(130))
    .on("tick", ticked);

//colors for nodes
var nodesColor = d3.scaleOrdinal()
                .domain("EPI", "HLT", "AIR", "H2O", "HMT")
                .range(["#025BA7", "#3EA1DA", "#6BB346", "#F99C1C", "#2A4077"])

var svg1 = d3.select("#svg1")
            .append("svg")
            .attr("width", width)
            .attr("height",height)
            .append("g")
            
var link = svg1.append("g")
            .attr("class","links")
            .selectAll("line")
            .data(data.links)
            .join("line")
                .style("stroke","#383838")

var nodeSize = d3.scaleLinear()
                .domain([0,100])
                .range([20,70]);
                
var node = svg1.append("g")
                .attr("class","nodes")
                .selectAll("circle")
                .data(data.nodes)
                .join("circle")
                    .attr("r", function (d) { return nodeSize(d.wt) })
                    .attr("fill", function(d){
                        return nodesColor(d.name)
                    })
                    .on("mouseover", function(e,d){
                        d3.select("#tooltip_node")
                            .html(d.title + "(" + d.name + ")" + "<br/><br/> Level of aggregation: " + d.wt + "%" + "<br/><br/> Calculated based on:<br/>" + d.description)
                        d3.select(this)
                            .attr("r", function (d) { return (nodeSize(d.wt) + 10) })
                    })
                    .on("mouseout", function(d){
                        d3.select("#tooltip_node")
                            .html(d.name)
                            .attr("opacity",0)
                        d3.select(this)
                            .attr("r", function (d) { return nodeSize(d.wt) })
                    })

var nodeText = svg1.selectAll("text")
                    .data(data.nodes)
                    
node.append("nodeText").text(d=>d.name)

function ticked(){
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node
        .attr("cx", function (d) { return d.x+10; })
        .attr("cy", function(d) { return d.y-6; });             
}

