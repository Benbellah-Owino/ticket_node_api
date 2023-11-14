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
    let auth_error = false
    try {
        const {identifier, password} = req.body;    
        const origin = req.get('Origin');
        console.log(`Req origin: ${origin}`)
     
        let organizer = await db.query(`SELECT email, username, password FROM organizer WHERE email = "${identifier}" OR username ="${identifier}";`);
        organizer = organizer[0][0];
        console.log(organizer)
    
        const authorized = await Bcrypt.compare(password, organizer.password);

        if(!authorized){
            console.log("unauth-> "+authorized)
            auth_error = true
            return res.json(401).json({"msg":"unauth","status":"fail"});
        }
        console.log("fire")
        const access_token = create_access_jwt(organizer.username, organizer.email, "organizer");
        const refresh_token = create_refresh_jwt(organizer.username, organizer.email, "organizer");
        
        console.log(`[${log_date_now()} ] user ${organizer.username} logged in.`)
        //TODO: Save refresh token securely
        return res.status(200)
        .cookie('refresh_token', refresh_token, { sameSite:"None",secure:false,domain:`${origin}`, maxAge: 30 * 1000 * 60})
        .cookie('authorization', access_token, { sameSite:"None",secure:false,domain:`${origin}`, maxAge: 1 * 1000 * 60 * 60 *24})
        .json({"status":"success", "token":access_token});
        
    } catch (error) {
        
        console.error(`[${log_date_now()}] controllers > organizer > contr.js > login:-> ${error}`)
       if(auth_error == false){
        return res.status(500).json({"status":"fail"})
       }
    }
}



module.exports = {
    register,
    login
}