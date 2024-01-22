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
    gobalThrottleControlPath: string;
    throttleList?: Array<ServerSideThrottle>;

    /**
   * @param {string} gobalThrottleControlPath - Path for configuration file
   * @param {Array<ServerSideThrottle>} throttleList - Array of Throttling Models
   */

    constructor(gobalThrottleControlPath: string) {

        this.gobalThrottleControlPath = gobalThrottleControlPath;
        this.throttle = this.throttle.bind(this);
        this.setGlobalThrottle = this.setGlobalThrottle.bind(this);

        if (gobalThrottleControlPath != '') {

            const configuration:GlobalThrottleConfig = JSON.parse(fs.readFileSync(this.gobalThrottleControlPath, 'utf-8'))

            this.setGlobalThrottle(configuration)


            fs.watch(gobalThrottleControlPath, (curr, prev) => {
                const newConfiguration = JSON.parse(fs.readFileSync(gobalThrottleControlPath, 'utf-8'))
                this.setGlobalThrottle(newConfiguration)
            })

        }
    }

    setGlobalThrottle(args: GlobalThrottleConfig) {
        let tempArr:Array<ServerSideThrottle> = []
        args.forEach(item=>{
            const throttle:ServerSideThrottle = new ServerSideThrottle();
            throttle.setThrottle(item);

            tempArr.push(throttle)
        })
        this.throttleList = tempArr
    }

    throttle(req: Request, res: Response, next: Function) {
        let end = true

        this.throttleList?.forEach(item=>{
            const result:ResponseData = item.throttleGlobal(req,res,next);
            if(result.name != 'NEXT'){
                end = false
                return res.status(result.status).json(result.body)
                
            }
        })
        if(end){
            return next();
        }
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