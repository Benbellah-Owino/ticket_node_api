const db = require("../../db/connectdb");
const Bcrypt =require("bcrypt")
const {check_user_in_db} = require("../../middleware/helper_functions/user")
const log_date_now = require("../../middleware/helper_functions/date")
const {create_access_jwt,create_refresh_jwt} = require("../../middleware/auth/jwt")

/** 
  * Registers organizer into the system
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /organizer/register
  * @method POST
*/
const register = async(req, res) => {
    try {
        const body = req.body;
        console.log(body);
        let email_exists = await check_user_in_db(body.email,body.username,'organizer',res);
        if(email_exists==true){
            console.log("hit")
            return res.status(409).json({"status":"fail"});
        }

        let organizer = await db.create('organizer', body);
        console.log(organizer)

        if(organizer){
            return res.status(201).json({"status":"success"});
        }
       
    } catch (error) {
        console.error(`[${log_date_now()}] controllers > organizer > contr.js > register:-> ${error}`);
        res.status(500).json({"status":"fail"})
    }
}

/** 
  * Log's in users into the system
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /organizer/login
  * @method POST
*/
const login = async(req,res) => {
    try {
        const {identifier, password} = req.body;

        console.log(identifier);

        let organizer = await db.query(`SELECT email, username, password FROM organizer WHERE email = "${identifier}" OR username ="${identifier}";`);
        organizer = organizer[0][0];
        console.log(organizer)
       
    
        const authorized = await Bcrypt.compare(password, organizer.password);

        if(!authorized){
            return res.json(401).json({"status":"fail"});
        }

        const access_token = create_access_jwt(organizer.username, organizer.email, "organizer");
        const refresh_token = create_refresh_jwt(organizer.username, organizer.email, "organizer");
    
        //TODO: Save refresh token securely
        return res.status(201)
        .cookie('refresh_token', refresh_token, {httpOnly:true})
        .cookie('Authorization', access_token,{httpOnly:true})
        .json({"status":"success"});
        
    } catch (error) {
        console.error(`[${log_date_now()}] controllers > organizer > contr.js > register:-> ${error}`)
        res.status(500).json({"status":"fail"})
    }
}



module.exports = {
    register,
    login
}