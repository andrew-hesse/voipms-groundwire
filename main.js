"use strict";
const axios = require("axios");
const express = require("express");

const app = express();

const getBalance = (api_username, api_password) => {
  const method = "getBalance";
  const voipMsApiUrl = `https://voip.ms/api/v1/rest.php?content_type=json&api_username=${api_username}&api_password=${api_password}&method=${method}`;
  return new Promise((resolve, reject) => {
    axios
      .get(voipMsApiUrl)
      .then(function (response) {
        try {
          const {
            status,
            balance: { current_balance: balance },
          } = response.data;
          if (status === "success") {
            const balanceParsed = parseFloat(balance).toFixed(2);
            resolve(balanceParsed);
          } else {
            console.log("Can't get balance!");
          }
        } catch (err) {
          const errorMessage = err;
          console.log(`Error = ${response.data}`);
          reject(err);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    // .finally(function () {
    //   // always executed
    // });
  });
};

app.get("/", async function (req, res, next) {
  const userAgent = req.header("user-agent");

  // Adding additional security for Groundwire app only
  if (userAgent.includes("Groundwire/")) {
    // Defining variables
    const currency = process.env.CURRENCY;
    const api_username = encodeURIComponent(process.env.USERNAME);
    const api_password = process.env.PASSWORD;

    // Requesting balance
    const balance = await getBalance(api_username, api_password);

    // Building JSON for Groundwire
    const objBalance = {
      balanceString: currency + " " + balance,
      balance: balance,
      currency,
    };

    // Outputing request to Docker logs and sending it back
    console.log(userAgent);
    res.json(objBalance);
  } else {
    // If not Groundwire - send 404
    res.status(404).end();
  }
});

app.listen("3000", "0.0.0.0");
