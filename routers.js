import express from 'express';
import { Controller } from './controller.js';
import { upload } from './configrations.js';

export default function userRoutes() {
    const router = express.Router();
    router.post('/adduser', Controller.addUser);
    router.get('/getuserslist',Controller.getUsersList);
    router.post('/addproduct',upload.single('photo'),Controller.addproduct);
    router.get('/getproducts',Controller.getproducts);
    router.post('/getsingleproduct',Controller.getsingleproduct);
    router.post('/editproduct',upload.single('photo'),Controller.editproduct);
    router.post('/createreview',Controller.createReview);
    router.post('/selectreviews',Controller.selectreviews);
    router.post('/dropreview',Controller.dropreview);
    router.post('/editreview',Controller.editreview);

    return router;
}