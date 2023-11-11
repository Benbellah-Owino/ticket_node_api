const jwt = require("jsonwebtoken");
const db = require("../../db/connectdb")
const log_date_now = require("../helper_functions/date")
/** 
  * Create a refresh token
  * @param {string}  username   - The user's name
  * @param {string}  email      - user's email
  * @param {string}  role       - user's role. Represents privi;eages
  * @returns {JsonWebToken} the refresh token
*/
const create_refresh_jwt = (username, email, role) => {
    console.log(process.env.REFRESH_TIME)
    return jwt.sign({username, email, role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn : process.env.REFRESH_TIME*60*60*24})
}


/** 
  * Create a access token
  * @param {string}  username   - The user's name
  * @param {string}  email      - user's email
  * @param {string}  role       - user's role. Represents privi;eages
  * @returns {JsonWebToken} the access token
*/
const create_access_jwt = (username, email, role) => {
    console.log(process.env.ACCESS_TIME)
    return jwt.sign({username, email, role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : process.env.ACCESS_TIME*60*30})
}

/** 
  * Verifies access token
  * @param {request}   request    - Request object
  * @param {response}  response   - Response object
  * @param {next}      next       - Represent next function
  * @returns {JsonWebToken} the access token
*/
const verify_user = (req, res, next) => {
    try {
      const token = req.cookies['Authorization'];
      if (!token){
        res.status(401).json({"status":"fail"});
      }
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next()
    } catch (error) {
      console.error(`[${log_date_now()}] middleware/auth/jwt.js/verifyUser-> ${error}`);
      res.status(401).json({"status":"fail"});
    }
}

module.exports = {
    create_access_jwt,
    create_refresh_jwt,
    verify_user
}