 import mysql from 'mysql2';
 import path from 'path';
 import multer from 'multer';

export const db = {
    connection: mysql.createConnection({
        host: 'localhost',
        port: 3306,
        database: 'db',
        user: 'root',
        password: 'abdalaziz.abdmysql.123'
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
 