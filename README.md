# smart-throttle

  Functional load balancing and server side throttling for N

## Usage

### Multiple Server Side Throttle in single setup
#### app.js
```js
import express from 'express'
import { MultiThrottle } from 'smart-throttle'

const app = express();


const ThrottleMiddleWare = new MultiThrottle('/absolutePath/multiThrottleConfig.json')

// console.log('Tokens')
// console.log(ThrottleMiddleWare.tokens.getTokens())

app.use(ThrottleMiddleWare.throttle);

app.get('/api/test/intercept', (req, res) => {
    res.json({ message: 'Welcome to Test Intercept' });
})

app.get('/api/v2/test/intercept', (req, res) => {
    res.json({ message: 'Welcome to Test Intercept' });
})

app.get('/api/v3/test/intercept', (req, res) => {
    res.json({ message: 'Welcome to Test Intercept' });
})

app.get('/api/test/welcome',(req,res)=>{
    res.json({message: 'Welcome to App'})
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

#### multiThrottleConfig.json
```json
[
    {
        "features": [
            {
                "name": "NEXT",
                "weight": 50
            },
            {
                "name": "RETRY",
                "weight": 50,
                "response": {
                    "status": 200,
                    "body": {
                        "message": "Try Again after some time"
                    }
                }
            }
        ],
        "pathList": [
            "/api/test/intercept"
        ]
    },

    {
        "features": [
            {
                "name": "NEXT",
                "weight": 0
            },
            {
                "name": "RETRY",
                "weight": 100,
                "response": {
                    "status": 200,
                    "body": {
                        "message": "Try Again V2"
                    }
                }
            }
        ],
        "pathList": [
            "/api/v2/test/intercept"
        ]
    },

    {
        "features": [
            {
                "name": "NEXT",
                "weight": 0
            },
            {
                "name": "RETRY",
                "weight": 100,
                "response": {
                    "status": 200,
                    "body": {
                        "message": "Try Again V3"
                    }
                }
            }
        ],
        "pathList": [
            "/api/v3/test/intercept"
        ]
    }
]
```

### Single Server Side Throttle
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

#### throttleConfig.json
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

## Guide 
| Name | Level | Location | Desc |  Sample Usage  |
| ----------- | ----------- | ----------- | ----------- |   ----------- |
| MultiThrottle | Class | Module Export | Class Object with throttle method to be passed to express <br>Multiple Throttle Configurations in single file  |  const ThrottleMiddleWare = new MultiThrottle('configPath.json')  |
| ServerSideThrottle | Class | Module Export | Class Object with throttle method to be passed to express <br>Single throttle configuration per file. Need to create a new instance for each throttle configuration |  const ThrottleMiddleWare = new MultiThrottle('configPath.json')  |
| throttle | method | MultiThrottle/ServerSideThrottle | Method consumed by express to perform throttling |  app.use(ThrottleMiddleWare.throttle);  |
| features | field | throttleConfig.json | Array of features |  Refer Config  |
| name | field | features | Name of Feature |  Refer Config  |
| weight | field | features | Weightage of feature <br>Keep total to 100 to reduce complexity |  Refer Config  |
| response | field | features | Response Details |  Refer Config  |
| status | field |  response | HTTP status code |  Refer Config  |
| body | field | response | Response JSON/body |  Refer Config  |
| pathList | field | throttleConfig.json | Array of paths where throttle is enabled |  Refer Config  |


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
