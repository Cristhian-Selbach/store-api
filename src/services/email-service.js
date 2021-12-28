require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.send = async (to, name)=>{
	sgMail.send({
		to: to,
		from: "crsthian.04@gmail.com", 
		subject: "Welcome to node api",
		text: "Hello " + name +"!!",
		html: "<strong>Whats up " + name +"!!, Welcome to your api</strong>"
	});
};

