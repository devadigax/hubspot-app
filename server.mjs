import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Dynamic axios client
function hsClient(token) {
  return axios.create({
    baseURL: "https://api.hubapi.com/crm/v3/objects",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Token extractor
function getToken(req) {
  const token = req.headers["x-hubspot-token"];
  if (!token) throw new Error("Missing HubSpot Token");
  return token;
}

// Property config maps
const propsMap = {
  deals: [
    "dealname",
    "amount",
    "dealstage",
    "closedate",
    "createdate",
    "pipeline",
    "hs_lastmodifieddate",
  ],
  companies: [
    "name",
    "industry",
    "website",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "country",
    "createdate",
  ],
  contacts: ["firstname", "lastname", "email", "phone", "company"],
  line_items: ["name", "quantity", "price", "hs_product_id", "createdate", "deal_id"],
};

// ---------------------- GET COMPANY ----------------------
app.get("/api/companies/:id", async (req, res) => {
  try {
    const token = getToken(req);
    const hubspot = hsClient(token);

    const response = await hubspot.get(`/companies/${req.params.id}`, {
      params: { properties: propsMap.companies.join(",") },
    });

    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- GET LINE ITEM ----------------------
app.get("/api/line_items/:id", async (req, res) => {
  try {
    const token = getToken(req);
    const hubspot = hsClient(token);

    const response = await hubspot.get(`/line_items/${req.params.id}`, {
      params: { properties: propsMap.line_items.join(",") },
    });

    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- SEARCH LINE ITEMS BY DEAL_ID ----------------------
app.get("/api/line_items/by-deal/:dealId", async (req, res) => {
  const { dealId } = req.params;

  try {
    const token = getToken(req);
    const hubspot = hsClient(token);

    // 1) search by deal_id custom property
    const searchRes = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/line_items/search",
      {
        filterGroups: [
          {
            filters: [{ propertyName: "deal_id", operator: "EQ", value: dealId }],
          },
        ],
        properties: propsMap.line_items,
        limit: 100,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const lineItems = searchRes.data.results || [];
    const results = [];

    // 2) association check
    for (const item of lineItems) {
      let isAssociated = false;

      try {
        const assoc = await hubspot.get(`/line_items/${item.id}/associations/deals`);
        const associatedDeals = assoc.data.results.map((r) => r.id);
        isAssociated = associatedDeals.includes(dealId);
      } catch (e) {}

      results.push({ ...item, isAssociated });
    }

    res.json({ lineItems: results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
