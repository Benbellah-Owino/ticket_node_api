const db = require("../../db/connectdb");
const Bcrypt =require("bcrypt")
const {check_user_in_db} = require("../../middleware/helper_functions/user")
const {create_access_jwt,create_refresh_jwt} = require("../../middleware/auth/jwt")
const log_date_now = require("../../middleware/helper_functions/date")
/** 
  * Registers users into the system
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /user/api/register
*/
const register = async(req, res) => {
    try {
        const body = req.body;
        let email_exists = await check_user_in_db(body.email,body.username,res);
        if(email_exists==true){
            console.log("hit")
            return res.status(409).json({"status":"fail"});
        }

        let user = await db.create('user', body);

        if(user){
            return res.status(201).json({"status":"success"});
        }
       
    } catch (error) {
        console.error(`[${log_date_now()} ] controllers > user > contr.js > register:-> ${error}`)
        res.status(500).json({"status":"fail"})
    }
}

/** 
  * Log's in users into the system
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /user/api/login
*/
const login = async(req,res) => {
    try {
        console.log(req.body)
        
        const {identifier, password} = req.body;
        const origin = req.get('Origin');
        console.log(`Req origin: ${origin}`)
        
        let user = await db.query(`SELECT email, username, password FROM user WHERE email = "${identifier}" OR username ="${identifier}";`);
        user = user[0][0]
       
    
        const authorized = await Bcrypt.compare(password, user.password);

        if(!authorized){
            return res.json(401).json({"status":"fail"});
        }

        const access_token = create_access_jwt(user.username, user.email, "user");
        const refresh_token = create_refresh_jwt(user.username, user.email, "user");
        
        console.log(`[${log_date_now()} ] user ${user.username} logged in.`)
       
        
        return res.status(200)
        .cookie('refresh_token', refresh_token, { sameSite:"None",secure:false,domain:`${origin}`, maxAge: 30 * 1000 * 60})
        .cookie('authorization', access_token, { sameSite:"None",secure:false,domain:`${origin}`, maxAge: 1 * 1000 * 60 * 60 *24})
        .cookie('didy', "woop", { sameSite:"None",domain:origin,secure:false,})
        .json({"status":"success", "token":access_token});
        
    } catch (error) {
        console.error(`[${log_date_now()} ] controllers > event > contr.js > login:-> ${error}`)
        res.status(500).json({"status":"fail"})
    }
}



module.exports = {
    register,
    login
}