# smart-throttle

  Functional load balancing and server side throttling for N

### Usage

#### app.js
```js
import express from 'express'

// Import ServerSideThrottle
import { ServerSideThrottle } from 'smart-throttle'

const app = express();

// Setup Throttle Middleware and pass to express
// NOTE : Pre-requisite to setup configuration file in path : /absolutePath/throttleConfig.json
const ThrottleMiddleWare = new ServerSideThrottle('/absolutePath/throttleConfig.json')
app.use(ThrottleMiddleWare.throttle)

app.get('/api/test/intercept', (req, res) => {
    res.json({ message: 'Welcome to Test Intercept' });
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

#### throttleConflig.json
```json
{
    "features":[
        {
            "name":"NEXT",
            "weight":50
        },
        {
            "name":"RETRY",
            "weight":50,
            "response":{
                "status":200,
                "body":{
                    "message":"Try Again after some time"
                }
            }
        }
    ],
    "pathList":[
        "/api/test/intercept"
    ]
}
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install smart-throttle
```

Follow [our installing guide](http://expressjs.com/en/starter/installing.html)
for more information.

## Features

  * Server Side Throttling
  * Functional Load Balancing
