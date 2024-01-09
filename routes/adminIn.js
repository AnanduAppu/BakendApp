const express = require("express");
const router = express();
const upload =require("../utltits/multer")
const {adminauth} = require("../middleWares/adminauth");
const adminForm = require("../controller/adminForm")

router.route("/admin/login").post(adminForm.loginAdmin);
router.route("/admin/users").get(adminauth,adminForm.seeUsers);
router.route("/admin/users/:id").get(adminauth,adminForm.userIdFind);
router.route("/admin/products").get(adminauth,adminForm.displayProduct);
router.route("/admin/products/category").get(adminauth,adminForm.productByCategory);
router.route("/admin/products/:id").get(adminauth,adminForm.productById);
router.route("/admin/products").post(adminauth,upload.single("image"),adminForm.addProduct);
router.route("/admin/products/:id").put(adminauth,upload.single("image"),adminForm.adminUpdateProduct);
router.route("/admin/products/:id").delete(adminauth,adminForm.productDelete);
router.route("/admin/stats").get(adminauth,adminForm.statusDetails);
router.route("/admin/orders").get(adminauth,adminForm.orderDetails);
router.route("/admin/find").post(adminauth,adminForm.findaProudct);



module.exports = router