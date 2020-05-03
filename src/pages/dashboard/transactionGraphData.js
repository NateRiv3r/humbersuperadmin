export const DATA = {
  labels: [
    "20 Jan - 20 Feb",
    "21 Feb - 20 Mar",
    "21 Mar - 20 Apr",
    "21 Apr - 20 May",
    "21 May - 20 Jun",
    "21 Jun - 20 Jul",
    "20 Jul - 21 Aug"
  ],
  datasets: [
    {
      label: "GamePlays",
      data: [20000, 15000, 21000, 20500, 22220, 30000, 10000],
      fill: false,
      borderColor: "#EB008A"
    },
    {
      label: "Winnings",
      data: [15, 2, 6, 31, 62, 2, 30],
      fill: false,
      borderColor: "#0094D8"
    }
  ]
};

export const OPTIONS = {
  responsive: true,
  maintainApsectRatio: false,
  legend: {
    display: true,
    position: "bottom"
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ]
  }
};

export const DATA2 = {
  labels: [
    "20 Jan - 20 Feb",
    "21 Feb - 20 Mar",
    "21 Mar - 20 Apr",
    "21 Apr - 20 May",
    "21 May - 20 Jun",
    "21 Jun - 20 Jul",
    "20 Jul - 21 Aug"
  ],
  datasets: [
    {
      label: "Revenue Income",
      data: [200000, 210000, 310000, 210500, 250000, 270500, 280000],
      fill: false,
      borderColor: "#EB008A"
    },
    {
      label: "Expenses",
      data: [5000, 65000, 5100, 8000, 15000, 7000, 155000],
      fill: false,
      borderColor: "#0094D8"
    }
  ]
};

export const OPTIONS2 = {
  responsive: true,
  maintainApsectRatio: false,
  legend: {
    display: true,
    position: "bottom"
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ]
  }
};
