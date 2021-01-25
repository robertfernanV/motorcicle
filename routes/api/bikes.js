const router = require('express').Router();
const passport  = require('passport');
const unqid = require('unqid');
const dotenv = require('dotenv').config();
const { 
    getBike,
    createOrUpdateBike,
    validateBike,
    listBikes,
    deleteBike
} = require('../../helpers');


router.get('/',async(req,res)=>{
    const queryParams ={
        TableName: process.env.BIKES_TABLE
    }
    try{
        const data = await listBikes(queryParams);
        res.status(200);
        return res.send(data);
    }catch(err){
        res.status(401);
        res.send(err);
    }
});

router.get('/:id',async(req,res)=>{
    try{
        const params ={
            TableName: process.env.BIKES_TABLE,
            Key:{
                id:req.params.id
            }
        };
        const bike = await getBike(params);
        res.status(200);
        return res.send(bike);
    }catch(error){
        console.log('Error',error);
        res.status(401);
        res.send(error);
    }
})


router.post('/',async (req,res)=>{    
    const { startAt } = req.body;
    const bikeId = (Math.random()*1000);
    
    const queryParams ={
        TableName: process.env.BIKES_TABLE,
        FilterExpression:'startAt=:t',
        ExpressionAttributeValues:{
            ':t':startAt
        }
    }
    try{
        const data = await validateBike(queryParams);
        if(data.length>0){
            throw  { startAt :`El tiempo ${startAt} ya se encuentra registrado`};
        }else{
            const params ={
                TableName: process.env.BIKES_TABLE,
                Key:{
                    id:bikeId.toString()
                },
                UpdateExpression: "SET startAt=:t, busy=:busy, currentUser=:user",
                ExpressionAttributeValues :{
                    ':t':startAt,
                    ':busy':false,
                    ':user':''
                },
                ReturnValues:'ALL_NEW'
            };
            const bike = await createOrUpdateBike(params);            
            res.status(200);
            return res.send(bike);
        }
    }catch(err){
        res.status(401);
        res.send(err);
    }
});

router.put('/',async(req,res)=>{
    const {id,startAt} = req.body;
    const queryParams ={
        TableName: process.env.BIKES_TABLE,
        FilterExpression:'startAt=:t',
        ExpressionAttributeValues: {
            ':t':startAt
        }
    }
    try{
        const data = await validateBike(queryParams);
        if(data.length>0){
            throw  { startAt :`El tiempo ${startAt} ya se encuentra registrado`};
        }else{
            const params ={
                TableName: process.env.BIKES_TABLE,
                Key:{
                    id:id
                },
                UpdateExpression: "SET startAt=:t, busy=:busy, currentUser=:user",
                ExpressionAttributeValues :{
                    ':t':startAt,
                    ':busy':false,
                    ':user':''
                },
                ReturnValues:'ALL_NEW'
            };
            const bike = await createOrUpdateBike(params);
            res.status(200);
            return res.send(bike);
        }

    }catch(err){
        res.status(401);
        res.send(err);
    }

});

router.put('/:id/busy',async(req,res)=>{
    const {busy} = req.body;
    const id = req.params.id;
    try{
        const params ={
            TableName: process.env.BIKES_TABLE,
            Key:{
                id:id
            },
            UpdateExpression: "SET busy=:busy",
            ExpressionAttributeValues :{
                ':busy':busy
            },
            ReturnValues:'ALL_NEW'
        };
        const motorcicle = await createOrUpdateBike(params);
        res.status(200);
        return res.send(motorcicle);

    }catch(error){
        res.status(401);
        res.send(err);
    }
});

router.delete('/:id',async(req,res)=>{
    const id  = req.params.id;
    const params = {
        TableName: process.env.BIKES_TABLE,
        Key:{
            id:id
        }
    }
    try{
        const data = await deleteBike(params);
        res.status(200);
        return res.send({borrado:data});
    }catch(err){
        res.status(401);
        res.send(err);
    }
    
});

module.exports = router;