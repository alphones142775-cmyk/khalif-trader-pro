let ws;
let apiToken = "pat_df0cbb0150b40589d016c49888fea3098f54ef3d5dde910f8e0ac4ef9f9fb0f5";

function log(msg) {
  document.getElementById("log").innerHTML += `<p>${msg}</p>`;
}

// CONNECT TO DERIV
function connect() {
  apiToken = document.getElementById("33p7PVqGTbhzPMv1GNtXr").value;

  ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=33p7PVqGTbhzPMv1GNtXr");

  ws.onopen = () => {
    document.getElementById("status").innerText = "Connected";
    log("Connected to Deriv");

    ws.send(JSON.stringify({
      authorize:https://alphones142775-cmyk.github.io/Trading-platform/   }));

    ws.send(JSON.stringify({
      balance: 1
    }));

    ws.send(JSON.stringify({
      ticks: "R_100"
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    // AUTH
    if (data.msg_type === "authorize") {
      log("pat_df0cbb0150b40589d016c49888fea3098f54ef3d5dde910f8e0ac4ef9f9fb0f5");
    }

    // BALANCE
    if (data.msg_type === "balance") {
      document.getElementById("balance").innerText = data.balance.balance;
    }

    // TICK DATA
    if (data.msg_type === "tick") {
      document.getElementById("tick").innerText = data.tick.quote;
    }

    log(JSON.stringify(data));
  };

  ws.onerror = () => {
    document.getElementById("status").innerText = "Error";
  };
}

// BUY CALL
function buy() {
  const amount = document.getElementById("amount").value;
  const symbol = document.getElementById("symbol").value;

  ws.send(JSON.stringify({
    buy: 1,
    price: amount,
    parameters: {
      amount: amount,
      basis: "stake",
      contract_type: "CALL",
      currency: "USD",
      duration: 5,
      duration_unit: "m",
      symbol: symbol
    }
  }));

  log("BUY CALL placed");
}

// BUY PUT
function sell() {
  const amount = document.getElementById("amount").value;
  const symbol = document.getElementById("symbol").value;

  ws.send(JSON.stringify({
    buy: 1,
    price: amount,
    parameters: {
      amount: amount,
      basis: "stake",
      contract_type: "PUT",
      currency: "USD",
      duration: 5,
      duration_unit: "m",
      symbol: symbol
    }
  }));

  log("BUY PUT placed");
}
