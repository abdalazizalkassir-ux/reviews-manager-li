import { db } from './configrations.js';
import joi from 'joi'
 import fs from 'fs';

export const Controller = {

    addUser: (req, res) => {
    const { firstName, lastName, email } = req.body;

    // Joi validation
    const userSchema = joi.object({
        firstName: joi.string().trim().min(1).required(),
        lastName: joi.string().trim().min(1).required(),
        email: joi.string().email().pattern(/@gmail\.com$/).required()
    });

    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }

    // Check if email already exists
    db.connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error!');
            }

            if (rows.length > 0) {
                return res.status(400).json({ message: 'Email already used' });
            }

            // Insert user
            const values = [firstName, lastName, email];
            db.connection.query(db.queries.addUser, values, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Server error!');
                }

                res.status(201).send('Done!');
            });
        }
    );
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

  const productSchema = joi.object({
        productName: joi.string().trim().min(1).required(),
        price: joi.number().min(1).required(),
        description: joi.string().trim().min(1).required(),
        rate: joi.number().min(1).optional()
    });

    const {error} = productSchema.validate(req.body)
  if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }
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


const productSchema = joi.object({
        productName: joi.string().trim().min(1).required(),
        price: joi.number().required().empty('').messages({
            'any.required':'price required!',
            'number.base':'price must be a number',
          
        }),
        description: joi.string().trim().min(1).required(),
        id: joi.number().required().min(1).empty('').messages({
            'any.required':'ID required!',
            'number.base':'ID must be a number',
            'number.min':'invalid ID'
        })
    });

    const {error} = productSchema.validate(req.body)
  if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }
    
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
,

createReview: (req, res) => {
    const { product_id, user_id, rating, review } = req.body;

    // 1️⃣ Validate FIRST
    const reviewSchema = joi.object({
        product_id: joi.number().integer().min(1).empty('').required()
            .messages({ 'any.required': 'Product ID required!' }),
        user_id: joi.number().integer().min(1).empty('').required()
            .messages({ 'any.required': 'User ID required!' }),
        rating: joi.number().min(0).max(5).empty('').required()
            .messages({
                'any.required': 'Rating required!',
                'number.min': 'Rating must be between 0 and 5!',
                'number.max': 'Rating must be between 0 and 5!'
            }),
        review: joi.string().trim().min(1).required()
            .messages({ 'any.required': 'Review required!' })
    });

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }

    // 2️⃣ THEN check if already rated
    db.connection.query(
        'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?',
        [product_id, user_id],
        (err, rows) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            if (rows.length > 0) {
                return res.status(409).send('You have rated this product before!');
            }

            // 3️⃣ INSERT ONLY HERE
            const values = [product_id, user_id, rating, review];

            db.connection.query(db.queries.createReview, values, (err) => {

                if (err) {
                    console.error(err);

                    // backup DB constraint
                    if (err.errno === 1644) {
                        return res.status(409).send('You have already rated this product!');
                    }

                    return res.status(500).send('Server Error');
                }

                return res.status(201).send('Done!');
            });
        }
    );
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
    
    
    const reviewSchema = joi.object({
  product_id: joi.number().integer().min(1).empty('').required()
    .messages({ 'any.required': 'Product ID required!' }),
  user_id: joi.number().integer().min(1).empty('').required()
    .messages({ 'any.required': 'User ID required!' }),
  rating: joi.number().min(0).max(5).empty('').required()
    .messages({ 
      'any.required': 'Rating required!', 
      'number.min': 'Rating must be between 0 and 5!',
      'number.max': 'Rating must be between 0 and 5!'
    }),
  review: joi.string().trim().min(1).empty('').required()
    .messages({ 'any.required': 'Review required!' })
});

    const {error} = reviewSchema.validate(req.body)
  
    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }

        const values = [product_id,user_id,rating,review]
        db.connection.query(db.queries.editreview,values,(err)=>{
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

    
