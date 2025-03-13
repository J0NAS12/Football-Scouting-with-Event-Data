cd db
docker stop match_db
docker rm match_db
docker-compose build
docker-compose up -d