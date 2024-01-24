import { Tokens } from '../dist/index.js'

const tokens = new Tokens('./control.json')

const getCount = (array) => {
    const stringCount = array.reduce((acc, currentValue) => {
        acc[currentValue] = (acc[currentValue] || 0) + 1;
        return acc;
    }, {});
    return JSON.stringify(stringCount)
}

getCount(tokens.getTokens())

// console.log('Master : ' + getCount(tokens.getMasterTokens()))

// console.log('Tokens : ' + getCount(tokens.getTokens()))

// console.log('Pop : ' + tokens.popToken())

// console.log('Master : ' + getCount(tokens.getMasterTokens()))

// console.log('Master : ' + getCount(tokens.getTokens()))

// console.log('Pop : ' + tokens.popToken())

// console.log('Master : ' + getCount(tokens.getMasterTokens()))

// console.log('Master : ' + getCount(tokens.getTokens()))

// console.log(getCount(["NEXT", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "RETRY", "NEXT", "RETRY", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "RETRY", "RETRY", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "RETRY", "RETRY", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "RETRY", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT", "NEXT"]))