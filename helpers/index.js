
const AWS = require('aws-sdk');
const region = require('../config/config').config();

//DynamoDB por defecto no retorna nada cuando se hace un put por ende se esta empleado update que retorna el objeto si lo especificas
//tanto para el crear y Actualizar
exports.createOrUpdateMotorcicle = async(params) =>{
    AWS.config.update(region.aws_local_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const data = await docClient.update(params).promise();
    const { Attributes } = data;
    return {motorcicle:Attributes};
}

/*
Se que se puede hacer la consulta con un indice local, 
pero me calculaba el costo, se esta usando de momento la capa gratuita!
blog.yugabyte.com/dynamodb-pricing-calculator-expensive-vs-alternatives/#:~:text=Don't%20forget%20that%20indexes,to%20your%20data%20storage%20bill.
Indexed data storage
Don’t forget that indexes in DynamoDB aren’t free. AWS tacks on 100 bytes of storage overhead per item to account for indexes. Indexes are then added to your data storage bill.
*/
exports.validateMotorcicle = async(params) =>{
    AWS.config.update(region.aws_local_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const data = await docClient.scan(params).promise();
    return data.Items;
}

/*
Debido a las limitaciones de la capa gratuita se hace un simple scan,
lo ideal seria paginar pero esta fuera del alcance.
*/
exports.listMotorcicle = async(params)=>{
    AWS.config.update(region.aws_local_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const data = await docClient.scan(params).promise();
    return data;
}

exports.deleteMotorcicle = async(params) =>{
    AWS.config.update(region.aws_local_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const data = await docClient.delete(params).promise();
    return true;
}