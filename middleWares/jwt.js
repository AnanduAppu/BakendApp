const jwt = require("jsonwebtoken");


module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: userId,
      };
      
      const secret = process.env.secretKey;
      const options = {
        expiresIn: "1hr",
      };
     
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  },
};