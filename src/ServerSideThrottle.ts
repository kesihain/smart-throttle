import Tokens, { Feature, TokenConfig } from './Tokens.js'
import * as fs from 'fs'
import express, { Request, Response, NextFunction } from 'express';


interface Action extends Feature {
    name: string;
    weight: number;
    response?: ResponseData | undefined
}

interface ResponseData {
    status: number;
    body: any;
}

interface ServerSideThrottleConfig extends Partial<TokenConfig> {
    features: Array<Action>
}


class ServerSideThrottle {
    throttleControlPath: string;
    features: Array<Action>;
    tokens: Tokens;
    pathList: Array<string>;

    /**
   * @param {string} throttleControlPath - Path for configuration file
   * @param {Array<Tokens>} tokens - Array of Tokens
   * @param {Array<Features>} features - Array of Features
   * @param {Array<string>} pathList - Array of paths that are impacted
   */

    constructor(throttleControlPath: string) {

        this.throttleControlPath = throttleControlPath;
        this.throttle = this.throttle.bind(this);

        if (throttleControlPath != '') {

            const configuration = JSON.parse(fs.readFileSync(this.throttleControlPath, 'utf-8'))

            this.setThrottle(configuration)

            fs.watch(this.throttleControlPath, (curr, prev) => {
                const newConfiguration = JSON.parse(fs.readFileSync(this.throttleControlPath, 'utf-8'))
                this.setThrottle(newConfiguration)
            })

        }
    }

    setThrottle(args: ServerSideThrottleConfig) {
        this.features = args.features
        this.tokens = new Tokens()
        this.tokens.setTokens(args)
    }

    throttle(req: Request, res: Response, next: Function) {

        if (this.pathList.includes(req.path)) {

            const token = this.tokens.popToken()

            switch (true) {
                case token == 'NEXT': {
                    next();
                    break;

                }

                case token != '': {

                    const action: Action | undefined = this.features.find(item => item.name == token);
                    if (action && action.response) {
                        return res.status(action.response.status).json(action.response.body)
                    }
                }

                default: {
                    next();
                    break;
                }
            }
        }

        next();


    }



}

export default ServerSideThrottle;


// Sample config below
const sampleConfig: ServerSideThrottleConfig = {
    features: [
        {
            "name": 'NEXT',
            "weight": 80
        },
        {
            "name": 'RETRY',
            "weight": 20,
            "response": {
                "status": 200,
                "body": {
                    "message": "Try Again after some time"
                }
            }
        }
    ]
}