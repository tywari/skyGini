# 📊 ACV Dashboard Application

A full-stack dashboard to visualize Annual Contract Value (ACV) data by **Customer Type**, **Quarter**, **Industry**, and more using charts and tables.

> Built with **React + Material UI + D3.js** for frontend  
> Powered by **Node.js + Express + TypeScript** for backend APIs

---

## 📁 Project Structure

```
acv-dashboard/
├── backend/        # Express API with mock JSON data
├── frontend/       # React application with visualizations
```

---

## ⚙️ Backend Setup

### 📍 Location
`/backend`

### 🧰 Tech Stack

- Node.js
- Express.js
- TypeScript
- CORS
- File-based mock JSON API

### 🚀 Getting Started

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

> ✅ Server runs on `http://localhost:3001`

### 📡 API Endpoints

| Endpoint                    | Description                  |
|-----------------------------|------------------------------|
| `/api/customer-type`        | ACV data by customer type    |
| `/api/account-industry`     | ACV data by industry         |
| `/api/team`                 | ACV data by team             |
| `/api/acv-range`            | ACV range-based summary      |

The backend reads local JSON files from the `data/` folder and serves them as API responses.

---

## 🎨 Frontend Setup

### 📍 Location
`/frontend`

### 🧰 Tech Stack

- React 18
- TypeScript
- Material UI (MUI)
- D3.js
- Axios

### 🚀 Getting Started

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

> ✅ App runs on `http://localhost:3000`

> Ensure the backend is running on `http://localhost:3001` to avoid CORS or API errors.

---

## 📈 Features

### Visualizations

- **📊 Stacked Bar Chart**  
  ACV won per quarter grouped by customer type (Existing/New)

- **🍩 Doughnut Chart**  
  Percentage share of ACV by customer type

- **📋 Tabular Summary**  
  Detailed table with quarterly breakdown: `# of Opps`, `ACV`, `% of Total`

### Data & Logic

- Dynamic API fetch using Axios
- Chart rendering via D3.js
- Material UI components for layout and styling
- Clean and responsive layout
- Centralized transformation logic to reshape raw API data for frontend

---

## 🧪 Example

You can view sample charts and tables like:

```
| Cust Type         | 2023-Q3       | 2023-Q4       | ... | Total        |
|------------------|---------------|---------------|-----|--------------|
| Existing Customer| 46 / $1.3M / 57%| ...           |     | 165 / $4.5M / 70% |
| New Customer     | 14 / $0.9M / 43%| ...           |     | ...          |
```

---

## 🛠 Tips

- If using different ports, update API URLs in `Dashboard.tsx`
- If CORS errors occur, make sure backend uses `app.use(cors())`
- You can format and extend ACV data to support more breakdowns (e.g., by team or industry)

---

## 🧹 Recommended `.gitignore`

For both `frontend/` and `backend/`, include:

```
node_modules/
dist/
.env
```

---



## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

- [Material UI](https://mui.com/)
- [D3.js](https://d3js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Create React App](https://create-react-app.dev/)
