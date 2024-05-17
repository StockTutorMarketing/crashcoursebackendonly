require("dotenv").config();
// const task = require("./cron/sendEmail")
// const nodeCron = require("node-cron");
// const { transporter } = require("./services/transporter");
const express = require("express");
const cors = require("cors");
const app = express();

const path = require("path")

//  Imports 
const { connection } = require("./db");
// const { UserModel } = require("./Model/user.model");

//  Middlewares 
app.use(cors());
app.use(express.json());

app.use("/api/v1", require("./Routes/routes"))
// task.start()

// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// const task = nodeCron.schedule('*/10 * * * *', async () => {
//   // console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
//   const users = await UserModel.find()
//   // console.log("Type of ",typeof(users));
//   // console.log(users);
//   for (let index = 0; index < users.length;) {
//     const mailOptions = {
//       from: 'uttamkr@uttamkrshaw.in',
//       to: `${users[index].email}`,
//       subject: 'Welcome To StockTutor Zoom Platform.',
//       text: 'This is a test email with attachment.',
//     };
//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error occurred:', error);
//         // Send error response to frontend
//       } else {
//         // Send success response to frontend
//         console.log("Email Send Successful",info);
//         index++
//       }
//     });

//   }
// });
// task.start()


//  Server Running 
app.listen(process.env.port || 5000, async () => {
  try {
    await connection;
    // task.start()
    console.log("Connected To Database");
    console.log(`Server is UP & Running on ${process.env.port || 4500}`);
  } catch (error) {
    console.log("Error", error.message);
  }
});