"use strict"

//Constants
let w = 1200,
		h = 650;

let margin = {
	top: 20,
	bottom: 175,
	left: 120,
	right: 30
};

let width = w - margin.left - margin.right;
let height = h - margin.top - margin.bottom;

// Scaling
let x = d3.scale.ordinal().rangeBands([0, width]);
let y = d3.scale.linear().range([height, 0]);

// Axis
let xAxis = d3.svg.axis().scale(x).orient("bottom");
let yAxis = d3.svg.axis().scale(y).orient("left");

// Gridlines
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

let colors = d3.scale.category20();

// Drawing area
let svg = d3.select("body")
	.append("svg")
		.attr("id", "chart-element")
		.attr("width", w)
		.attr("height", h);

let chart = svg.append("g")
	.classed("display", true)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Reload the data
let reload = () => {
	d3.csv("allamusica_general_ledger.csv", (error, data) => {
		if (error) throw error;
		redraw(data);
	});
}

//Redraw the data
let redraw = (data) => {
	//there are strings as data and they also contain commas. Function below removes them.
	data.forEach((d) => {
		d.credit = +d.credit.split(",").join(""); 
		d.debit = +d.debit.split(",").join("");
	});

	x.domain(data.map((d) => { return d.account; } ));
	y.domain([0, d3.max(data, (d) => { return d.debit; })]);

	chart.append("g")
		.call(yGridlines)
		.classed("gridline", true)
		.attr("transform", "translate(0,0)");

	chart.append("g")
		.call(xGridlines)
		.classed("gridline", true)
		.attr("transform", "translate(0,0)");

	let bars = chart.selectAll("rect.bar")
		.data(data);

	bars.enter()
		.append("rect")
		.classed("bar", true);

	bars	 
		.style("fill", (d, i) => {return colors(i);})
		.attr("x", (d,i) => {return x(d.account);})
		.attr("y", y(0)) //start y at 0 for the beginning of the animation
		.attr("height", 0) //start the height at 0
		.attr("width", x.rangeBand() - 1) // makes it 1px separation
		.transition() //start the transition
		.delay( (d,i) => { return i * 40 }) //delay the transition that takes 50ms
		.ease("elastic") // set ease to elastic which makes it bounce
		.duration(500) //...for a duration of 800ms
		.attr("y", (d) => { return y(d.debit); }) //...and ends up here, at the fully drawn bars
		.attr("height", (d) => { return y(0) - y(d.debit); });

	bars 
		.on("mouseover", function(d) {
			d3.select(this)
				.style("opacity", .5);
		})
		.on("mouseout", function(d) {
			d3.select(this)
				.style("opacity", 1);
		});

	chart.append("g")
		.classed("x axis", true)
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")	
      .attr("dx", "-10")
      .attr("dy", "5")
      .attr("transform", (d) => { return "rotate(-45)" });

	chart.append("g")
		.classed("y axis", true)
		.attr("transform", "translate(0,0)")
		.call(yAxis);	

	chart.select(".x.axis")
		.append("text")
		.classed("axis-title", true)
		.attr("x", 0)
		.attr("y", 0)
		.attr("transform", "translate(" + width/2 + ",140)")
		.style("text-anchor", "middle")
		.text("Debit Accounts")
		.style("font-size", "18px");

	chart.select(".y.axis")
		.append("text")
		.classed("axis-title", true)
		.attr("x", 0)
		.attr("y", 0)
		.attr("transform", "translate(-70," + height/2 + ") rotate(-90)")
		.text("Debit Amount (USD)")
		.style("font-size", "18px");	
}

//Call the reload function
reload();









