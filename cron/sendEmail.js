const nodeCron = require("node-cron");

const sendMail = async (req, res) => {
    const task = nodeCron.schedule('* * * * *', () => {
        console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
    });
    task.start()
}
module.exports = { sendMail }