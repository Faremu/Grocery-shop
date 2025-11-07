import express from 'express'
import router from './router'
import cors from 'cors'
import path from 'path';
const app = express();
const port = 3000;

app.use(cors())

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname,'..', 'uploads')));
app.use(router)

app.listen(port,()=>{
    console.log('server is running on port 3000');
})