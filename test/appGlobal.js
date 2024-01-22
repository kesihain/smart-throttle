import express from 'express'
import { MultiThrottle } from '../dist/index.js'

const app = express();


const ThrottleMiddleWare = new MultiThrottle('/Users/kesihainalselvarajoo/Documents/smart-throttle/test/multiThrottleConfig.json')

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