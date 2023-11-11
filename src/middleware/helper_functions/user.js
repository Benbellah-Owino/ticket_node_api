const db = require("../../db/connectdb");
const log_date_now = require("../helper_functions/date")
/** 
  * Checks if username or email is already in database/use
  * @param {string}    username  - The user's name
  * @param {string}    email     - user's email
  * @param {string}    table     - the table to check
  * @param {response}  res       - response object
  * @returns {boolean} true if user exists and false if user doesn't exist
*/
const check_user_in_db = async (email,username,table,res) =>{
    try {
        let [is_there]= await db.query(`SELECT id FROM user WHERE email = "${email}" OR username = "${username}"`, {tb:table});
        is_there = JSON.stringify(is_there[0])
    
        if(is_there){
            console.log(is_there)
            return true
        }else{
            
            return false
        }
    } catch (error) {
        console.error(`[${log_date_now()}] check_user_in_db:-> ${error}`);
        res.status(500).json({"status":"fail"})
    }
}

module.exports = {
    check_user_in_db
}