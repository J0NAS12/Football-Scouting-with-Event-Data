# Football-Scouting-with-Event-Data

# Start db:

Prerequisites: Docker Desktop or Docker Engine

```
cd db
docker-compose build
docker-compose up -d
```

To initialize the db, run the contents of 'backend/import_data.ipynb'. This takes about 10 minutes to run.
Firstly, install the required packages

```
pip install -r backend/requirements.txt
```

You can use PGAdmin to check the contents of the database.

# Start backend:

```
cd backend
uvicorn backend:app --reload
```

You can test the available endpoints on FastAPI swagger:

http://127.0.0.1:8000/docs

# Start frontend:

```
cd frontend/football-scouting
ng serve
```

or

```
npm start
```

You can reach the frontend on localhost:4200
