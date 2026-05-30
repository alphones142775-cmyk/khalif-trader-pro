// ======================================
// TRADESPARKSITE.PRO DERIV CONNECTION
// ======================================

// APP CONFIG

const APP_ID = "33p7PVqGTbhzPMv1GNtXr";

const REDIRECT_URL =
"https://alphones142775-cmyk.github.io/Trading-platform/";

// ======================================
// LOADING SCREEN
// ======================================

window.addEventListener("load", () => {

    setTimeout(() => {

        document.getElementById("loader").style.display = "none";
        document.getElementById("app").style.display = "block";

    }, 3000);

});

// ======================================
// LIVE CLOCK
// ======================================

setInterval(() => {

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString();

}, 1000);

// ======================================
// DERIV LOGIN BUTTON
// ======================================

document
.getElementById("loginBtn")
.addEventListener("click", () => {

    const authUrl =
        `https://oauth.deriv.com/oauth2/authorize?app_id=${APP_ID}&l=EN`;

    window.location.href = authUrl;

});

// ======================================
// READ TOKEN FROM URL
// ======================================

function getQueryParam(name) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(name);

}

const token =
    getQueryParam("token");

if (token) {

    localStorage.setItem(
        "deriv_token",
        token
    );

}

// ======================================
// CONNECT TO DERIV
// ======================================

const ws = new WebSocket(
    `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`
);

ws.onopen = () => {

    console.log(
        "Connected To Deriv"
    );

    const savedToken =
        localStorage.getItem(
            "deriv_token"
        );

    if (savedToken) {

        ws.send(
            JSON.stringify({

                authorize:
                savedToken

            })
        );

    }

};

// ======================================
// HANDLE DERIV RESPONSES
// ======================================

ws.onmessage = (msg) => {

    const data =
        JSON.parse(msg.data);

    console.log(data);

    // ACCOUNT LOGIN SUCCESS

    if (
        data.msg_type ===
        "authorize"
    ) {

        console.log(
            "Authorized"
        );

        // BALANCE

        if (
            document.getElementById(
                "balance"
            )
        ) {

            document.getElementById(
                "balance"
            ).innerHTML =
            "$" +
            data.authorize.balance;

        }

        // START LIVE MARKET STREAM

        ws.send(
            JSON.stringify({

                ticks: "R_100",

                subscribe: 1

            })
        );

    }

    // LIVE TICKS

    if (
        data.msg_type ===
        "tick"
    ) {

        console.log(
            "LIVE PRICE:",
            data.tick.quote
        );

    }

};

// ======================================
// WEBSOCKET ERRORS
// ======================================

ws.onerror = (err) => {

    console.error(
        "Deriv Error",
        err
    );

};

// ======================================
// CONNECTION CLOSED
// ======================================

ws.onclose = () => {

    console.log(
        "Deriv Connection Closed"
    );

};

// ======================================
// TRADINGVIEW CHART
// ======================================

new TradingView.widget({

    container_id: "tvchart",

    autosize: true,

    symbol: "FX:EURUSD",

    interval: "1",

    timezone: "Etc/UTC",

    theme: "dark",

    style: "1",

    locale: "en",

    toolbar_bg: "#131722",

    enable_publishing: false,

    allow_symbol_change: true

});
