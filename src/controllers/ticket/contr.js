const db = require("../../db/connectdb");
const log_date_now = require("../../middleware/helper_functions/date")
/** 
  * Creates a ticket
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /ticket/create
  * @method POST
*/
const create = async(req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
        const {event_id} = req.body;
        console.log(req.body)
        let user = await db.query(`SELECT id FROM user WHERE email = "${email}";`);
        user = user[0][0];
    
        let event = await db.query(`SELECT id,tickets_quantity,tickets_sold , status FROM ${event_id};`)
        event = event[0][0];

        if(event.tickets_quantity === event.tickets_sold || event.status=="SOLDOUT"){
            console.log(`
            {
                event
                quantity:${event.tickets_quantity};
                sold:${event.tickets_sold};
                status:${event.status}
            }`)
            return res.status(403).json({"status":"fail"})
        }
        let ticket_body = req.body;
        ticket_body.event = event.id;
        ticket_body.user = user.id;
    
        let ticket = await db.create('ticket', ticket_body)
        console.log(ticket);

        let changed = await db.query(`UPDATE ONLY ${event_id} SET tickets_sold += 1;`);
        changed=changed[0];
        console.log(changed);
        if(changed.tickets_quantity === changed.tickets_sold){
            console.log(`
            {
                changed
                quantity:${changed.tickets_quantity};
                sold:${changed.tickets_sold};
                status:${changed.status}
            }`)
            let c = await db.query(`UPDATE ONLY ${event_id} SET status = "SOLDOUT";`);
            console.log(c[0].status)
        }
        return res.status(200).json({"status":"pass"})
    } catch (error) {
        console.error(`[${log_date_now()}] controllers > ticket > contr.js > register:-> ${error}`)
        return res.status(500).json({"status":"fail"})
    }
}

/** 
  * Controller for returning a ticket
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /ticket/return
  * @method POST
*/
const return_ticket = async(req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
        const {ticket_id, event_id} = req.body
        if(role != "organizer"){
            return res.status(403).json({"status":"failed"});
        }
        let event = await db.query(`SELECT name, status, organizer.email FROM ${event_id} FETCH organizer;`);
        event = event[0][0];
        console.log(event);
        if(event.organizer.email !== email){
            return res.status(403).json({"status":"fail"});
        }

        let returned = await db.query(`UPDATE ONLY ${ticket_id} SET status = "RETURNED"; UPDATE ONLY ${event_id} SET tickets_sold -= 1`);
        let returned_event = returned[1]
        let returned_ticket= returned[0]

        let new_event = await db.query(`UPDATE ONLY ${event_id} SET status = "AVAILABLE"`);
        console.log(new_event)
        return res.status(200).json({"status":"pass"})
    } catch (error) {
        console.error(`[${log_date_now()}] controllers > ticket > contr.js > return:-> ${error}`)
        return res.status(500).json({"status":"fail"})
    }
}

/** 
  * Controller for confirming a ticket
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /ticket/return
  * @method POST
*/
const confirm = async(req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
        const {ticket_id, event_id} = req.body
        if(role != "organizer"){
            return res.status(403).json({"status":"failed"});
        }
        let event = await db.query(`SELECT name, status, organizer.email FROM ${event_id} FETCH organizer;`);
        event = event[0][0];
        console.log(event);
        if(event.organizer.email !== email){
            return res.status(403).json({"status":"fail"});
        }

        let new_event = await db.query(`UPDATE ONLY ${ticket_id} SET status = "USED";`);
        console.log(new_event)

        return res.status(200).json({"status":"fail"})
    } catch (error) {
        console.error(`[${log_date_now()}] controllers > ticket > contr.js > confirm:-> ${error}`)
        return res.status(500).json({"status":"fail"})
    }
}

/** 
  * Get one ticket
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /ticket/get_one
  * @method GET
*/
const get_ticket = async (req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
        const {ticket_id} = req.body;

        let ticket = await db.query(`SELECT id, price, type ,time_issued, status, user.wallet,user.email,event.description, event.venue, event.opening, event.closing, event.hour_range, event.status  FROM ${ticket_id} FETCH event, user;`);
        
        return res.status(200).json({"status":"pass", "ticket":ticket})
    } catch (error) {
        console.error(`[${log_date_now()}] controllers > ticket > contr.js > get_ticket:-> ${error}`)
        return res.status(500).json({"status":"fail"});
    }
}

/** 
  * Get one ticket
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /ticket/get_all
  * @method GET
*/
const get_all_event_tickets = async(req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
        const {event_id} = req.body
        if(role != "organizer"){
            return res.status(403).json({"status":"failed"});
        }
        let event = await db.query(`SELECT organizer.email FROM ${event_id} FETCH organizer;`);
        event = event[0][0];
        console.log(event);
        if(event.organizer.email !== email){
            return res.status(403).json({"status":"fail"});
        }

        let tickets = await db.query(`SELECT id, price, type ,time_issued,status, user.wallet, user.email, event.description, event.venue, event.opening, event.closing, event.hour_range, event.status  FROM ticket  WHERE event = ${event_id} ORDER BY status FETCH event, user`);

        return res.status(200).json({"status":"pass", "tickets":tickets[0]});
    } catch (error) {
        console.error(`[${log_date_now()}] controllers > ticket > contr.js > get_all_event_tickets:-> ${error}`)
        return res.status(500).json({"status":"fail"});
    }
}

/** 
  * Get all tickets for a user 
  * @param {request}  req  - The request object
  * @param {response} res  - The response object
  * @returns {response} A response object
  * @path /ticket/get_my
  * @method GET
*/
const get_my_tickets = async(req, res)=>{
    try {
        if(!req.user){
            return res.status(401).json({"status":"failed"});
        }
        const {email,role} = req.user;
       
        if(role != "user"){
            return res.status(403).json({"status":"failed"});
        }
        let user = await db.query(`SELECT id, email FROM user WHERE email = "${email}";`)
        user = user[0][0]
        console.log(user)
        if(!user && user.email != email){
            return res.status(403).json({"status":"fail"});
        }
        let tickets = await db.query(`SELECT id, price, type ,time_issued,status , user.wallet, user.email,event.description , event.venue, event.opening, event.closing, event.hour_range, event.status  FROM ticket WHERE user = ${user.id} ORDER BY status FETCH event,user ;`);

        return res.status(200).json({"tickets":tickets[0], "no_tickets":tickets[0].length})

    } catch (error) {
        console.error(`[${log_date_now()}] controllers > ticket > contr.js > get_my_ticket:-> ${error}`)
        return res.status(500).json({"status":"fail"});
    }
}
module.exports = {
    create,
    return_ticket,
    confirm,
    get_all_event_tickets,
    get_my_tickets,
    get_ticket
}