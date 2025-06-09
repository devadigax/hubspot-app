# HubSpot CRM Viewer

A simple full-stack React + Node.js app to view HubSpot CRM **Contacts**, **Companies**, and **Deals** with pagination and details.

---

## Features

- Tabs to switch between Contacts, Companies, and Deals
- List view with paginated HubSpot CRM data
- Click on an item to see detailed properties
- Backend proxy to securely fetch data from HubSpot API using Private App token

---

## Project Structure

hubspot-app/  
├── backend/  
│   ├── server.js           # Express backend server  
│   └── .env                # Environment variables (HubSpot token)  
├── src/  
│   ├── App.jsx             # Main React component  
│   ├── components/  
│   │   ├── ObjectList.jsx  
│   │   └── ObjectDetail.jsx  
│   └── ...  
├── vite.config.js          # Vite config with proxy to backend  
├── package.json  
└── README.md  

---

## Getting Started

### 1. HubSpot Private App Token

Create a [HubSpot Private App](https://developers.hubspot.com/docs/api/private-apps) and generate a token with **CRM Objects Read** permissions.

---

### 2. Setup Backend

- Create a `.env` file inside `backend/` folder with:

```env
HUBSPOT_API_TOKEN=your_hubspot_private_app_token_here
PORT=3001
```

####  Install backend dependencies and start server:

```
cd backend
npm install express cors dotenv axios
node server.js
```
The backend runs on http://localhost:3001

### 3. Setup Frontend

From root folder:
```
npm install
npm run dev
```

The frontend runs on http://localhost:3000 and proxies API requests to backend.

###  4. Use the App
Open http://localhost:3000

Click on Contacts, Companies, or Deals tabs

Browse paginated lists

Click an item to view its details

## Scripts

```json
"scripts": {
  "backend": "node backend/server.js",
  "dev": "vite",
  "start": "concurrently \"npm run backend\" \"npm run dev\""
}
```

Run both backend and frontend simultaneously with:

```
npm run start
```
## Dependencies
Backend: Express, Axios, dotenv, CORS

Frontend: React, Vite

##  Notes
HubSpot API uses cursor-based pagination with after tokens.

Pagination currently supports only the Next Page button.

You can extend the app by adding Previous Page support or authentication if needed.

### License
MIT © Devadigax