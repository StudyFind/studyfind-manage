// `functions/src/switch-func.js`

const { logger } = require("firebase-functions");

// import the switch list of cloud functions
const funcs = require("./utils/switch-list");

// Take the request url, figure out which 'subfunction' user is trying to hit,
// and pas the req, res on to it. Expect query like: `/studies/<targetFunc>`
module.exports = (ctx) => {
  // init all funcs
  Object.keys(funcs).forEach((name) => {
    funcs[name] = funcs[name](ctx);
  });

  return async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");

    const path = new URL("http://ha-fake-server.com" + req.url).pathname.split("/");
    const name = path[1];

    if (name === "") return res.json({ error: `please specify a function to call` });
    if (!funcs[name]) return res.json({ error: `function '${name}' does not exist` });

    logger.info(`running function '${name}' from`, req.url);

    // fix up req to make it appear as if switch function didn't exist
    req.url = req.url.substring(`/${name}`.length);
    if (!req.url.startsWith("/")) req.url = "/" + req.url;

    return funcs[name](req, res);
  };
};
