const authPage = document.getElementById("authPage");
const dashboardPage = document.getElementById("dashboardPage");

function showLogin(){
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
}

function showSignup(){
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
}

function openDashboard(){

  authPage.style.display = "none";
  dashboardPage.style.display = "block";

  initializeChart();
  connectDeriv();
}


let chart;
let candleSeries;

function initializeChart(){

  chart = LightweightCharts.createChart(
    document.getElementById("chart-container"),
    {
      layout: {
        background: { color: '#111827' },
        textColor: '#DDD'
      },

      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' }
      },

      width: document.getElementById("chart-container").clientWidth,
      height: document.getElementById("chart-container").clientHeight
    }
  );

  candleSeries = chart.addCandlestickSeries();
}


function connectDeriv(){

  const app_id = "YOUR_APP_ID";

  const connection = new WebSocket(
    `wss://ws.derivws.com/websockets/v3?app_id=${app_id}`
  );


  connection.onopen = () => {

    connection.send(JSON.stringify({
      ticks: "R_100"
    }));

  };


  let lastPrice = null;
  let time = Math.floor(Date.now() / 1000);


  connection.onmessage = (event) => {

    const data = JSON.parse(event.data);

    if(data.tick){

      const price = parseFloat(data.tick.quote);

      document.getElementById("balance").innerText = "$10,000";

      if(lastPrice === null){
        lastPrice = price;
      }

      candleSeries.update({
        time: time++,
        open: lastPrice,
        high: Math.max(lastPrice, price),
        low: Math.min(lastPrice, price),
        close: price
      });

      lastPrice = price;
    }
  };
}
