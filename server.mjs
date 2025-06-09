import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const HUBSPOT_TOKEN = process.env.HUBSPOT_API_TOKEN;
const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com/crm/v3/objects',
  headers: {
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
  },
});

// Utility to fetch paginated objects sorted by createdate DESC using Search API
async function fetchObjects(objectType, limit = 100, after) {
  // properties to fetch per object type
  const propsMap = {
    contacts: ['firstname', 'lastname', 'email', 'country', 'phone', 'jobtitle', 'company', 'industry', 'createdate'],
    companies: ['name', 'industry', 'website', 'phone', 'address', 'city', 'state', 'zip', 'country', 'createdate'],
    deals: ['dealname', 'amount', 'dealstage', 'closedate', 'createdate', 'pipeline', 'hs_lastmodifieddate'],
  };

  const properties = propsMap[objectType] || [];

  const body = {
    limit,
    sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
    properties,
  };

  if (after) {
    body.after = after;
  }

  // Use POST /search endpoint to support sorting
  const response = await hubspot.post(`/${objectType}/search`, body);
  return response.data;
}

app.get('/api/:objectType', async (req, res) => {
  const { objectType } = req.params;
  const { limit = 100, after } = req.query;

  if (!['contacts', 'companies', 'deals'].includes(objectType)) {
    return res.status(400).json({ error: 'Invalid object type' });
  }

  try {
    const data = await fetchObjects(objectType, Number(limit), after);
    res.json(data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Endpoint to create new objects
app.post('/api/:objectType', async (req, res) => {
  const { objectType } = req.params;
  const data = req.body;

  if (!['contacts', 'companies', 'deals'].includes(objectType)) {
    return res.status(400).json({ error: 'Invalid object type' });
  }

  try {
    const response = await hubspot.post(`/${objectType}`, { properties: data });
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create object' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
