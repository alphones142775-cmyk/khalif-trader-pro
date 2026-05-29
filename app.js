const APP_ID = "33p7PVqGTbhzPMv1GNtXr";
const TOKEN = "pat_df0cbb0150b40589d016c49888fea3098f54ef3d5dde910f8e0ac4ef9f9fb0f5";
const ACCOUNT_ID = "019e4f44-45be-78e1-a2a7-808ded270fdd";

const connectBtn =
  document.getElementById("connectBtn");

const statusDiv =
  document.getElementById("status");

const messagesDiv =
  document.getElementById("messages");

connectBtn.addEventListener("click", async () => {

  try {

    statusDiv.innerHTML =
      "Requesting OTP...";

    // STEP 1: GET OTP URL
    const response = await fetch(
      `https://api.derivws.com/trading/v1/options/accounts/${ACCOUNT_ID}/otp`,
      {
        method: "POST",

        headers: {
          "Deriv-App-ID": 33p7PVqGTbhzPMv1GNtXr,
          "Authorization":
            `Bearer ${pat_df0cbb0150b40589d016c49888fea3098f54ef3d5dde910f8e0ac4ef9f9fb0f5}`
        }
      }
    );

    const result = await response.json();

    console.log(result);

    // WebSocket URL from Deriv
    const wsUrl = result.data.url;

    statusDiv.innerHTML =
      "Connecting WebSocket...";

    // STEP 2: CONNECT WEBSOCKET
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {

      statusDiv.innerHTML =
        "Connected to Deriv WebSocket";

      console.log("Connected");
    };

    ws.onmessage = (event) => {

      const message =
        JSON.parse(event.data);

      console.log(message);

      messagesDiv.innerHTML += `
        <p>${event.data}</p>
      `;
    };

    ws.onerror = (error) => {

      console.error(error);

      statusDiv.innerHTML =
        "WebSocket Error";
    };

    ws.onclose = () => {

      statusDiv.innerHTML =
        "Disconnected";
    };

  } catch (error) {

    console.error(error);

    statusDiv.innerHTML =
      "Connection Failed";
  }

});
