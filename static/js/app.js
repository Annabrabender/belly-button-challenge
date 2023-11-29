

// Setting the URL given in assignment for which the data will be fetched 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to initialize the page
function init() {
  // Fetch the data using D3
  d3.json(url).then(data => {
    // Get the names which are the id numbers 
    const names = data.names;

    // Populate the dropdown menu with individual names
    d3.select("#selDataset")
      .selectAll("option")
      .data(names)
      .enter()
      .append("option")
      // return the same value it recieves 
      .text(d => d)
      //set the the "value" attribute of each "option" to the corresponding values in the "names" array 
      .property("value", d => d);

    // Initialize the page with the first individual [0]
    const initialIndividual = names[0];
    updateCharts(initialIndividual);
    displayMetadata(initialIndividual);
  });
}

// Function to update the charts based on the selected individual
function updateCharts(selectedIndividual) {
  d3.json(url).then(data => {
    // Find the data for the selected individual
    const individualData = data.samples.find(sample => sample.id === selectedIndividual);

    // Get the top 10 OTUs for the bar chart // Reversing the order for correct display 
    const topOtuIds = individualData.otu_ids.slice(0, 10).reverse();
    const topSampleValues = individualData.sample_values.slice(0, 10).reverse();
    const topOtuLabels = individualData.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart
    const tracebar1 = {
      x: topSampleValues,
      y: topOtuIds.map(id => `OTU ${id}`),
      text: topOtuLabels,
      type: "bar",
      orientation: "h",
    };

    const layoutbar1 = {
      title: `Top 10 OTUs for Individual ${selectedIndividual}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" },
    };

    // Update or create the bar chart
    Plotly.newPlot("bar", [tracebar1], layoutbar1);

    // Create the bubble chart
    const tracebubble2 = {
      x: individualData.otu_ids,
      y: individualData.sample_values,
      mode: "markers",
      marker: {
        size: individualData.sample_values,
        color: individualData.otu_ids,
      },
      text: individualData.otu_labels,
    };

    const layoutbubble2 = {
      title: `Bubble Chart for Individual ${selectedIndividual}`,
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
    };

    // Update or create the bubble chart
    Plotly.newPlot("bubble", [tracebubble2], layoutbubble2);
  });
}

// Function to display sample metadata
function displayMetadata(selectedIndividual) {
  d3.json(url).then(data => {
    // Find the metadata for the selected individual
    const metadata = data.metadata.find(meta => meta.id === parseInt(selectedIndividual));

    // Display metadata on the page
    const metadataContainer = d3.select("#sample-metadata");
    metadataContainer.html(""); // Clear previous content

    Object.entries(metadata).forEach(([key, value]) => {
      metadataContainer.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to be called when the dropdown selection changes
function optionChanged(selectedIndividual) {
  updateCharts(selectedIndividual);
  displayMetadata(selectedIndividual);
}

// Initialize the page
init();