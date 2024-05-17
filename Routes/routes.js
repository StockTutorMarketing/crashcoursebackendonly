const { newOrderId, checkStatus } = require("../Controller/cashfree")
const express = require("express");
const { sendMail } = require("../cron/sendEmail");
const router = express();
router.post("/payment", newOrderId)
router.get("/status/:orderid",checkStatus)
router.get("/sendmails",sendMail)

module.exports = router