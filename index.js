#!/usr/bin/env node
"use strict";

const http = require("http");
const https = require("https");

module.exports.get = get;
module.exports.request = request;
module.exports.TIMEOUT_REQUEST = 100;
module.exports.TIMEOUT = 5000;
module.exports.secure = false;

function get(options, errorStr, callbackError, callback) {
  options.timeout = module.exports.TIMEOUT;
  setTimeout(() => {
    console.log(`get: ${errorStr}`);
    var end = false;
    try {
      var get = (module.exports.secure ? https : http)
        .get(options, (res) => {
          if (res.statusCode != 200) {
            console.log(`error: ${res.statusCode} start: ${errorStr}`);

            if (end) return;
            end = true;

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

              if (end) return;
              end = true;

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

          if (end) return;
          end = true;

          get.destroy();
          callbackError();
        })
        .on("timeout", () => {
          console.log(`timeout: ${errorStr}`);

          if (end) return;
          end = true;

          get.destroy();
          callbackError();
        })
        .setTimeout(module.exports.TIMEOUT);
    } catch (e) {
      console.log(`error: ${e.code} try: ${errorStr}`);

      if (end) return;
      end = true;

      return callbackError();
    }
  }, module.exports.TIMEOUT_REQUEST);
}

function request(options, postData, errorStr, callbackError, callback) {
  options.timeout = module.exports.TIMEOUT;
  if (options.headers == null) {
    options.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    };
  } else {
    if (options.headers["Content-Type"] == null)
      options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    options.headers["Content-Length"] = Buffer.byteLength(postData);
  }
  setTimeout(() => {
    console.log(`request: ${errorStr}`);
    var end = false;
    try {
      var request = (module.exports.secure ? https : http)
        .request(options, (res) => {
          if (res.statusCode != 200) {
            console.log(`error: ${res.statusCode} start: ${errorStr}`);

            if (end) return;
            end = true;

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

              if (end) return;
              end = true;

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

          if (end) return;
          end = true;

          request.destroy();
          callbackError();
        })
        .on("timeout", () => {
          console.log(`timeout: ${errorStr}`);

          if (end) return;
          end = true;

          request.destroy();
          callbackError();
        })
        .setTimeout(module.exports.TIMEOUT);

      if (postData != null) request.write(postData);
      request.end();
    } catch (e) {
      console.log(`error: ${e.code} try: ${errorStr}`);

      if (end) return;
      end = true;

      return callbackError();
    }
  }, module.exports.TIMEOUT_REQUEST);
}
