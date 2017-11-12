[NUMBER ONE GRANDPA](http://grandpa.puresalt.gg/)
================================================================================

This is the source code for NUMBER ONE GRANDPA, a game developed by [John Mullanaphy](https:/jo.mu/) as part of 
[Pure Salt Gaming](https://puresalt.gg/).

Requirements
------------

This is built using `NodeJS 8.9.1` and using `EMCAScript 6` on the frontend. No guarantees on the server side code
running on other builds of NodeJS.

Commands
--------

You can checkout `package.json` for the specific commands, yet here's a quick breakdown:

|Command|Description|
|-------|-----------|
|npm start|Start our `server` to render our game in a browser on port 4001 using `pm2`.|
|npm restart|Restart our `server`.|
|npm stop|Stop our `server`.|
|npm test|Run the tests for both `app` and `server`.|
|npm run build|Compile our `app` source code into the `build` directory with a minified `grandpa.js` and readable `grandpa.dev.js` version.|
|npm run coverage|Run test code coverage on both `app` and `server`.|
|npm run coverage-app|Run test code coverage on `app`, loads at `/coverage` when `server` is running.|
|npm run coverage-server|Run test code coverage on `server` loads at `/coverage-server` when `server` is running.|
|npm run test-app|Test just our `app`.|
|npm run test-server|Test just our `server`.|
|npm run watch|Turn on `grunt watch` to trigger `npm run build` when the `app` code changes.|

Submitting bugs and feature requests
------------------------------------

Please send bugs to me via
[GitHub](https://github.com/mullanaphy/grandpa/issues)

Author
------

John Mullanaphy - <john@jo.mu> - <http://jo.mu/>

That's it for now...

License
-------

NUMBER ONE GRANDPA's source code is licensed under the Open Software License (OSL 3.0) -
see the `LICENSE` file for details

Acknowledgements
----------------

Nothing yet. Will drop some stuff down here as they come up.
