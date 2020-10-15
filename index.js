const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

require('dotenv').config();
// dotenv.config({path:'.env'})

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send(process.env.MAILTRAP_USER);
});

app.post("/api/form", (req, res) => {
  console.log(req.body);
  let data = req.body;
  let smtpTransport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  let mailOptions = {
    from: data.email,
    to: "mirovois@gmail.com",
    subject: `Message from ${data.name}`,
    html: `
    <h3>Information</h3>
    <ul>
      <li>Name: ${data.firstName}</li>
      <li>Lastname: ${data.lastName}</li>
      <li>Email: ${data.email}</li>

    </ul>
    <h3>Message</h3>
    <p>${data.message}</p>
    `,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(response);
      res.send("Success!!!");
    }
    smtpTransport.close();
  });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
