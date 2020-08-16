// https://devcenter.heroku.com/categories/reference
//https://mailchimp.com/developer/

// npm install request




const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// for the local file which is the stule and the image of the site.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html")

  // res.send("Server is up and running")
})

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.userEmail;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  // to make it as JSON
  const jsonData = JSON.stringify(data);

  // from mailchimp API documentation , take the url .
  const url = "https://us17.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;

  // in auth u can put any name.
  const options = {
    method: "POST",
    auth: process.env.AUTH

  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {


      // console.log(JSON.parse(data));


    if  (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    }
    else {
      res.sendFile(__dirname + "/failure.html")
    }


    })
  })
  request.write(jsonData);
  request.end();
});

// for the user if he click on the button.
app.post("/failure", function(req, res){
  res.redirect("/")
})


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});
