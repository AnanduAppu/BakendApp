
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloudnary_Cloud_Name,
  api_key: process.env.Cloudnary_Api_Key,
  api_secret: process.env.Cloudnary_Secrete_API_Key,
} );


module.exports = cloudinary;