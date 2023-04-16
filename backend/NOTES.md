docker run \
--name db
--rm \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=root \
-e POSTGRES_DB=ship_db \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v /tmp:/var/lib/postgresql/data \
-p 5432:5432 \
-it \
postgres

<!-- one line  -->

docker run --name db --rm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=ship_db -e PGDATA=/var/lib/postgresql/data/pgdata -v /tmp:/var/lib/postgresql/data -p 5432:5432 -d postgres

lsof -i :5432
sudo ss -lptn 'sport = :5432'
kill <pid>
