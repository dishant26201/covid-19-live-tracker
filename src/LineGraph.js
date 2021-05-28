import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType, urlCondition) => {
  let chartData = [];
  let lastDataPoint;
  if (
    data.message === "Country not found or doesn't have any historical data"
  ) {
    urlCondition = "all";
  }

  if (urlCondition === "all") {
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
  } else if (urlCondition !== "all") {
    for (let date in data.timeline.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data.timeline[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data.timeline[casesType][date];
    }
  }
  return chartData;
};

function LineGraph({ casesType, className, urlCondition }) {
  let color = "";
  let borderColor = "";
  if (casesType === "cases") {
    color = "rgba(204, 16, 52, 0.5)";
    borderColor = "#CC1034";
  } else if (casesType === "recovered") {
    color = "rgba(177, 255, 153, 0.5)";
    borderColor = "#40ff00";
  } else if (casesType === "deaths") {
    color = "rgba(252, 131, 131, 0.5)";
    borderColor = "#fa3838";
  }
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `https://disease.sh/v3/covid-19/historical/${urlCondition}?lastdays=120`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType, urlCondition);
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType, urlCondition]);

  return (
    <div className={className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: color,
                borderColor: borderColor,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
