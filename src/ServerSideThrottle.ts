import Tokens, { Feature, TokenConfig } from './Tokens.js'
import * as fs from 'fs'
import express, { Request, Response, NextFunction } from 'express';


export interface Action extends Feature {
    name: string;
    weight: number;
    response?: ResponseData | undefined
}

export interface ResponseData {
    status: number;
    body: any;
    name?:string;
}

const returnResponseBody = (key:string):ResponseData=>{
    return {
        status:200,
        body:[],
        name:key
    }
}

export interface ServerSideThrottleConfig extends Partial<TokenConfig> {
    features: Array<Action>
    pathList?: Array<string>
    matchType?: string
}


class ServerSideThrottle {
    throttleControlPath: string;
    features: Array<Action>;
    tokens: Tokens;
    pathList?: Array<string>;
    matchType?: string

    /**
   * @param {string} throttleControlPath - Path for configuration file
   * @param {Array<Tokens>} tokens - Array of Tokens
   * @param {Array<Features>} features - Array of Features
   * @param {Array<string>} pathList - Array of paths that are impacted
   * @param {string} matchType
   */

    constructor(throttleControlPath: string='') {

        this.throttleControlPath = throttleControlPath;
        this.throttle = this.throttle.bind(this);
        this.toString = this.toString.bind(this);

        if (throttleControlPath != '') {

            const configuration:ServerSideThrottleConfig = JSON.parse(fs.readFileSync(this.throttleControlPath, 'utf-8'))

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
        this.pathList = args.pathList
        this.matchType = args.matchType
        console.log('Tokens : '+ this.tokens)
    }
    
    throttle(req: Request, res: Response, next: Function) {

        if (this.pathList && !this.pathList.includes(req.path)) {
            next()
            return;
        }

        // if(this.matchType && this.matchType == 'LIKE'){
        //     this.pathList?.forEach(path=>{
        //         if (req.path.includes(path)){
        //             next()
        //             return;
        //         }
        //     })
        // }

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

    throttleGlobal(req: Request, res: Response, next: Function) {

        if (this.pathList && !this.pathList.includes(req.path)) {
            return returnResponseBody('NEXT')
        }

        // if(this.matchType && this.matchType == 'LIKE'){
        //     this.pathList?.forEach(path=>{
        //         if (req.path.includes(path)){
        //             return returnResponseBody('NEXT')
        //         }
        //     })
        // }

        const token = this.tokens.popToken()

        switch (true) {
            case token == 'NEXT': {
                return returnResponseBody('NEXT');

            }

            case token != '': {

                const action: Action | undefined = this.features.find(item => item.name == token);
                if (action && action.response) {
                    return action.response
                }
            }

            default: {
                return returnResponseBody('NEXT');
            }
        }


    }

    toString(){
        console.log(this.tokens)
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
    ],
    matchType:'EXACT'
}