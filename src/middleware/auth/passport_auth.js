var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
    secretOrKey : process.env.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = function(){
    var strategy = new Strategy(params, async function(payload, done){
        let user = await db.query(`SELECT id,email, username, password FROM user WHERE email = "${payload.identifier}" OR username ="${payload.identifier}";`);
        user = user[0][0]

        if(user.email !== payload.identifier || user.username !== payload.identifier){
            return done(new Error("UserNotFound"), null);
        }else if (payload.expire<= Date.now()){
            return done(new Error('Token Expired'), null)
        }else{
            return done(null, user)
        }
    })

    passport.use(strategy);

    return {initialize: function() {return passport.initialize()}}
}