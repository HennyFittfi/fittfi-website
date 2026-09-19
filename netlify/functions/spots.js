const { getStore } = require("@netlify/blobs");

const TOTAL_SPOTS = 100;

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  try {
    const store = getStore("fittfi-founding");

    if (event.httpMethod === "GET") {
      const usedRaw = await store.get("used");
      const used = parseInt(usedRaw, 10) || 0;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ remaining: Math.max(0, TOTAL_SPOTS - used) })
      };
    }

    if (event.httpMethod === "POST") {
      const usedRaw = await store.get("used");
      const used = (parseInt(usedRaw, 10) || 0) + 1;
      await store.set("used", String(used));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ remaining: Math.max(0, TOTAL_SPOTS - used) })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err) {
    console.error("spots function error:", err && err.stack ? err.stack : err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Something went wrong", detail: String(err && err.message || err) }) };
  }
};
