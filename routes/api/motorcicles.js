const router = require('express').Router();
const passport  = require('passport');
const unqid = require('unqid');
const dotenv = require('dotenv').config();
const { createOrUpdateMotorcicle,
    validateMotorcicle,
    listMotorcicle,
    deleteMotorcicle
} = require('../../helpers');


router.get('/',async(req,res)=>{
    const queryParams ={
        TableName: process.env.MOTORCICLES_TABLE
    }
    try{
        const data = await listMotorcicle(queryParams);
        res.status(200);
        return res.send(data);
    }catch(err){
        res.status(401);
        res.send(err);
    }
});


router.post('/',async (req,res)=>{    
    const { startAt } = req.body;
    const motorcicleId = unqid();
    
    const queryParams ={
        TableName: process.env.MOTORCICLES_TABLE,
        FilterExpression:'startAt=:t',
        ExpressionAttributeValues:{
            ':t':startAt
        }
    }
    try{
        const data = await validateMotorcicle(queryParams);
        if(data.length>0){
            throw  { startAt :`El tiempo ${startAt} ya se encuentra registrado`};
        }else{
            const params ={
                TableName: process.env.MOTORCICLES_TABLE,
                Key:{
                    id:motorcicleId
                },
                UpdateExpression: "SET startAt=:t, bussy=:bussy, currentUser=:user",
                ExpressionAttributeValues :{
                    ':t':startAt,
                    ':bussy':false,
                    ':user':''
                },
                ReturnValues:'ALL_NEW'
            };
            const motorcicle = await createOrUpdateMotorcicle(params);
            res.status(200);
            return res.send(motorcicle);
        }
    }catch(err){
        res.status(401);
        res.send(err);
    }
});

router.put('/',async(req,res)=>{
    const {id,startAt} = req.body;
    const queryParams ={
        TableName:process.env.MOTORCICLES_TABLE,
        FilterExpression:'startAt=:t',
        ExpressionAttributeValues: {
            ':t':startAt
        }
    }
    try{
        const data = await validateMotorcicle(queryParams);
        if(data.length>0){
            throw  { startAt :`El tiempo ${startAt} ya se encuentra registrado`};
        }else{
            const params ={
                TableName: process.env.MOTORCICLES_TABLE,
                Key:{
                    id:id
                },
                UpdateExpression: "SET startAt=:t, bussy=:bussy, currentUser=:user",
                ExpressionAttributeValues :{
                    ':t':startAt,
                    ':bussy':false,
                    ':user':''
                },
                ReturnValues:'ALL_NEW'
            };
            const motorcicle = await createOrUpdateMotorcicle(params);
            res.status(200);
            return res.send(motorcicle);
        }

    }catch(err){
        res.status(401);
        res.send(err);
    }

});

router.delete('/',async(req,res)=>{
    const { id } = req.body;
    const params = {
        TableName: process.env.MOTORCICLES_TABLE,
        Key:{
            id:id
        }
    }
    try{
        const data = await deleteMotorcicle(params);
        res.status(200);
        return res.send({borrado:data});
    }catch(err){
        console.log('ERROR',err);
        res.status(401);
        res.send(err);
    }
    
});

module.exports = router;