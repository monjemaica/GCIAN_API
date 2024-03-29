const jwt = require('jsonwebtoken');

module.exports = {
  
  auth: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, 'secret_K3Y', (err, decoded) => {
        if (err) {
          return res.status(401).send({message: 'Invalid Token...'});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({message: 'Access Denied! Unauthorized User'}); 
    }
  } 

};