
const test_auth = (req, res, next)=>{
    console.log("you've hit test");
    next()
}

module.exports =  test_auth;  