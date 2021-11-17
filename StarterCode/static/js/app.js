function getInfo(id) {
	d3.json("samples.json").then((data)=> {
		//Pass in JSON data and filter by selected ID. Grab the only value with array indexing.
		let item = data.metadata.filter(item => item.id == id)[0];
		//Initialize string for output
		let txt = "";
		//Loop throuugh values format and add them to to text string
		for (let i in item) {
			txt += ( "\n" + "<b>" + i + ": " + item[i]  + "</b>" + "<br>" + "<br>");
		};

		//Select element to output text and get desired format
		var panel = document.getElementById("sample-metadata");
		panel.style.fontSize = "11.5px";
		panel.style.fontFamily = "Arial";
		panel.innerHTML = txt;
	});

}

function updatePlotly(id) {
	let otuIds = [];
	let sampleValues = [];
	
	d3.json("samples.json").then((data)=> {
		//Pass in JSON data and filter by selected ID. Grab the only value with array indexing.
		let item = data.samples.filter(item => item.id == id)[0];
		//Get required data from item by getting children
		otuIds = item.otu_ids;
		sampleValues = item.sample_values;
		labels = item.otu_labels;
		
		//slice and reverse all arrays to get 10 in plotly defaults
		let sliced_labels = labels.slice(0,10).reverse();
		let sliced_otu_ids = otuIds.slice(0, 10).reverse();
		let sliced_sample_values = sampleValues.slice(0, 10).reverse();
		
		//Add OTU to all ID names for axis. Required to generate x axis labels
		let add_otu = sliced_otu_ids.map(i => "OTU " + i);

		//Construct Plotly traces
		let trace1 = {
			x: sliced_sample_values,
			y: add_otu,
			text: sliced_labels,
			type: "bar",
			orientation: 'h'
	
		};
		//Plotly requires array
		let plot_data = [trace1];
		
		//Set Plotly layout
		let layout = {
			title: "Top 10 OTU in Samples",

			margin: {
			  l: 100,
			  r: 100,
			  t: 45,
			  b: 60
			}
		  };
		
		//Generate chart and link to index.html
		Plotly.newPlot("bar", plot_data, layout);


		let trace2 = {
			x: otuIds,
			y: sampleValues,
			mode: 'markers',
			marker: {
				size: sampleValues,
				color: otuIds,
				
			},
			text: labels
		};

		var bubble_data = [trace2];

		var layout2 = {
  		showlegend: false,
  		height: 600,
  		width: 1000
		};

		Plotly.newPlot('bubble', bubble_data, layout2);
	
	});
	


}
function optionChanged(id) {
	updatePlotly(id);
	getInfo(id);
}
function init() {
			// select dropdown menu 
			
			var dropdown = d3.select("#selDataset");
			// read the data 
			d3.json("samples.json").then((data)=> {
				//loop data into dropdown
				console.log(data);
				for (let i=0; i <data.names.length; i++)
		 		{
					dropdown.append("option")
					.text(data.names[i])
					.property("value")
		 		}
			
			//Call functions to have data appear on the screen
			updatePlotly(data.names[0]);
			getInfo(data.names[0]);
				
			});

	 }

init();

