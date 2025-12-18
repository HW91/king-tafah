// worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/fragrances") {
      return handleFragranceRequest(env);
    }

    return new Response("Not Found", { status: 404 });
  }
};

async function handleFragranceRequest(env) {
  const FRAGELLA_API_URL = "https://api.fragella.com/v1/fragrances"; // placeholder
  const FRAGELLA_API_KEY = env.FRAGELLA_API_KEY; // real key goes here later

  const res = await fetch(FRAGELLA_API_URL, {
    headers: {
      Authorization: `Bearer ${FRAGELLA_API_KEY}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    return new Response("Upstream API error", { status: 502 });
  }

  const data = await res.json();

  return new Response(JSON.stringify(normalizeFragrances(data)), {
    headers: { "Content-Type": "application/json" }
  });
}

function normalizeFragrances(data) {
  return data.map(f => ({
    id: f.id,
    name: f.name,
    brand: f.brand,
    notes: f.notes,
    season: f.best_season,
    situations: f.recommended_use,
    longevity: f.longevity_score,
    projection: f.projection_score,
    price: f.price,
    isDupe: f.is_dupe,
    originalId: f.original_id || null
  }));
}
