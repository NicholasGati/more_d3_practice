"use strict"
// Bar Chart //////////
let w = 800, //initial width and height without margins
		h = 450;

let margin = { // margins
	top: 40,
	bottom: 60,
	left: 110,
	right: 20
}		

let width = w - margin.left - margin.right; //the width and height WITH margins
let height = h - margin.top - margin.bottom;

let donuts = [
	{key: "Glazed", value: 132},
	{key: "Jelly", value: 71},
	{key: "Holes", value: 337},
	{key: "Sprinkles", value: 93},
	{key: "Crumb", value: 78},
	{key: "Chocolate", value: 43},
	{key: "Coconut", value: 20},
	{key: "Cream", value: 16},
	{key: "Cruller", value: 30},
	{key: "Èclair", value: 8},
	{key: "Fritter", value: 17},
	{key: "Bearclaw", value: 21}
]

//scaling the data to fit the chart
let x = d3.scale.linear()
	.domain([0, d3.max(donuts, (d) => { return d.value; })])
	.range([0,width]);

// If we wanted to associete the y scale to y coordinates
let y = d3.scale.ordinal()
	.domain(donuts.map( (entry) => {
		return entry.key;
	}))
	.rangeBands([0, height]);

let linearColorScale = d3.scale.linear() //gradient colors
	.domain([0, donuts.length])
	.range(["#572500", "#f68026"]); 

let ordinalColorScale = d3.scale.category20(); //distinct colors

let xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom");

let yAxis = d3.svg.axis()
						.scale(y)
						.orient("left");

let xGridlines = d3.svg.axis()
						.scale(x)
						.tickSize(height,0,0)
						.tickFormat("")
						.orient("bottom");						

let yGridlines = d3.svg.axis()
						.scale(y)
						.tickSize(-width,0,0)
						.tickFormat("")
						.orient("left");

let svg = d3.select("body").append("svg")
	.attr("id", "chart")
	.attr("width", w)
	.attr("height", h);

let chart = svg.append("g") //groups everything together by putting them in a chart
	.classed("display", true)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //translate x and y

let title = chart.append("text")
	.text("Daily Sales Per Donut Type")
	.classed("title", true)
	.attr("x", 0)
	.attr("y", 0)
	.attr("transform", "translate(" + width/3 + ",-20)");

function plot(params) {
	this.append("g")
		.call(params.gridlines.yGridlines)
		.classed("gridline", true)
		.attr("transform", "translate(0,0)");

	this.append("g")
		.call(params.gridlines.xGridlines)
		.classed("gridline", true)
		.attr("transform", "translate(0,0)");

	let bars = this.selectAll(".bar")
		.data(params.data);

	bars.enter()
		.append("rect")
		.classed("bar", true)
		.attr("x", 0)
		.attr("y", (d,i) => { return y(d.key); })
		.attr("height", (d,i) => { 
			return y.rangeBand() - 1;
		})
		.attr("width", 0)
		.transition()
		.delay( (d,i) => { return i * 10 })
		.ease("elastic")
		.duration(2000)
		.attr("width", (d) => { return x(d.value); })
		.style("fill", (d,i) => { 
			return ordinalColorScale(i); //distinct colors
			//return linearColorScale(i); //gradient scales 
		});

	bars
		.on("mouseover", function(d) {
			d3.select(this)
				.style("opacity", .5);
		})
		.on("mouseout", function(d) {
			d3.select(this)
				.style("opacity", 1);
		});

	
	this.selectAll(".bar-label")
		.data(params.data)
		.enter()
			.append("text")
			.classed("bar-label", true)
			.attr("x", (d) => { return x(d.value);}) //getting the text to be at the end of the bars
			.attr("dx", -4)
			.attr("y", (d,i) => { return y(d.key); })
			.attr("dy", (d,i) => { return y.rangeBand()/1.5 + 2; })
			.style("opacity", 0)
			.transition()
			.duration(2500)
			.style("opacity", 1)
			.text((d) => { return d.value; });

	this.append("g")
		.classed("x axis", true)
		.attr("transform", "translate(0," + height + ")")
		.call(params.axis.x);

	this.append("g")
		.classed("y axis", true)
		.attr("transform", "translate(0,0)")
		.call(params.axis.y);

	this.select(".x.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("transform", "translate(" + width/2  + ", 50)")
		.style("text-anchor", "middle")
		.text("Units Sold");

	this.select(".y.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("transform", "translate(-90," + height/2  + ") rotate(-90)")
		.style("text-anchor", "middle")
		.text("Donut Types");

}

//the .call on the method called plot is making "this" the first parameter below. Then setting parameter of data to data2. Doing it this way ensures that you aren't making direct references in your above code.
plot.call(chart,{
	data: donuts,
	axis: {
		x: xAxis,
		y: yAxis
	},
	gridlines: {
		xGridlines: xGridlines,
		yGridlines: yGridlines
	}
});

// let width = 960,
//     height = 700,
//     radius = Math.min(width, height) / 2,
//     color = d3.scale.category20c();

// let svg = d3.select("#circle").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

// let partition = d3.layout.partition()
//     .sort(null)
//     .size([2 * Math.PI, radius * radius])
//     .value((d) => { return 1; });

// let arc = d3.svg.arc()
//     .startAngle((d) => { return d.x; })
//     .endAngle((d) => { return d.x + d.dx; })
//     .innerRadius((d) => { return Math.sqrt(d.y); })
//     .outerRadius((d) => { return Math.sqrt(d.y + d.dy); });

// d3.json("flare.json", (error, root) => {
//   if (error) throw error;

//   let path = svg.datum(root).selectAll("path")
//       .data(partition.nodes)
//     .enter().append("path")
//       .attr("display", (d) => { return d.depth ? null : "none"; }) // hide inner ring
//       .attr("d", arc)
//       .style("stroke", "#fff")
//       .style("fill", (d) => { return color((d.children ? d : d.parent).name); })
//       .style("fill-rule", "evenodd")
//       .text((d) => {return ( d.children ? d : d.parent).name })
//       .each(stash);

//   d3.selectAll("input").on("change", function change() {
//     let value = this.value === "count"
//         ? () => { return 1; }
//         : (d) => { return d.size; };

//     path
//         .data(partition.value(value).nodes)
//       .transition()
//         .duration(2000)
//         .attrTween("d", arcTween);
//   });
// });

// // Stash the old values for transition.
// function stash(d) {
//   d.x0 = d.x;
//   d.dx0 = d.dx;
// }

// // Interpolate the arcs in data space.
// function arcTween(a) {
//   let i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
//   return (t) => {
//     let b = i(t);
//     a.x0 = b.x;
//     a.dx0 = b.dx;
//     return arc(b);
//   };
// }

// d3.select(self.frameElement).style("height", height + "px");




////////////////////////

// // To load a CSV file, use the d3.csv() method. But here, I use an equivalent method, d3.text(), to load it as plain text and use a d3 helper to parse the CSV.
// d3.text("cars.csv", (datasetText) => {
// 	let parsedCSV = d3.csv.parseRows(datasetText);

// 	let sampleHTML = d3.select("#viz")
// 		.append("table")
// 		.style("border-collapse", "collapse")
// 		.style("border", "2px solid black")

// 		.selectAll("tr")
// 		.data(parsedCSV)
// 		.enter().append("tr")

// 		.selectAll("td")
// 		.data((d) => {return d;})
// 		.enter().append("td")
// 		.style("border", "1px solid black")
// 		.style("padding", "5px")
// 		.style("text-transform", "capitalize")
// 		.on("mouseover", function() {d3.select(this).style("background-color", "aliceblue") })
// 		.on("mouseout", function() {d3.select(this).style("background-color", "white")	})
// 		.text((d) => {return d;})
// 		.style("font-size", "12px");
// });


// let svgWidth = 550;
// let svgHeight = 50;

// let bodySelection = d3.select("body");

// let svgSelection = bodySelection.append('svg')
// 	.attr('width', svgWidth * 5 + "px")
// 	.attr('height',svgHeight * 5 + "px");
	
// let circleSelection = svgSelection.append('circle')
// 	.attr('cx', -25)
// 	.attr('cy', -25)
// 	.transition()
// 	.duration(2000)
// 	.attr('cx', 600)
// 	.attr('cy', 100)
// 	.attr('r', 25)
// 	.style('fill', 'green');

// //Second circle area
// let circleRadii = [50, 40, 20, 10, 5];
// let colors = ['red', 'green', 'blue'];
// let svg2 = bodySelection.append("svg")
// 	.attr('width', 500)
// 	.attr('height', 200);

// //Second circle set
// let circles = svg2.selectAll('circle')
// 	.data(circleRadii)
// 	.enter()
// 	.append('circle')
// 	.attr('cx', 50)
// 	.attr('cy', 50)
// 	.attr('r', 0) //Radius starting point
// 	.transition() //Create the transition
// 	.delay((d,i) => { return i * 100 })
// 	.duration(2000)
// 	.attr('cx', 250)
// 	.attr('r', (d) => { return +d; }) //radius end point
// 	.style('fill', (d) => {
// 		let returnColor;
// 		if (d === 50) {returnColor = "orange"}
// 		else if (d === 40) {returnColor = "purple"} 
// 		else if (d === 20) {returnColor = "red"}
// 		else if (d === 10) {returnColor = "green"}
// 		else if (d === 5) {returnColor = "blue"}
// 		return returnColor;		
// 	});

// let newDiv = bodySelection.append('div')
// 	.classed("div2", true)
// 	.append("p")
// 	.text("Test 1-2-3")
// 	.style("color", "#d6c8e6")
// 	.style("font-size", "2em")
// 	.style("font-family", "didot");

// let dataSet = [1,2,3,4,5];

// let p = bodySelection.selectAll('p')
// 	.data(dataSet)
// 	.enter()
// 	.append('p')
// 	.text( (d, i) => { return "i = " + i + " and " + "d = " + +d ; } ) //arrow function syntax of ES6
// 	.style('color', 'red')
// 	.style('font-size', (d) => { return +d + "em"; }); // Take the data and make the font size change

// let svg3 = d3.select("body").append("svg")
// 	.attr("width", "500px")
// 	.attr("height", "250px");







