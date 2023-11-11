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
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//section:     ---use routes
app.use("/api/v1/admin", admin_routes);
app.use("/api/v1/organizer", organizer_routes);
app.use("/api/v1/user", user_routes);
app.use("/api/v1/event", event_routes);
app.use("/api/v1/ticket", ticket_routes);
//endsection:  ---use routes


app.get("/", (req,res)=>{
    console.log("hey");
    return res.send("hello")
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
        return res.send("created")
    } catch (error) {
        console.log(error);
        return res.send("error");
    }
})

app.listen(3000,'192.168.100.11',(req,res)=>{
    console.log(process.env.TEST)
    console.log(`Listening at port 3000...`)
})