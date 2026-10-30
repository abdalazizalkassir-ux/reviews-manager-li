import router from './routers.js';
import express from'express';//import the required package
import dotenv from 'dotenv';

const PORT = process.env.PORT;
dotenv.config();


const app = express();
app.use('/uploads',express.static('uploads'))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api',router());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
