

const adminauth = (req,res,next)=>{
    const token = req.cookies.adminAuth;

    if(!token){
        res.status(401).send("Unauthorised Access");
    } else {
        next();
      }
};

module.exports = {adminauth}