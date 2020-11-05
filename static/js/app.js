
function init() {
  // Select the dropdown
  var subjectSelector = d3.select("#selDataset");
  
  // Use the D3 library to read in samples.json.
  d3.json("samples.json").then((data) => {
    var subjectID = data.names;
    subjectID.forEach((id) => { 
      subjectSelector.append("option").text(id); 
    });
    
    // Select the default subject in the dropdown & charts on page load 
    var defaultSubject = subjectID[0];
    updateCharts(defaultSubject);
    updateMetadata(defaultSubject);
  });
}

// Function to update the Demographic Info 
function updateMetadata(subject) {
  
  // Use the D3 library to read in samples.json.
  d3.json("samples.json").then((data) => {
    console.log(data);
    // Pull data from the 'metadata' list
    var metadata = data.metadata;
    var filterList = metadata.filter(subjectObject => subjectObject.id == subject);
    var result = filterList[0];    
    // Select the div
    var metaPanel = d3.select("#sample-metadata");  
    // Clear current info in div
    metaPanel.html("");
    // Create loop to load data
    Object.entries(result).forEach(([key, value]) => {
        metaPanel.append("p").text(`${key}: ${value}`)
    });
  });
}

// Function to update the Charts 
function updateCharts(sample) {    
  // Pull data from the 'samples' list
  d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var filterList = samples.filter(sampleObject => sampleObject.id == sample);
  var result = filterList[0];
  
  // Use sample_values as the values for the bar chart.
  // Use otu_ids as the labels for the bar chart.
  // Use otu_labels as the hovertext for the chart.
  var sample_values = result.sample_values; 
  var otu_ids = result.otu_ids; 
  var otu_labels = result.otu_labels;   

  // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
  var trace1 = {
    type: "bar",
    orientation: "h",
    x: sample_values.slice(0,10).reverse(),
    y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}   `).reverse(),
    text: otu_labels.slice(0,10).reverse()
  };
  Plotly.newPlot("bar", [trace1]);  
  
  // Create bubble chart
  var trace2 = {
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids
      },
    x: otu_ids,
    y: sample_values,
    text: otu_labels
  };
  var layout = {
    xaxis: {title:"OTU ID"},
  };
  Plotly.newPlot("bubble", [trace2], layout); 
});

  
}

// Function to update subject in the dropdown & charts on select
function optionChanged(selectSubject) {
  updateCharts(selectSubject);
  updateMetadata(selectSubject);
}

// Initialize the dashboard
init();
















