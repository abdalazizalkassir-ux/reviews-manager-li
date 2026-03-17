import router from './routers.js';
import express from'express';//import the required package

const app = express();

app.use('/uploads',express.static('uploads'))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api',router());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
