const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config()

const port = process.env.PORT || 3000;
const app = express();
// For static files like css and images
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+'/public/signup.html');
})

mailchimp.setConfig({
  apiKey: process.env.APIKEY,
  server: "us11"
});

app.post("/",function(req,res){

    const listId = "48398f8ad1";
    const subscribingUser = {
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email
    };

    async function run() {
      try{
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });

        res.sendFile(__dirname+"/public/success.html");
      } catch (e) {
        res.sendFile(__dirname+"/public/failure.html");
      }
    }
      
    run();
    
})

app.post("/public/failure.html",function(req,res){
  res.redirect("/");
})


app.listen(port, function(){
    console.log('Server running at port ${port}');
})

