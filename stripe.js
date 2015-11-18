var app = require('express')();
var config = require('./config.js')
var stripe = require('stripe')(config.private_key)
var util=require('util');
app.use(require('body-parser').urlencoded({extended:false}))
app.get("/charge",function(req,res){
    res.send('<form action="/charge" method="POST">'+
	     '  <script'+
	     '    src="https://checkout.stripe.com/checkout.js" class="stripe-button"'+
	     '    data-key="' + config.public_key + '"'+
	     '    data-image="/img/documentation/checkout/marketplace.png"'+
	     '    data-name="LeadSecure Site"'+
	     '    data-description="video things"'+
	     '    data-panel-label="pay once"'+
	     '    data-email="some@email.com"' +
	     '    data-amount="500"'+
	     '    data-parameter="500"'+
	     //'    data-bitcoin=true"'+
	     '    data-locale="auto">'+
	     '  </script>'+
	     '</form>'+
	     '<form action="/subscribe" method="POST">'+
	     '  <script'+
	     '    src="https://checkout.stripe.com/checkout.js" class="stripe-button"'+
	     '    data-key="' + config.public_key + '"'+
	     '    data-image="/img/documentation/checkout/marketplace.png"'+
	     '    data-name="LeadSecure Site"'+
	     '    data-description="video things"'+
	     '    data-panel-label="subscribe"'+
	     '    data-email="some@email.com"' +
	     '    data-amount="500"'+
	     '    data-parameter="500"'+
	     //'    data-bitcoin=true"'+
	     '    data-locale="auto">'+
	     '  </script>'+
	     '</form>')
})
app.post("/subscribe", function(req,res){
    var token=req.body.stripeToken;
    var email=req.body.stripeEmail;
    stripe.customers.create({
	source: token,
	plan: "1",
	email: email
    },function(err,data){
	if(err){
	    res.send("<html><body>Error detected:<p>"+err+'</p></html>');
	} else {
	    res.send("<html><body>You have been charged for 50 cents:<pre>"+util.inspect(data)+'</pre></html>');
	}
    })
});

app.post("/charge", function(req,res){
    var token=req.body.stripeToken;
    var email=req.body.stripeEmail;
    require('stripe')(config.private_key).charges.create({
	amount: 50, // in cents minimum 50 cents
	currency: "usd",
	source: token,
	description: "Test charge from "+email
    },function(err,data){
	if(err){
	    res.send("<html><body>Error detected:<p>"+err+'</p></html>');
	} else {
	    res.send("<html><body>You have been charged for 50 cents:<pre>"+util.inspect(data)+'</pre></html>');
	}
    })
});

var sever=app.listen(3000,function(){console.log("Started... open browser at localhost:3000/charge")})
