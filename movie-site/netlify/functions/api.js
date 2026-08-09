import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonRes(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const siteID = context?.site?.id || "34a1a613-39bc-4caa-8455-c2ed78fdb51a";
  const store = getStore("captures", { siteID });

  if (req.method === "DELETE") {
    await store.delete("events");
    return jsonRes({ status: "cleared" });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.type === "clear") {
        await store.delete("events");
        return jsonRes({ status: "cleared" });
      }
      const raw = await store.get("events");
      let events = raw ? JSON.parse(raw) : [];
      events.unshift({
        ts: new Date().toISOString(),
        ...body,
      });
      if (events.length > 500) events = events.slice(0, 500);
      await store.set("events", JSON.stringify(events));
      return jsonRes({ status: "ok", count: events.length });
    } catch (e) {
      return jsonRes({ error: e.message }, 500);
    }
  }

  if (req.method === "GET") {
    const raw = await store.get("events");
    const events = raw ? JSON.parse(raw) : [];
    return jsonRes({ events, count: events.length });
  }

  return jsonRes({ error: "method not allowed" }, 405);
};