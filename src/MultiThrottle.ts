import Tokens, { Feature, TokenConfig } from './Tokens.js';
import ServerSideThrottle, {ServerSideThrottleConfig, ResponseData} from './ServerSideThrottle.js';
import * as fs from 'fs'
import express, { Request, Response, NextFunction } from 'express';
import { endianness } from 'os';


const isAction = (actionBody:any)=>{
    return 'name' in actionBody && 'weight' in actionBody;
}


interface GlobalThrottleConfig extends Array<ServerSideThrottleConfig> {

}


class MultiThrottle {
    globalThrottleControlPath: string;
    throttleList?: Array<ServerSideThrottle>;

    /**
   * @param {string} globalThrottleControlPath - Path for configuration file
   * @param {Array<ServerSideThrottle>} throttleList - Array of Throttling Models
   */

    constructor(globalThrottleControlPath: string) {

        this.globalThrottleControlPath = globalThrottleControlPath;

        if (globalThrottleControlPath != '') {

            const configuration:GlobalThrottleConfig = JSON.parse(fs.readFileSync(this.globalThrottleControlPath, 'utf-8'))

            this.setGlobalThrottle(configuration)


            fs.watch(globalThrottleControlPath, (curr, prev) => {
                const newConfiguration = JSON.parse(fs.readFileSync(globalThrottleControlPath, 'utf-8'))
                this.setGlobalThrottle(newConfiguration)
            })

        }
    }

    setGlobalThrottle = (args: GlobalThrottleConfig)=> {
        this.throttleList = args.map(item => {
            const throttle:ServerSideThrottle = new ServerSideThrottle();
            throttle.setThrottle(item);
            return throttle;
        })
    }

    throttle = (req: Request, res: Response, next: Function) => {
        for (const item of this.throttleList || []) {
            const result:ResponseData = item.throttleGlobal(req,res,next);
            if (result.body) {
                return res.status(result.status).json(result.body)
            }
        }
        return next();
    }

}

export default MultiThrottle;


// Sample config below
const sampleConfig: GlobalThrottleConfig = [{
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
}]