const dotenv = require('dotenv').config();
const isDev = process.env.NODE_ENV !== 'produccion';

module.exports ={
    config : ()=>{
        if(isDev){
            return {
                aws_local_config:{
                    region:process.env.REGION_LOCAL,
                    endpooint:process.env.ENDPOINT_LOCAL
                }
            }
        }else{
            return {
                aws_local_config:{
                    region:process.env.REGION_PROD,
                    endpooint:process.env.ENDPOINT_PROD
                }
            }
        }
    }
}