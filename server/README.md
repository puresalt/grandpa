# Built-in Server

This will run as is and serve the game code as well as extra endpoints to help with development. To start up the server
just need to fire up `npm start` or `node server/app.js`. Port by default is `4001` yet that can be updated in `pm2.yml`
or by setting `PORT` in the environment. Server also uses `NODE_ENV` to set either `development` or `production` for
returning development endpoints.

## Endpoints

### GET /

Actual endpoint to serve our game to the browser.

### GET /state

***WARNING:** This should only be internally accessible or potentially return filtered content.*

This returns all saved states on the server.

### POST /state

Create a new save state. Should receive a `201` status code with a `Location` header pointing to the created resource.

### GET /state/:id

Get the save state for `:id` if it exists.

### POST /state/:id

Create a new save state if there is no save state for `:id`, otherwise you will get a `403`.

### PUT /state/:id

Update the save state for `:id`.

### DELETE /state/:id

Delete the save state for `:id`.

### GET /app/coverage *(environment=development)*

Browse code coverage for the video game's source code. In order to view these pages the environment must be
`development` and the documentation must be created with `npm run coverage` or `npm run coverage:app`.

### GET /app/documentation *(environment=development)*

Browse documentation for the video game's source code. In order to view these pages the environment must be
`development` and the documentation must be created with `npm run documentation` or `npm run documentation:app`.

### GET /server/coverage *(environment=development)*

Browse code coverage for the our server's source code. In order to view these pages the environment must be
`development` and the documentation must be created with `npm run coverage` or `npm run coverage:server`.

### GET /server/documentation *(environment=development)*

Browse documentation for the our server's source code. In order to view these pages the environment must be
`development` and the documentation must be created with `npm run documentation` or `npm run documentation:server`.
