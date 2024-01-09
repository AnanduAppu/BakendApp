const express = require("express");
const router = express();

const {authentication} =require("../middleWares/aunthication")
const userForm = require("../controller/userForm")

router.route("/login").post(userForm.loginform);
router.route("/products/category/:id").get(authentication, userForm.productCategory);
router.route("/products/:id").get(authentication, userForm.productId);
router.route("/products").get(authentication, userForm.products);
router.route("/:id/cart").post(authentication, userForm.cartAdding);
router.route("/:id/cart").get(authentication, userForm.displayCart);
router.route("/:id/wishlist/").post(authentication, userForm.addWishtlist);
router.route("/:id/wishlist").get(authentication, userForm.displayWishlist);
router.route("/:id/wishlist").delete(authentication, userForm.removeWishItems);
router.route("/:id/orderplacing").get(authentication, userForm.placingOrder);
router.route("/:id/orderplacing").post(authentication, userForm.payment);





module.exports = router;