 import mysql from 'mysql2';
 import path from 'path';
 import multer from 'multer';
 import dotenv from 'dotenv';
 dotenv.config();

export const db = {
    connection: mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSOWRD
    }),

    queries: {
        addUser: 'CALL adduser(?, ?, ?)',
        getUsers: 'SELECT * FROM users',
        addProduct: 'CALL addproduct(?,?,?,?,?)',
        getproducts:'SELECT * FROM products',
        getsingleproduct: 'CALL getsngleproduct(?)',
        editproduct: 'CALL editproduct(?,?,?,?,?,?)',
        createReview:'CALL createreview(?,?,?,?)',
        selectreviews:'CALL selectReviews(?)',
        dropreview: 'CALL dropreview(?,?)',
        editreview: 'CALL editreview(?,?,?,?)'
    
    }
};

db.connection.connect(err => {
    if (err) console.error('DB connection error:', err);
    else console.log('Database connected successfully');
});


export const multerConfig = multer.diskStorage({
    destination : (req,file,cb)=>{
       cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null,uniqueName);
    }    
});
export const upload = multer({storage:multerConfig});
 