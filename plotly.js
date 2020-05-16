var sampleCases;

function init() {
  d3.json("samples.json").then(data => {
    sampleCases = data;
    var selectValues = data.names;
    var dropdownSelect = d3.select("#caseDropdown");

    selectValues.forEach(value => {
      dropdownSelect
        .append("option")
        .text(value)
        .attr("value", function () {
          return value;
        });
    });
  });
}

init();


d3.selectAll("#caseDropdown").on("change", createGraphs);

function createGraphs() {
  var valueSelect = d3.select("#caseDropdown").node().value;
  loadDemographics(valueSelect);
  panelPlot(valueSelect);
  bubbleChart(valueSelect);
  gaugeChart(valueSelect);
}

function loadDemographics(valueSelect) {
  var filterValue2 = sampleCases.samples.filter(value => value.id == valueSelect);
  var presentOTUs = filterValue2.map(x => x.otu_ids);
  presentOTUs = createOtuIds(presentOTUs[0].slice(0, 10));
  var valueX = filterValue2.map(x => x.sample_values);
  valueX = valueX[0].slice(0, 10);

  var otuID = filterValue2.map(x => x.otu_labels);
  var names = getBacteria(otuID[0]).slice(0, 10);


  var trace = {
    x: valueX,
    y: presentOTUs,
    text: names,
    type: "bar",
    orientation: "h"
  };

  var layout = {
    title: "Top 10 Bacteria Types",
    yaxis: {
      autorange: "reversed"
    }
  };


  var sampleCaseArr = [trace];

  Plotly.newPlot("barChart", sampleCaseArr, layout);
}





function getBacteria(name) {
  var listOfBact = [];

  for (var i = 0; i < name.length; i++) {
    var stringName = name[i].toString();
    var splitValue = stringName.split(";");
    if (splitValue.length > 1) {
      listOfBact.push(splitValue[splitValue.length - 1]);
    } else {
      listOfBact.push(splitValue[0]);
    }
  }
  return listOfBact;
}

function createOtuIds(name) {
  var listOfPresentOTUs = [];
  for (var i = 0; i < name.length; i++) {
    listOfPresentOTUs.push(`OTU ${name[i]}`);
  }
  return listOfPresentOTUs;
}





function panelPlot(valueSelect) {
  var filterValue = sampleCases.metadata.filter(value => value.id == valueSelect);
  var divValue = d3.select(".panel-body");
  divValue.html("");
  divValue.append("p").text(`id: ${filterValue[0].id}`);
  divValue.append("p").text(`ethnicity: ${filterValue[0].ethnicity}`);
  divValue.append("p").text(`gender: ${filterValue[0].gender}`);
  divValue.append("p").text(`age: ${filterValue[0].age}`);
  divValue.append("p").text(`location: ${filterValue[0].location}`);
  divValue.append("p").text(`bbtype: ${filterValue[0].bbtype}`);
  divValue.append("p").text(`wfreq: ${filterValue[0].wfreq}`);
}


function bubbleChart(valueSelect) {
  var filterValue3 = sampleCases.samples.filter(value => value.id == valueSelect);
  var presentOTUs = filterValue3.map(x => x.otu_ids);
  presentOTUs = presentOTUs[0];
  var valueY = filterValue3.map(x => x.sample_values);
  valueY = valueY[0];
  var otuID = filterValue3.map(x => x.otu_labels);
  otuID = getBacteria(otuID[0]);
  var trace1 = {
    x: presentOTUs,
    y: valueY,
    mode: "markers",
    marker: {
      color: presentOTUs,
      size: valueY
    },
    text: otuID
  };
  var sampleCaseArr2 = [trace1];
  var layout = {
    showlegend: false,
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Cases"
    }
  };

  Plotly.newPlot("bubbleChart", sampleCaseArr2, layout);
}


function gaugeChart(valueSelect) {
  var filterValue = sampleCases.metadata.filter(value => value.id == valueSelect);
  var weeklyFreq = filterValue[0].wfreq;

  var washingFreq = [{
    domain: {
      x: [0, 1],
      y: [0, 1]
    },
    title: {
      text: "Washing Frequency"
    },
    type: "indicator",

    mode: "gauge",
    gauge: {
      axis: {
        range: [0, 9],
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ticks: "outside"
      },

      steps: [{
          range: [0, 1],
          color:"#5D673E"

        },
        {
          range: [1, 2],
          color:"#797B4C" 
        },
        {
          range: [2, 3],
          color: "#A28B67" 
        },
        {
          range: [3, 4],
          color: "#AF917A"
        },
        {
          range: [4, 5],
          color: "#BC998E"
        },
        {
          range: [5, 6],
          color: "lightblue"
        },
        {
          range: [6, 7],
          color: "#3939cb" 
          
        },
        {
          range: [7, 8],
          color: "#0000bb"
        },
        {
          range: [8, 9],
          color: "darkblue"
        }
      ],
      threshold: {
        line: {
          color: "red",
          width: 4
        },
        thickness: 1,
        value: weeklyFreq
      }
    }
  }];

  var layout = {
    width: 600,
    height: 500,
    margin: {
      t: 0,
      b: 0
    }
  };
  Plotly.newPlot("gaugeChart", washingFreq, layout);
}