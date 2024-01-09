const userModel = require("../model/Users");
const { tryCatch } = require("../middleWares/trycatchHandler");



exports.userRgistration = tryCatch(async function (req,res){
        const {Name,email,password} = req.body
    
                console.log(req.body);
        const existinguser = await userModel.findOne({email:email});
        console.log(existinguser);
        if (existinguser) {
            return res.status(400).json({message:"user already exist"})
        }

        const user = await userModel.create(req.body);

        

        res.status(202).json({
            success:true,
            user})
    
})

