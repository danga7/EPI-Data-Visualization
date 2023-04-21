        var cateArray = [];
        var margin = 50;
        var height = (innerHeight / 4 * 3);
        var width = innerWidth / 5 - (innerWidth / 10);

        //get data
        d3.csv("./2018-2022_countries_index_new.csv").then(function (data) {
            var newData = data.map(function (row) {
                row.EPI2022 = parseFloat(row.EPI2022);
                row.HLT2022 = parseFloat(row.HLT2022);
                row.AIR2022 = parseFloat(row.AIR2022);
                row.H2O2022 = parseFloat(row.H2O2022);
                row.HMT2022 = parseFloat(row.HMT2022);
                row.WMG2022 = parseFloat(row.EPI2022);
                return row;
                // console.log(newData.length);
            })

            //filter by category
            var cateHlt = newData.filter(function (d, i) {
                return d.HLT2022
            })
            var cateAir = newData.filter(function (d, i) {
                return d.AIR2022
            })
            var cateH2o = newData.filter(function (d, i) {
                return d.H2O2022
            })
            var cateHmt = newData.filter(function (d, i) {
                return d.HMT2022
            })
            var cateWmg = newData.filter(function (d, i){
                return d.WMG2022
            })

            console.log(cateWmg)
            console.log(cateHlt)

            //group regions
            var regionGroups = d3.groups(data, function (d) {
                return d.region
            });
            console.log(regionGroups)
            var regions = ["Former Soviet States", "Asia-Pacific", "Eastern Europe", "Greater Middle East", "Latin America & Caribbean", "Southern Asia", "Sub-Saharan Africa", "Global West"]

            var colors = d3.scaleOrdinal()
                .domain(regions)
                .range(["#facb32", "#6fc8d6", "#ed85e6", "#36c960", "#0f4fff", "#ff9b0f", "#4d0835", "#db5e5e"])


            //set arrays
            cateArray1 = [cateAir, cateH2o]
            cateArrayNames1 = ["Air Quality","Water & Sanitation"]
            cateArray2 = [cateHmt, cateWmg]
            cateArrayNames2 = ["Heavy Metals","Waste Management"]
            colorsArray = []

            //set canvas
            var svg = d3.select(".chart")
                .append("svg")
                .attr("class", "plot")

            //set X axis
            var randomX = d3.randomUniform(width - 50, width * 6 + 100)

            //set y axis
            var y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y))
                .attr("font-size", "10px");

            //set bubbles size
            var size = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 60]);

            //set tooltip
            var tooltip_div = d3.select(".chart")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)

            //draw region legends menu
            var svgLegends = d3.select(".regions")
                .append("svg")
                .attr("class", "myRegions")
            svgLegends.selectAll("mydots")
                .data(regions)
                .enter()
                .append("circle")
                .attr("cx", 10)
                .attr("cy", function (d, i) { return 50 + i * 30 })
                .attr("r", 10)
                .style("fill", function (d) { return colors(d) })
                .attr("fill-opacity", "0.6")

            svgLegends.selectAll("mylables")
                .data(regions)
                .enter()
                .append("text")
                .attr("x", 35)
                .attr("y", function (d, i) { return 50 + i * 30 })
                .style("fill", "#2b2b2b")
                .attr("fill-opacity", "0.9")
                .text(function (d) { return ":" + d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            //draw scatterplot
            function draw(cateArray) {
                svg.selectAll("circle")
                    .data(cateArray)
                    .join(function (enter) {
                        return enter.append("circle")
                    })
                    .attr("cx", (width) * 3)
                    .attr("cy", height / 2)

                    .on("mouseover", function (e, d) {
                        tooltip_div.transition()
                            .duration("50")
                            .style("opacity", 0.8)
                        tooltip_div.html(d.country + "<br/> HLT: " + d.HLT2022 + "<br/> AIR: " + d.AIR2022 + "<br/> H2O: " + d.H2O2022 + "<br/> HMT: " + d.HMT2022 + "</br> WMG: " + d.WMG2022)
                            .style("left", (e.pageX + 10) + "px")
                            .style("top", (e.pageY + 10) + "px");
                        d3.select(this).attr("fill-opacity", "1")
                            .attr("fill", "white")
                    })

                    .on("mouseout", function (d) {
                        tooltip_div.transition()
                            .duration("50")
                            .style("opacity", 0)
                        d3.select(this).attr("fill-opacity", "0.6")
                            .attr("fill", function (d) { return colors(d.region) })
                    })

                    .transition()
                    .duration(500)
                    .attr("cx", function (d) { return randomX(d.HLT2022) })
                    .attr("cy", function (d) { return y(d.HLT2022) })
                    .attr("r", function (d) { return size(d.HLT2022) })
                    .attr("fill", function (d) { return colors(d.region) })
                    .attr("fill-opacity", "0.4")
            }

            d3.select(".buttons1")
                .selectAll("button")
                .data(cateArray1)
                .join("button")
                .html(function (d, i) {
                    return cateArrayNames1[i]
                })
                .on("click", function (e, d) {
                    draw(d)
                    console.log(d)
                })
            draw(cateHlt);

            d3.select(".buttons2")
                .selectAll("button")
                .data(cateArray2)
                .join("button")
                .html(function (d, i) {
                    return cateArrayNames2[i]
                })
                .on("click", function (e, d) {
                    draw(d)
                    console.log(d)
                })

        })