#!/usr/bin/env node
"use strict";

const http = require("http");
const https = require("https");

module.exports.get = get;
module.exports.TIMEOUT_GET = 100;
module.exports.TIMEOUT = 5000;
module.exports.secure = false;

function get(options, errorStr, callbackError, callback) {
  options.timeout = module.exports.TIMEOUT;
  setTimeout(() => {
    console.log(`get: ${errorStr}`);
    try {
      var get = (module.exports.secure ? https : http)
        .get(options, (res) => {
          if (res.statusCode != 200) {
            console.log(`error: ${res.statusCode} start: ${errorStr}`);
            res.resume();

            return callbackError(res.statusCode);
          }

          res.setEncoding("utf8");
          let rawData = "";
          res
            .on("data", (chunk) => {
              rawData += chunk;
            })
            .on("end", () => {
              console.log(`end: ${errorStr}`);

              try {
                var body = JSON.parse(rawData);
              } catch (error) {
                console.log(`error: ${rawData} raw: ${errorStr}`);
                return callbackError();
              }
              callback(body);
            });
        })
        .on("error", (e) => {
          console.log(`error: ${e.code} req: ${errorStr}`);

          get.destroy();
          callbackError();
        })
        .on("timeout", () => {
          console.log(`timeout: ${errorStr}`);
          get.destroy();
        })
        .setTimeout(module.exports.TIMEOUT);
    } catch (e) {
      console.log(`error: ${e.code} try: ${errorStr}`);
      return callbackError();
    }
  }, module.exports.TIMEOUT_GET);
}
