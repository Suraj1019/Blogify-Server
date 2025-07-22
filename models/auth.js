const dbModel=require('../utilities/connection');
const authModel={}

authModel.register=async(userObj)=>{
    const model= await dbModel.getUserCollection();
    const user=model.create(userObj);
    if(user) return user;
    return null;
}

authModel.checkUser=async(email)=>{
    const model= await dbModel.getUserCollection();
    const user=model.findOne({email:email});
    if(user) return user;
    return null;
}

module.exports=authModel;