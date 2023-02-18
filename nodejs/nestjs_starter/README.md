## nestjs starter

2022-10-05

This project on hold.  It is a nestjs/react project.  

The nestjs API has working REST endpoints for managing users and workspaces.  no other features have been implemented.  this is a flexible base that can be extended for purposes including: a notebook, a task/project planner, a chat app, etc...

The react side is simply a new app set up with redux, tailwind, and eslint/prettier. there are not yet any frontend features - so far all of the work has been put into the API.

The starting point for the nestjs API was a course i followed with, arriving at the state of the repo here: https://github.com/vladwulf/nestjs-api-tutorial.  from that base I evolved the database model to include workspaces and role based authorization.

The main benefit that I got from this project is more confidence in understanding REST APIs and experience developing REST in a realistic context.  I also learned Prisma, Postgres, practiced database design, practiced integration testing, and got experience building role based authorization: from designing roles in the database to building the API and guards.  

This was also an interesting experience learning about the nest.js framework, which provides a lot of structure to the project and has some great patterns, such as using data transfer objects to automatically validate incoming requests.

in the server folder there are two .env files (.env and .env.test), and these are their contents (same keys for both files):

```
NODE_PATH="./"
POSTGRES_URL=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
JWT_SECRET=
JWT_EXPIRY_TIME="60m"
DEV_APP_USER=
DEV_APP_PW=
DEV_APP_ROLE="ADMIN"
```

The scripts in the package.json file contain info about starting docker and getting the database set up with prisma.  For dev and test the database is a docker container.