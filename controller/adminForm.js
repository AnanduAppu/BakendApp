const userModel = require("../model/Users");
const productModel = require("../model/Products");
const { signAccessToken } = require("../middleWares/jwt");
const  myCloudinary= require("../utltits/cloudnary");
const { tryCatch } = require("../middleWares/trycatchHandler");



  

//admin login
const loginAdmin =  async function (req,res){
    
        const admin ={username: process.env.Admin_username,
                        password: process.env.Admin_password,}
        const { username,password } = req.body;
        
        
        const validator = password === admin.password && username ===admin.username?true:false;
        

        if(validator){
            console.log("login successful");    
            res.status(202).cookie("adminAuth",accessToken).json({
            success:true,
            message:"successfull login"
           })}else{

            res.status(400).send("validation failed: incorrect username or password")
           }

    } 











//view all users 
const seeUsers = tryCatch( async function(req,res){

    const userData = await userModel.find()
    if (userData.length===0) {
        res.status(400).send("data base go error")
    }
    res.status(200).json(userData)
})


//view users by id
const userIdFind = tryCatch(async function(req,res){

    const id= req.params.id;

    const checkuser = await userModel.find({_id:id});
  
    if (!checkuser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(201).json(checkuser);
    }

})


//show products

const displayProduct = tryCatch(async function(req,res){
  
  const checkProduct = await productModel.find();

  if (!checkProduct) {
    res.status(404).json({
      success: false,
      message: "product not found",
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched products detail.',
      data: checkProduct
      })
  

}})

//show products by category

const productByCategory = tryCatch(async function(req,res){
  const cate = req.query.category
  const categoryFind = await productModel.aggregate([
    {
        $match: { category: cate }
    }
   
])
if (!categoryFind || categoryFind.length === 0) {
  res.status(404).json({
      success: false,
      message: "Category not found"
  });
}else{
  res.status(201).json(categoryFind)
}

})

//get product by id 
const productById = tryCatch(async function(req,res){
  const {id} = req.params
  console.log(id);
  const productid = await productModel.find({_id:id});
  if (!productid) {
    res.status(404).json({
      success: false,
      message: "product not found",
    });
  } else {
    res.status(201).json(productid);
  }
})



//add product to product document base in mongodb
const addProduct = tryCatch(async function(req,res){
    const {title,discription,price,category} = req.body;
    const existingProduct = await productModel.findOne({title:title})
    if(!existingProduct){
      const adding = await myCloudinary.uploader.upload(req.file.path)
      const added = await productModel.create({
        title,
        discription,
        price,
        category,
        image:adding.url
      })
      res.status(201).json({
        status: "success",
        message: "Successfully created a product.",
        data: added,
      });
    }else{
      res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

})



//product update
const adminUpdateProduct = tryCatch(async (req, res) => {
  const id = req.params.id;
  const isExist = await productModel.findById(id);
  const { title, description, price, category } = req.body;
  if (isExist) {
    const adding = await myCloudinary.uploader.upload(req.file.path);
  
    const product = await productModel.findById(id)

    product.title = title || product.title;
    product.description = description || product.description;
    product.image = adding.url || product.image;
    product.price = price || product.price;
    product.category = category||product.category

    await product.save();

    res.json({
      status: "success",
      message: "Successfully updated a product.",
      data: adding,
    });
  }
});



//product delete

const productDelete = tryCatch(async (req,res)=>{
  
  const productId = req.params.id;

       
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",

            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully.",
            data: deletedProduct,
        });
      })

      
      
//order status details 
      const statusDetails = tryCatch(async(req,res)=>{

          const userDetails = await userModel.find()

      
        let totalOrderCount = 0;
        let totalOrderPrice = 0;

       
        userDetails.forEach((user) => {
            totalOrderCount += user.orders.length;
            totalOrderPrice += user.orders.reduce((acc, order) => acc + order.price, 0);
        });
        totalOrderPrice.toFixed(2)
       
        res.json({
            success: true,
            message: "User order details retrieved successfully.",
            data: {
                totalOrderCount,
                totalOrderPrice,
            },
        });

      })

//order details
      const orderDetails = tryCatch(async(req,res)=>{

        const userDetails = await userModel.find()

        let allOrders = [];

        userDetails.forEach((user) => {
          
          allOrders = allOrders.concat(user.orders);
        });

        res.json({
            success: true,
            message: "User order details retrieved successfully.",
            data: allOrders,
        });


      })


      //find product 

      const findaProudct = tryCatch(async (req,res)=>{

          const price = req.body.price

          const check = await productModel.find({price:price});

        if(!check){
          res.status(401).json({
            message:"no product in there"
          })
        }
        res.status(200).json({
          message:"successful",
          data:check
        })
      })

module.exports={
    loginAdmin,
    seeUsers,
    userIdFind,
    displayProduct,
    productByCategory,
    productById,
    addProduct,
    adminUpdateProduct,
    productDelete,
    statusDetails,
    orderDetails,
    findaProudct 
}