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

// Utility to fetch paginated objects
async function fetchObjects(objectType, limit = 20, after) {
  const params = { limit };
  if (after) params.after = after;

  // Set properties to fetch for each object type
  const propsMap = {
    contacts: ['firstname', 'lastname', 'email'],
    companies: ['name', 'industry', 'website'],
    deals: ['dealname', 'amount', 'dealstage'],
  };
  params.properties = propsMap[objectType]?.join(',') || '';

  const response = await hubspot.get(`/${objectType}`, { params });
  return response.data;
}

app.get('/api/:objectType', async (req, res) => {
  const { objectType } = req.params;
  const { limit = 20, after } = req.query;

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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
