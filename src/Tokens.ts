import * as fs from 'fs'

export interface Feature {
    weight: number;
    name: string;
    response?: MockResponse
}

export interface MockResponse {
    status: number,
    body?: any
}

export interface TokenConfig {
    features?: Array<Feature>;
}

const shuffle = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

class Tokens {
    features: Array<Feature>;
    tokens: Array<number> = [];
    masterTokens: Array<number> = [];
    tokenControlPath: string;

    /**
   * @param {Array} features - The name of the feature.
   * @param {Array} tokens - Array of tokens to be used
   * @param {Array} masterTokens - Master copy array of tokens
   * @param {string} tokenControlPath - Path for configuration file
   */

    constructor(tokenControlPath: string = '') {

        this.tokenControlPath = tokenControlPath;

        if (tokenControlPath != '') {

            const configuration = JSON.parse(fs.readFileSync(this.tokenControlPath, 'utf-8'))

            this.setTokens(configuration)

            fs.watch(this.tokenControlPath, (curr, prev) => {
                const newConfiguration = JSON.parse(fs.readFileSync(this.tokenControlPath, 'utf-8'))
                this.setTokens(newConfiguration)
            })

        }


    }

    getTokens() {
        return this.tokens;
    }

    getMasterTokens() {
        return this.masterTokens
    }

    popToken() {
        const result = this.tokens.pop()

        if (this.tokens.length == 0) {
            this.tokens = this.masterTokens
        }

        return result == null ? null : this.features[result];
    }

    setTokens(args: TokenConfig) {
        this.features = args.features ?? [];
        this.features.forEach((feature, idx) => {
            let tempArr = Array.from({ length: feature.weight }, () => idx)
            this.masterTokens.push(...tempArr)
        });
        this.masterTokens = shuffle(this.masterTokens)
        this.tokens = this.masterTokens
    }

}

export default Tokens;
