# Research Paper Management System

A production-ready MERN Stack application featuring complete CRUD operations, server-side search, filtering, sorting, pagination, and a 1:1 pixel-accurate responsive user interface matching the reference design specifications.

## 🌟 Live Demo & Deployment

- **GitHub Repository**: [https://github.com/aravindbala03112003/CRUD-OPERATIONS](https://github.com/aravindbala03112003/CRUD-OPERATIONS)
- **Deployment Platform**: Vercel (Frontend & Serverless Express Backend)
- **Database**: MongoDB Atlas

---

## 🚀 Key Features

1. **Complete CRUD Operations**:
   - **Create**: Add new research papers with custom business `paperId` (e.g., `P-105`), title, author, publication date, and price.
   - **Read All**: Retrieve paginated papers with server-side filtering, searching, and sorting.
   - **Read by ID**: Retrieve individual paper details by MongoDB `_id` or business `paperId`.
   - **Update**: Edit existing paper details with pre-populated form fields and read-only `paperId`.
   - **Delete**: Remove records with an accessible confirmation modal dialog.

2. **1:1 Screenshot-Matched UI/UX**:
   - **Dark Navy Header**: Deep navy background (`#0b1120`) with bold white title and right-aligned pill navigation buttons (`View All` in cyan blue, `Create` in purple-indigo).
   - **Ambient Molecular Artwork**: Custom scientific geometric node background recreating the abstract molecular backdrop.
   - **Translucent Glassmorphism Cards**: Pale cyan-blue panels with frosted blur (`backdrop-filter: blur(20px)`), subtle borders, and soft shadows.
   - **Indian Rupee Formatting**: Prices formatted with the `₹` currency symbol (e.g., `₹20000.00`).
   - **Interactive Pagination**: Rounded glass bar with previous/next controls, page counter, item counter, and custom page size dropdown (`5/page`, `10/page`, `20/page`, `50/page`) with active blue highlight.
   - **Modal Dialog**: Accessible centered delete confirmation modal with dimmed backdrop and keyboard support (Esc).

3. **Server-Side Operations**:
   - **Search**: Debounced multi-field regex search across `paperId`, `title`, and `author`.
   - **Sorting**: Allowlisted sorting by `publicationDate`, `paperId`, `title`, `author`, or `price` in ascending or descending order. Default is `publicationDate` descending.
   - **Pagination**: Server-side pagination with configurable limits.
   - **Resilience**: Dual-mode storage adapter that seamlessly connects to MongoDB Atlas when `MONGODB_URI` is present, while providing an offline fallback preloaded with 52 realistic papers.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Lucide React, Vite, Vanilla CSS Design System.
- **Backend**: Node.js, Express.js (configured for both standalone server and Vercel Serverless Functions).
- **Database**: MongoDB Atlas with Mongoose ODM (unique indexes, schema validation).
- **Testing**: Node.js Test Runner, Supertest (22 passing automated tests).
- **Deployment**: Vercel with serverless rewrites and SPA fallback routing.

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & database connection status |
| `GET` | `/api/papers` | Paginated list with search, filter, and sorting |
| `GET` | `/api/papers/:id` | Retrieve single paper by MongoDB `_id` |
| `GET` | `/api/papers/by-paper-id/:paperId` | Retrieve single paper by business `paperId` |
| `POST` | `/api/papers` | Create a new research paper |
| `PUT` | `/api/papers/:id` | Update an existing paper by MongoDB `_id` |
| `DELETE` | `/api/papers/:id` | Delete a paper by MongoDB `_id` |

### Query Parameters for `GET /api/papers`

- `page`: Page number (default: 1)
- `limit`: Records per page (5, 10, 20, 50, default: 10)
- `search`: Partial text match across `title`, `author`, `paperId`
- `sortBy`: Field to sort by (`publicationDate`, `paperId`, `title`, `author`, `price`)
- `order`: Sort direction (`desc` or `asc`)
- `author`: Filter by author name
- `minPrice`: Filter by minimum price
- `maxPrice`: Filter by maximum price
- `startDate`: Filter by minimum publication date
- `endDate`: Filter by maximum publication date

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/aravindbala03112003/CRUD-OPERATIONS.git
cd CRUD-OPERATIONS
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm install --prefix client
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/research_papers?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Seed the database (Optional)
```bash
npm run seed
```

### 5. Run automated tests
```bash
npm test
```

### 6. Start the development server
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/papers`

---

## ☁️ Deployment to Vercel

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. In Project Settings > Environment Variables, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `NODE_ENV`: `production`
4. Deploy! Vercel will automatically build the React client and deploy the Express API via serverless functions.
