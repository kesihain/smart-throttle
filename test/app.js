import express from 'express'
import { ServerSideThrottle } from '../dist/index.js'

const app = express();


const ThrottleMiddleWare = new ServerSideThrottle('/Users/kesihainalselvarajoo/Documents/smart-throttle/test/throttleConfig.json')

// console.log('Tokens')
// console.log(ThrottleMiddleWare.tokens.getTokens())

app.use(ThrottleMiddleWare.throttle)

app.get('/api/test/intercept', (req, res) => {
    res.json({ message: 'Welcome to Test Intercept' });
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});