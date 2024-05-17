const nodeCron = require("node-cron");

const task = nodeCron.schedule('* * * * *', () => {
    console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
});