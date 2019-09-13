FROM postgres:alpine

ENV POSTGRES_USER user
ENV POSTGRES_PASSWORD pass
ENV POSTGRES_DB db

ADD ./docker/create_db.sql /docker-entrypoint-initdb.d/
