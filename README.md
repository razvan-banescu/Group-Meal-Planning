# Easter 2025 Meal Planning

A web application for coordinating Easter meal planning among family members. Family members can specify which dishes they'll bring and the quantities.

## Features

- Add, edit, and delete dishes
- Specify dish quantities in grams
- Organize dishes by family members
- Modern, responsive UI

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- React Router for navigation

### Backend
- FastAPI (Python)
- SQLite database
- SQLAlchemy ORM

## Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Backend Development
- The backend uses FastAPI with SQLite database
- Models are defined in `backend/app/models/`
- API routes are in `backend/app/routers/`

### Frontend Development
- React components are in `frontend/src/components/`
- Pages are in `frontend/src/pages/`
- API services are in `frontend/src/services/`

## Deployment

The application can be deployed using platforms like:
- Frontend: Vercel, Netlify
- Backend: Railway, Render

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 