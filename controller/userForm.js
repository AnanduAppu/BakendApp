const userModel = require("../model/Users");
const productModel = require("../model/Products")
const bycrypt =require("bcrypt");
var cookieParser = require('cookie-parser');
const { signAccessToken } = require("../middleWares/jwt");
const { tryCatch } = require("../middleWares/trycatchHandler");
const Razorpay = require('razorpay');


// login area
const loginform = tryCatch( async (req,res)=>{

        const { email,password } = req.body;

        const checkUser = await userModel.aggregate([{ $match:{email:email} }]);
            console.log(password);
            hashpass = checkUser[0].password;

            if (!checkUser) {
                res.status(401).json({
                    success:false,
                    message:err.message
                })
            }

            bycrypt.compare(password,hashpass,(err,result)=>{
                if (!result) {
                    res.status(401).json({
                        success:false,
                        message:"password is failed"
                    })
                }
             
            })

            const accessToken = await signAccessToken({email:checkUser.email, id:checkUser._id})
            console.log(accessToken)
            console.log("login successful");    
              
            res.status(202).cookie("token",accessToken).json({
            success:true,
            message:"successfull login"})
});



//display products

const products = tryCatch( async (req,res)=>{
        const productData = await productModel.find();
        if (!productData) {
            res.status(401).json({
                success:false,
                message:"no products in here"
            })
        }else{
            res.status(201).json(productData)
        }
})



//product by id 
const productId = tryCatch(  async (req,res)=>{

    const id = req.params.id

        const productFindId = await productModel.findById(id)
        if(!productFindId){
            res.status(401).json({
                success:false,
                message:"product not found"
            })
        }else{
            res.status(201).json(productFindId)
        }
   
})



//product by category 
const productCategory =tryCatch( async  (req,res)=>{
    const cate = req.params.id
    
        const categoryFind = await productModel.aggregate([
            {
                $match: { category: cate }
            }
           
        ]);

        if (!categoryFind || categoryFind.length === 0) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }else{
            res.status(201).json(categoryFind)
        }

})



//add product to the user cart

const cartAdding =tryCatch( async (req, res) => {
  
       
        const { id: userid } = req.params;
        const { id: productid } = req.body;
   
        const addproduct = await productModel.findById(productid);
        const checkuser = await userModel.findById(userid);
    
        if (!addproduct && !checkuser){
    
            res.status(404).json({
                success: false,
                message: "user id or may product id get inccorrect"
            });
        }else{
            const isExist = checkuser.cart.find((item)=>item._id == productid);
    
            if(isExist){
                res.status(404).send("item is already in cart")
            }else{
                checkuser.cart.push(addproduct);
                await checkuser.save()
                res.status(201).json(checkuser)
            }
        }
        
  });


//view product from cart
const displayCart = tryCatch( async (req,res)=>{
        const id = req.params.id
        console.log(id);
        const usercheck = await userModel.findById(id);
       console.log(usercheck);
        if (!usercheck) {
            res.status(404).json({
                success: false,
                message: "invalid product"
            });
        } else {
          const cartdata = usercheck.cart
          res.status(201).json(cartdata)
        }
    
})



//add to wish list 
const addWishtlist = tryCatch(async (req,res)=>{
  
        const userid = req.params.id;
        const productid = req.body.id;
    
        const addproduct = await productModel.findById(productid);
        const checkuser = await userModel.findById(userid);
    
        if (!addproduct && !checkuser){
    
            res.status(404).json({
                success: false,
                message: "user id or may product id get inccorrect"
            });
        }else{
            const isExist = checkuser.wishlist.find((item)=>item._id == productid);
    
            if(isExist){
                res.status(404).send("item is already in wishlist")
            }else{
                checkuser.wishlist.push(addproduct);
                await checkuser.save()
                res.status(201).json(checkuser)
            }
    
    
        }
        
})



//view product from wishlist
const displayWishlist = tryCatch( async (req,res)=>{

    
        const id = req.params.id

        const usercheck = await userModel.findById(id);
       
        if (!usercheck) {
            res.status(404).json({
                success: false,
                message: "invalid product"
            });
        } else {
          const wishdata = usercheck.wishlist
          res.status(201).json(wishdata)
        }

  
})



//delete wish list items
// const removeWishItems = async function(req, res) {
//     const userid = req.params.id;
//     const productid = req.body.id;

//     try {
//         const userExists = await userModel.findById(userid);

//         if (!userExists) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const wishdata = userExists.wishlist;



//         const productObjectId = new mongoose.Types.ObjectId(productid);


//         const checkwish = wishdata.some((product) => product._id.equals(productObjectId));

//         if (checkwish) {
//             const updatedwishdata = wishdata.filter((ele) => !ele._id.equals(productObjectId));

//             const updateduser = await userModel.findByIdAndUpdate(
//                 userid,
//                 { $set: { wishlist: updatedwishdata } },
//                 { new: true }
//             );

//             res.status(201).json({
//                 message: "Product successfully removed from wishlist",
//                 data: updateduser.wishlist
//             });
//         } else {
//                 res.status(404).json({
//                 success: false,
//                 message: "Product not found in the wishlist"
//             });
//         }
//     } catch (err) {
//         res.status(401).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

const removeWishItems = tryCatch( async (req, res)=> {
    const userId = req.params.id;
    const productId = req.body.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { wishlist } = user;

        
        const productToRemove = wishlist.find(product => product._id.equals(productId));

        if (productToRemove) {
         
            const updatedWishlist = wishlist.filter(product => product !== productToRemove);

          
            user.wishlist = updatedWishlist;

           
            const updatedUser = await user.save();

            res.status(201).json({
                message: "Product successfully removed from wishlist",
                data: updatedUser.wishlist
            });
        } else {
           
            return res.status(404).json({
                success: false,
                message: "Product not found in the wishlist"
            });
        }
    
});


//order placingOrder

const placingOrder = tryCatch(async function(req,res){
    const userId = req.params.id
    const userCheck = await userModel.findById(userId);

    if(!userCheck){
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const { cart } = userCheck;

    if (cart.length === 0) {
        return res.status(404).json({
            success: false,
            message: "you have to add product to cart"
        });
    }else{
        const totalPrice = cart.reduce((accumulator, product) => {
            return accumulator + product.price;
          }, 0).toFixed(2);
          
          return res.status(200).json({
            success: true,
            message: `the total amount you have to pay ${totalPrice}`,
            products:`${cart.length}, products`,
            data: cart
        });
    }

})



 //payment processing order
const payment = tryCatch(async function(req,res){

    const userId = req.params.id
    const amount = req.body.id

   
    const userCheck = await userModel.findById(userId);
    
    const razorpay = new Razorpay({ key_id: process.env.keyid, key_secret: process.env.key_secret })
   
            if(!userCheck){
                return res.status(404).json({
                    success: false,
                    message: "user not valid"
                });
            }
               
                const { cart } = userCheck;

                if (cart.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "you have to add product to cart"
                    });
                }
                    const totalPrice = cart.reduce((accumulator, product) => {
                        return accumulator + product.price;
                      }, 0).toFixed(2);
                      

                if(totalPrice == amount){


                      const options = {
                        amount: amount  * 100,
                        currency: "INR",
                        receipt: "order_rcptid_11"
                    };
                    
                const order = await razorpay.orders.create(options);
                    
                userCheck.orders = userCheck.cart;
                //userCheck.cart = [];
                await userCheck.save();
                
                      return res.status(200).json({
                        success: true,
                        message: `you succesfully payed ${totalPrice}`,
                        order,
                        data: cart
                    });
                }else{
                    res.status(400).send("enter corrent amount")
                }        
})






module.exports = {
    loginform,
    products,
    productId,
    productCategory,
    cartAdding,
    displayCart,
    addWishtlist,
    displayWishlist,
    removeWishItems,
    placingOrder ,
    payment

  };