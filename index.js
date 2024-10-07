const express = require ("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "DEEPAK123";

const app = express();
app.use(express.json());
const users = [];
 
function logger(req , res , next ) {
    console.log(req.method + " req method")
    next()
};
app.get("/", (req , res) =>{
    res.sendFile(__dirname + "/public/index.html")
    
});
app.post("/signup",logger, (req , res ) =>{
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username:username,
        password: password
           
    });
    res.send({
       message: "you are signed up "
    });
});

app.post("/signin",logger, (req,res )=>{
    const username = req.body.username;
    const password = req.body.password;

    const user =  users.find(user => user.username == username && user.password == password);

    if (user){
        const token = jwt.sign({
            username :username,
        },JWT_SECRET)
        res.send({
            token:token
        })
    }else {
        res.send({
            message : "you are not signed in"
        })
    }

});

const auth = (req , res)=>{
    const token = req.headers.token;
    const verify = jwt.verify(token, JWT_SECRET);
    next()
}
app.get("/me",logger, auth, (req , res)=>{
    // const token = req.headers.token;
    // const verify = jwt.verify(token, JWT_SECRET);
    const username = verify.username;
    const user =  users.find(user => user.username == username );

    if (user){
        res.json({
           username: user.username
        });
    }else {
        res.status(403).send({
            message:"invalid information"
        });
    };



    
});


app.listen(3000);