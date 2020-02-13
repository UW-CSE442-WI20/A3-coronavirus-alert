var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = 1200 - margin.left - margin.right;
var height = 900 - margin.top - margin.bottom;
// var color = d3.scaleOrdinal(d3.schemeCategory20c);
var color = d3.scalePow()
    .exponent(0.5)
    .domain([0, 1000])
    .range(["#FDE9D3", "#CC0000"])
var projection = d3.geoMercator()
    .center([88, 30])
    .scale([950])
    .translate([550, 550])
    .precision([.1]);
var path = d3.geoPath()
    .projection(projection);
var svg_map = d3.select("svg")
    .append("g")
    .attr("width", width)
    .attr("height", height);
var tooltip = d3.select("div.tooltip");
var scale = d3.select("svg")

d3.json("https://gist.githubusercontent.com/jialuy/6387783b9d5d3556e63123b3a517a515/raw/4dcd060f3f5f5835e79fae9e82a75f5a5684eec2/gistfile1.txt", function (error, china) {
    if (error) return console.error(error);
    svg_map.selectAll("path")
        .data(china.features)
        .enter()
        .append("path")
        .attr("stroke", "#B6B6B6")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("fill", function (d, i) {
            return color(d.properties.confirmed);
        })
        .attr("d", path)
        .on("mouseover", function (d, i) {
            var html = "";
            html += "Province: " + d.properties.name + "<br/>";
            html += "confirmed: " + d.properties.confirmed + "<br/>";
            html += "dead: " + d.properties.dead + "<br/>";
            html += "healed: " + d.properties.healed;
            d3.select(this).attr("stroke-width", 3).attr("stroke", "black");
            return tooltip.style("hidden", false).html(html);
        })
        .on("mousemove", function (d) {
            var html = "";
            html += "Province: " + d.properties.name + "<br/>";
            html += "confirmed: " + d.properties.confirmed + "<br/>";
            html += "dead: " + d.properties.dead + "<br/>";
            html += "healed: " + d.properties.healed;
            tooltip.classed("hidden", false)
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX + 10) + "px")
                .html(html);
        })
        .on("mouseout", function (d, i) {
            d3.select(this).attr("fill", color(d.properties.confirmed)).attr("stroke", "#B6B6B6").attr("stroke-width", 1);
            tooltip.classed("hidden", true);
        });
});


// D3 visualization for the time series line chart
var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    , width = 400   // the graph's width 
    , height = 300; // the graph's height

//var timeFormat = d3.timeFormat("%d/%m %H:%M")
//var parseSeconds = d3.timeParse("%s")
//var parseDate = d3.timeParse('%m/%d/%Y %H:%M')

var allDatas = [];
d3.json("https://gist.githubusercontent.com/xuey5-1762470/87ebca4f7178520ee575a432e5f7cb1b/raw/e34e9faacb6ce97a778c8c1ed537bf91dcfbc4b4/totals.json", function (error, totals) {
    if (error) return console.error(error);
    // build dataset
    console.log(totals.china[0].values);
   
    for (var i = 0; i < totals.china[0].values.length; i++) {
        var obj = { date: new Date(totals.china[0].values[i].date).toLocaleDateString(), 
                    confirmed: totals.china[0].values[i].confirmed, 
                    deaths: totals.china[0].values[i].deaths,
                    recovered: totals.china[0].values[i].recovered };
        var flag = false;
        for (var j = 0; j < allDatas.length; j++) {
            if (allDatas[j].date == obj.date) {
                allDatas[j] = obj;
                flag = true;
            }
        }
        if (!flag) {
            allDatas.push(obj);
        }
    }
    console.log(allDatas);

    // begin drawings
    draw("0");
});

document.getElementById("s1").onchange = function () {
    draw(this.value);
};

function draw(type) {
    document.getElementById("box1").innerHTML = "";
    var titleName = "";
    var typeName = "";
    if (type=="0") {
        titleName = "confirmed";
        typeName = "confirmed";
    } else if (type=="1") {
        titleName = "deaths";
        typeName = "deaths";
    } else {
        titleName = "recovered";
        typeName = "recovered";
    }
    //var data = allDatas;
    var svg1 = d3.select("#box1").append("svg"),
        margin = {top: 20, right: 50, bottom: 30, left: 90 },
        width = +1160 - margin.left - margin.right,
        height = +500 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var line = d3.line()
        .x(function (d, i) { return x(i); })
        .y(function (d) { return y(d[typeName]); });


    var g = svg1.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
    x.domain([0, 15]); // 13 is the number of data points
    y.domain([0, d3.max(allDatas, function (d) { return d[typeName]; })]);

    g.append("g")
        .attr("class", "axis1 axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(14).tickFormat(function (d, i) { return allDatas[i].date; }));

    g.append("g")
        .attr("class", "axis1 axis--y")
        .call(d3.axisLeft(y).ticks(10).tickFormat(function (d) { return parseInt(d); }))
        .append("text")
        .attr("class", "axis1-title")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -120)
        .style("text-anchor", "end")
        .attr("fill", "#5D6971");

    var yTitle = svg1.append("g")
        .attr("transform", "translate(100,20)");

    yTitle.append("text")
        .attr("class", "axis1-title")
        .attr("x", 10)
        .attr("y", 6)
        .attr("fill", "black")
        .style("font-weight", "600")
        .style("font-size","23px")
        .text("Total number of " + titleName + " cases");


    svg1.selectAll(".svg1.dot")
        .data(allDatas)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function (d, i) { return x(i) + 90 })
        .attr("cy", function (d) { return y(d[typeName]) + 20 })
        .attr("r", 5);

    g.append("path")
        .datum(allDatas)
        .attr("class", "line1")
        .attr("d", line);

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    svg1.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () { focus.style("display", null); })
        .on("mouseout", function () { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = cu(x0),
            d0 = allDatas[i - 1],
            d1 = allDatas[i];
        if (i == 16) {
            var d = d0;
        } else {
            var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        }

        focus.attr("transform", function (dd, ii) {
          return "translate(" + x(i - 1) + "," + y(d[typeName]) + ")";
        });
        focus.select("text").text(function () { return d[typeName]; });
        focus.select(".confirmed-hover-line1").attr("y2", height - y(d[typeName]));
        focus.select(".y-hover-line1").attr("x2", width + width);
    }

    function cu(d) {
        if (d > 14.5) {
            return 16;
        } else {
            return Math.ceil(d);
        }
    }
}
