import { db } from './configrations.js';
 import fs from 'fs';

export const Controller = {

    addUser: (req, res) => {
        const { firstName, lastName, email } = req.body;

        if (!firstName) return res.status(422).send('First name required!');
        if (!lastName) return res.status(422).send('Last name required!');
        if (!email) return res.status(422).send('Email required!');

        const values = [firstName, lastName, email];

        db.connection.query(db.queries.addUser, values, (err) => {
            if (err) {
 
                if (err.errno === 3819) return res.status(400).send('Email must end with @gmail.com.');
                if (err.errno === 1062) return res.status(400).send('Email is already used!');
                
                console.error(err);
                return res.status(500).send('Server error!');
            }

            res.status(201).send('Done!');
        });
    },

    getUsersList: (req,res)=>{
        db.connection.query(db.queries.getUsers,(err,results)=>{
         if(err) return res.status(500).send('Server error');
         res.status(200).json(results);   
        } );
        },

    addproduct:  (req, res) => {
        const { productName, price, description,rate } = req.body;
    if (!req.file) {
        return res.status(400).send('Photo is required');
    }
    if(!productName||!price||!description){    
        fs.unlink(req.file.path,(unlinkErr)=>{
            if(unlinkErr) console.error('Error deleting file :',unlinkErr);
        })
    }

         if (!productName) {                  
        return res.status(422).send('Name is required');
    }   else if (!price) {
        return res.status(422).send('Price is required');
    } else   if (!description) {
        return res.status(422).send('Description is required');
    }
else{

    const photoPath = `/uploads/${req.file.filename}`;

    const values = [ productName, price, description,photoPath, rate];

    db.connection.query(db.queries.addProduct, values, (err) => {
        if (err) {
           fs.unlink(req.file.path,(unlinkErr)=>{
            if(unlinkErr) console.error('Error deleting file :',unlinkErr)
        });
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.status(201).send('Product added successfully');
    });
}
},

    getproducts:(req,res)=>{
 db.connection.query(db.queries.getproducts,(err,results)=>{
         if(err) return res.status(500).send('Server error');
         res.status(200).json(results);   
        } );},

    getsingleproduct:(req,res)=>{
        const {id} =req.body;
        if(!id) res.status(422).send('ID required !');
        db.connection.query(db.queries.getsingleproduct,[id],(err,results) =>{
            if(err) {
                console.error(err);
                return res.status(500).send('Server error !');}
                return res.status(200).json(results[0]);
            });

    },
  
  
    editproduct:  (req, res) => {
        const {id , productName, price, description,rate } = req.body||{};
    if (!req.file) {
        return res.status(400).send('Photo is required');
    }
    if(!productName||!price||!description||id){    
        fs.unlink(req.file.path,(unlinkErr)=>{
            if(unlinkErr) console.error('Error deleting file :',unlinkErr);
        })
    }

         if (!productName) {                  
        return res.status(422).send('Name is required');
    }   else if (!price) {
        return res.status(422).send('Price is required');
    } else   if (!description) {
        return res.status(422).send('Description is required');
        
    }else if(!id) res.status(422).send('ID required !');
else{

    const photoPath = `/uploads/${req.file.filename}`;

    const values = [id, productName, price, description,photoPath, rate];

    db.connection.query(db.queries.editproduct, values, (err) => {
        if (err) {
           fs.unlink(req.file.path,(unlinkErr)=>{
            if(unlinkErr) console.error('Error deleting file :',unlinkErr)
        });
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.status(201).send('Product moodified successfully');
    });
}
},

    createReview: (req,res)=>{
        const   {product_id,user_id,rating,review} = req.body;

        if(!product_id)
            return res.status(422).send('Product ID required !'); 
        if(!user_id)
            return res.status(422).send('User ID required !'); 
        if(!rating)
            return res.status(422).send('Rating required !'); 
        if(!review)
            return res.status(422).send('Review required !'); 
        if(5 < rating || 0 > rating)
            return res.status(422).send('Rating must be between 0 and 5 !');

        const values = [product_id,user_id,rating,review];

        db.connection.query(db.queries.createReview,values,(err)=>{
        if(err){
            if(err.errno===1644){
                return res.status(409).send('you have rated this product !')
            }
            console.error(err);
            res.status(500).send('Server Error');
        }
        res.status(201).send('Done !')
        });
    },

    selectreviews: (req,res)=>{
        const {product_id} = req.body;
        if(!product_id) res.status(422).send('Product ID required');
        db.connection.query(db.queries.selectreviews,[product_id],(err,results)=>{
            if(err){
                console.error(err);
                res.status(500).send('Server error !');
            }
            res.status(200).json(results);
        });
    },

    dropreview:(req,res)=>{
        const {product_id,user_id} = req.body;
        if(!user_id) return res.status(422).send('User ID required');
        if(!product_id) return res.status(422).send('Product ID required');
        db.connection.query(db.queries.dropreview,[product_id,user_id],(err)=>{
            if(err){
                if(err.errno===1644){
                 return   res.status(403).send('Can not drop the review after 24 hours of submit');
                }
            console.error(err);
            res.status(500).send('Server error');
            }
            return res.status(204).send('Done !');
        })
        
    },

editreview:(req,res)=>{
        const {product_id,user_id,rating,review} = req.body;
        if(!user_id) return res.status(422).send('User ID required');
        if(!product_id) return res.status(422).send('Product ID required');
        if(!rating) return res.status(422).send('Rating required');
        if(!review) return res.status(422).send('Review required');
        const values = [product_id,user_id,rating,review]
        db.connection.query(db.queries.dropreview,values,(err)=>{
            if(err){
                if(err.errno===1644){
                 return   res.status(403).send('more than a day passed on the review');
                }
            console.error(err);
            res.status(500).send('Server error');
            }
            return res.status(200).send('Done !');
        })
        
    },



    }

    
