const exp=require('express');
const adminApp=exp.Router();


adminApp.get('/test-user',(req,res)=>{
    res.send({message:"userapi "})
})
module.exports=adminApp