const express = require("express");
const app = express();

//import database
const db = require("./db/connectdb.js");

//import routes
const admin_routes = require("./routes/admin/route");
const organizer_routes = require("./routes/organizer/route"); 
const user_routes = require("./routes/user/route");
const event_routes = require("./routes/event/route");
const ticket_routes = require("./routes/ticket/route"); 

//import middleware
const cookieParser = require("cookie-parser");
const cors = require("cors")

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(cors({credentials:true, origin:true}))
// app.use(cors({
   
// }))
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
})

//section:     ---use routes
app.use("/api/v1/admin", admin_routes);
app.use("/api/v1/organizer", organizer_routes);
app.use("/api/v1/user", user_routes);
app.use("/api/v1/event", event_routes);
app.use("/api/v1/ticket", ticket_routes);
//endsection:  ---use routes


app.get("/", (req,res)=>{
    console.log("hey");
    console.log(req.domain)
    console.log(req.cookies)
    return res.json({"msg":"hello"})
})

app.get("/test_db",async(req,res)=>{
    try {
        let created = await db.create('user',{
            username:"test_sbject1",
            email:"testsubjsect1@gmail.com",
            wallet_address:"wallet",
            password:"password"
        })
        console.log(created);
        return res.json({"msg":"created"})
    } catch (error) {
        console.log(error);
        return res.send("error");
    }
})
//192.168.100.11
app.listen(3000,(req,res)=>{
    console.log(process.env.TEST)
    console.log(`Listening at port 3000...`)
})