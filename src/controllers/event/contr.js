const db = require("../../db/connectdb");
const log_date_now = require("../../middleware/helper_functions/date")
/** 
  * Creates an event into the system
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /event/create
  * @method POST
*/
const create = async(req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
        
        if(role != "organizer"){
            return res.status(403).json({"status":"failed"});
        }
    
        let organizer = await db.query(`SELECT id, email FROM organizer WHERE email = "${email}";`);
        organizer = organizer[0][0];
        
        if(!organizer.id){
            return res.status(403).json({"status":"failed"});
        }

        let event_request = req.body
        let event = await db.create('event', event_request);
        console.log(event);
        res.json({"status":"success"})
    } catch (error) {
        console.error(`[${log_date_now()} ] controllers > event > contr.js > create:-> ${error}`)
        res.status(500).json({"status":"fail"})
    }
}


/** 
  * Cancels an event 
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /event/cancel
  * @method PATCH
*/
const cancel= async(req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
        const {event_id} = req.body
        if(role != "organizer"){
            return res.status(403).json({"status":"failed"});
        }
        let event = await db.query(`SELECT name, status, organizer.email FROM ${event_id} FETCH organizer;`);
        event = event[0][0];
        console.log(event);
        if(event.organizer.email !== email){
            return res.status(403).json({"status":"fail"});
        }

        let changed = await db.query(`UPDATE ONLY ${event_id} SET status="CANCELLED";`);
        console.log(changed);
        return res.status(200).json({"status":"success"})
    } catch (error) {
        console.error(`[${log_date_now()} ] controllers > event > contr.js > cancel:-> ${error}`)
        res.status(500).json({"status":"fail"})
    }
}

const get_all = async(req,res)=>{
    try {
        let events = await db.query(`SELECT * FROM event WHERE status="AVAILABLE"`);
        console.log(events[0])
    return res.status(200).json({"events":events[0]})
    } catch (error) {
        console.error(`[${log_date_now()} ] controllers > event > contr.js > get_all:-> ${error}`)
        res.status(500).json({"status":"fail"})
    }
}
module.exports = {
    create,
    cancel,
    get_all
}