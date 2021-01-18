const router = require('express').Router();
const passport  = require('passport');
const AWS = require('aws-sdk');
const unqid = require('unqid');
const region = require('../../config/config').config();
const dotenv = require('dotenv').config();

router.post('/',(req,res,next)=>{
    AWS.config.update(region.aws_local_config);
    
    const { time } = req.body;
    const motorcicleId = unqid();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params ={
        TableName: process.env.MOTORCICLES_TABLE,
        Key:{
            id:motorcicleId
        },
        UpdateExpression: "SET startAt=:t, bussy=:bussy, currentUser=:user",
        ExpressionAttributeValues :{
            ':t':time,
            ':bussy':false,
            ':user':''
        },
        ReturnValues:'ALL_NEW'
    };

    docClient.update(params,(err,data)=>{
        if(err){
            res.status(401);
            return res.send({
                messagge:`Error ${err}`
            });
        }else{
            console.log('data',data);
            const { Attributes } = data;
            res.status(200);
            return res.send({
                motorcicle:Attributes
            });
        }
    });

});

module.exports = router;