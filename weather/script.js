const tableBody = document.getElementById("weather-table-body");
const dataTypeHeader = document.getElementById("data-type-header");
const mean = document.getElementById('mean');
const median = document.getElementById('median');
const mode = document.getElementById('mode');
const range = document.getElementById('range');
const standardDeviation = document.getElementById('standardDeviation');
const calculationsDiv = document.getElementById('calculations');
const chartContainer = document.getElementById('chart-container');
const canvas = document.getElementById('myChart');
const valueDropDown = document.getElementById("valueDropDown");
const timeDropDown = document.getElementById("timeDropDown");
let isLatest = false;

async function createTable() {
  const table = document.getElementById("weather-table");
  let thead = table.querySelector("thead");

  // Fade out existing header row if it exists
  if (thead) {
      table.removeChild(thead);
  }

  // Create new header row
  thead = document.createElement("thead");
  const row = document.createElement("tr");

  const dateHeader = document.createElement("th");
  dateHeader.innerText = "Date";
  row.appendChild(dateHeader);

  const timeHeader = document.createElement("th");
  timeHeader.innerText = "Time";
  row.appendChild(timeHeader);

  const valueHeader = document.createElement("th");
  valueHeader.innerText = "Value";
  row.appendChild(valueHeader);

  if (isLatest) {
    const dataTypeHeader = document.createElement("th");
    dataTypeHeader.innerText = "Data Type";
    row.appendChild(dataTypeHeader);
  }

  thead.appendChild(row);
  table.appendChild(thead);

  // Fade in new header row
  fadeIn(thead, 200);
}

async function addDataToTable(date, time, value, dataType) {
  const tableBody = document.getElementById("weather-table-body");

  const row = document.createElement("tr");

  const dateCell = document.createElement("td");
  dateCell.innerText = date;
  row.appendChild(dateCell);

  const timeCell = document.createElement("td");
  timeCell.innerText = time;
  row.appendChild(timeCell);

  const valueCell = document.createElement("td");
  const formattedValue = parseFloat(value).toFixed(2);
  valueCell.innerText = formattedValue;
  row.appendChild(valueCell);

  if (isLatest) {
    const dataTypeCell = document.createElement("td");
    // Capitalize first letter of data type
    dataType = dataType.charAt(0).toUpperCase() + dataType.slice(1);
    //turn _ to space
    dataType = dataType.replace(/_/g, ' ');
    dataTypeCell.innerText = dataType;
    row.appendChild(dataTypeCell);
  }
  // Fade in the new row
  tableBody.appendChild(row);
  fadeIn(tableBody, 500);
}

async function fetchLastValues() {
  isLatest = true;
  await createTable();
  fetch('https://webapi19sa-1.course.tamk.cloud/v1/weather/limit/50')
    .then(response => response.json())
    .then(data => {
      tableBody.innerHTML = '';
      data.forEach(weather => {
        const dateTime = new Date(weather.date_time);
        const date = dateTime.toLocaleDateString();
        const time = dateTime.toLocaleTimeString();
        const weatherData = weather.data;

        let dataType;
        if (weatherData.rain !== undefined) {
          dataType = 'rain';
        } else if (weatherData.humidity_in !== undefined) {
          dataType = 'humidity_in';
        } else if (weatherData.humidity_out !== undefined) {
          dataType = 'humidity_out';
        } else if (weatherData.temperature !== undefined) {
          dataType = 'temperature';
        } else if (weatherData.wind_direction !== undefined) {
          dataType = 'wind_direction';
        } else if (weatherData.wind_speed !== undefined) {
          dataType = 'wind_speed';
        } else if (weatherData.light !== undefined) {
          dataType = 'light';
        }

        const value = weatherData[dataType];
        addDataToTable(date, time, value, dataType);
      });
      chartContainer.style.display = 'none';

    })
    .catch(error => console.error(error));
}

async function fetchTemperature() {
  isLatest = false;
  fetchValue("temperature");
}

async function fetchLight() {
  isLatest = false;
  fetchValue("light");

}

async function fetchValue(dataType) {
  const timeDropDownValue = timeDropDown.options[timeDropDown.selectedIndex].value;

  let fetchURL = `https://webapi19sa-1.course.tamk.cloud/v1/weather/${dataType}`;
  if (timeDropDownValue !== 'Now') {
    fetchURL += `/${timeDropDownValue}`;
  }
  createTable();
  fetch(fetchURL)
    .then(response => response.json())
    .then(data => {

      tableBody.innerHTML = '';
      data.forEach(weather => {
        const dateTime = new Date(weather.date_time);
        const date = dateTime.toLocaleDateString();
        const time = dateTime.toLocaleTimeString();
        const value = weather[dataType];
        addDataToTable(date, time, value);
      });
      createChart(data, dataType);
      calculations(data, dataType);
    }
    )
    .catch(error => console.error(error));
}

async function createChart(data, dataType) {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.style.display = 'flex';

  const canvas = document.getElementById('myChart');
  if (!canvas.chart) {
    const ctx = canvas.getContext('2d');
    const chartLabel = dataType.charAt(0).toUpperCase() + dataType.slice(1);
    const chartData = {
      labels: data.map(data => {
        const dateTime = new Date(data.date_time);
        const time = dateTime.toLocaleTimeString();
        return time;
      }),
      datasets: [{
        label: chartLabel,
        data: data.map(data => data[dataType]),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
    canvas.chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  } else {
    const chartLabel = dataType.charAt(0).toUpperCase() + dataType.slice(1);
    const chartData = {
      labels: data.map(data => {
        const dateTime = new Date(data.date_time);
        const time = dateTime.toLocaleTimeString();
        return time;
      }),
      datasets: [{
        label: chartLabel,
        data: data.map(data => data[dataType]),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
    canvas.chart.data = chartData;
    canvas.chart.update();
  }
}

async function fetchDropdown() {
  const valueDropDownValue = valueDropDown.options[valueDropDown.selectedIndex].value;
  fetchValue(valueDropDownValue);
}

async function calculations(data, dataType) {
  //fade calculationsbox out
  await fadeOut(calculationsDiv, 200)

  // mean
  const allValues = data.map(function (value) {
    return parseFloat(value[dataType]);
  });

  let count = 0;
  let sum = 0;
  for (let i = 0; i < allValues.length; i++) {
    if (!isNaN(allValues[i])) {
      count = count + 1;
      sum = sum + allValues[i];
    }
  }
  let meanValue = sum / count;
  mean.innerHTML = "Mean: " + meanValue.toFixed(2);

  // median
  let sortedValues = allValues.sort(function (a, b) {
    return a - b;
  });
  let medianValue = 0;
  if (count % 2 === 0) {
    let half = count / 2;
    medianValue = (sortedValues[half - 1] + sortedValues[half]) / 2;
  } else {
    let half = Math.floor(count / 2);
    medianValue = sortedValues[half];
  }
  median.innerHTML = "Median: " + medianValue.toFixed(2);

  // mode
  let modeValue = 0;
  let maxCount = 0;
  for (let i = 0; i < allValues.length; i++) {
    let count = 0;
    for (let j = 0; j < allValues.length; j++) {
      if (allValues[j] === allValues[i]) {
        count++;
      }
    }
    if (count > maxCount) {
      modeValue = allValues[i];
      maxCount = count;
    }
  }
  mode.innerHTML = "Mode: " + modeValue.toFixed(2);

  // range
  let sortedAllValues = allValues.sort(function (a, b) {
    return a - b;
  });
  let minValue = sortedAllValues[0];
  let maxValue = sortedAllValues[sortedAllValues.length - 1];
  let rangeValue = maxValue - minValue;
  range.innerHTML = "Range: " + rangeValue.toFixed(2);

  // standard deviation
  let deviationSum = 0;
  for (let i = 0; i < allValues.length; i++) {
    deviationSum = deviationSum + Math.pow((allValues[i] - meanValue), 2);
  }
  let variance = deviationSum / count;
  let standardDeviationValue = Math.sqrt(variance);
  standardDeviation.innerHTML = "Standard Deviation: " + standardDeviationValue.toFixed(2);

  // fade calculationsbox in
  await fadeIn(calculationsDiv, 200)
}


// Fade out function
function fadeOut(element, duration) {
  return new Promise(resolve => {
    element.style.opacity = 1;

    let start = null;

    function step(timestamp) {
      if (!start) {
        start = timestamp;
      }

      const progress = timestamp - start;
      element.style.opacity = 1 - Math.min(progress / duration, 1);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    window.requestAnimationFrame(step);
  });
}

// Fade in function
function fadeIn(element, duration) {
  return new Promise(resolve => {
    element.style.opacity = 0;

    let start = null;

    function step(timestamp) {
      if (!start) {
        start = timestamp;
      }

      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    window.requestAnimationFrame(step);
  });
}