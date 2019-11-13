[NUMBER ONE GRANDPA](http://grandpa.puresalt.gg/)
=================================================

This is the source code for NUMBER ONE GRANDPA, a game developed by [John Mullanaphy](https://jo.mu/) as part of 
[Pure Salt Gaming](https://puresalt.gg/).

## Requirements

This is built using `Node.js 10.9.0` and using `EMCAScript 6` on the frontend. No guarantees on the server side code
running on other builds of Node.js.

## Commands

You can checkout `package.json` for the specific commands, yet here's a quick breakdown:

|Command|Description|
|-------|-----------|
|npm restart|Restart our `server`.|
|npm start|Start our `server` to render our game in a browser on port 4001 using `pm2`.|
|npm stop|Stop our `server`.|
|npm test|Run the tests for both `app` and `server`.|
|npm run build|Compile our `app` source code into the `build` directory with a minified `grandpa.js` and readable `grandpa.dev.js` version.|
|npm run coverage|Run test code coverage on both `app` and `server`.|
|npm run coverage:app|Run test code coverage on `app`, loads at `/app/coverage` when `server` is running.|
|npm run coverage:server|Run test code coverage on `server` loads at `/app/coverage/server` when `server` is running.|
|npm run documentation|Generate documentation for both `app` and `server`.|
|npm run documentation:app|Generate documentation for `app`, loads at `/app/documentation` when `server` is running.|
|npm run documentation:server|Generate documentation for `server` loads at `/server/documentation` when `server` is running.|
|npm run test:app|Test just our `app`.|
|npm run test:server|Test just our `server`.|
|npm run watch|Turn on `grunt watch` to trigger `npm run build` when the `app` code changes.|

## Game Source Code

This is where all the fun lives, you can find the full source code in `./src`. To create a working game with this source
code you will need to provide assets in the aptly named `./assets` as well as AI logic, level design, and all the other
core game content.

Documentation for working on the game source code is in [./src/README.md](./src/README.md).

### Backend

This does come with a server to load the game in a browser or webview. It's straight forward enough, loads data, serves
it to the frontend, provides assets. Typical server stuff.

Documentation for utilizing the backend it in [./server/README.md](./server/README.md).

## Submitting bugs and feature requests

Please send bugs to me via
[GitHub](https://github.com/PureSalt/grandpa/issues)

## Author

John Mullanaphy - <john@jo.mu> - <http://jo.mu/>

That's it for now...

## License

NUMBER ONE GRANDPA's source code is licensed under the Open Software License (OSL 3.0) -
see the `LICENSE` file for details

## Acknowledgements

* State Machine provided via: <https://github.com/jakesgordon/javascript-state-machine>
