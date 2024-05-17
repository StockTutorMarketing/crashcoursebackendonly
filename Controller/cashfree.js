require("dotenv").config();
const axios = require("axios")
const uniqid = require('uniqid');
const { UserModel } = require("../Model/user.model");
const { transporter } = require("../services/transporter");

const newOrderId = async (req, res) => {
    try {
        const { name, email, phone, price } = req.body
        let orderid = uniqid('order-')
        let customerid = uniqid('customer-')
        const options = {
            method: 'POST',
            url: `${process.env.cashfreeUrl}/pg/orders`,
            headers: {
                accept: 'application/json',
                'x-api-version': process.env.apiversion,
                'content-type': 'application/json',
                'x-client-id': process.env.cashfree_app_id,
                'x-client-secret': process.env.cashfree_secret_key
            },
            data: {
                customer_details: {
                    customer_id: customerid,
                    customer_email: email,
                    customer_phone: phone,
                    customer_name: name
                },
                order_id: orderid,
                order_amount: price,
                order_currency: "INR"
            }
        };
        axios
            .request(options)
            .then(async function (response) {
                try {
                    const user = new UserModel({ name: name, email: email, price: price, phone: phone, sessionid: response.data.payment_session_id, orderid: orderid, customerid: customerid, });
                    await user.save();
                    return res.json({ status: "success", message: response.data.payment_session_id })
                } catch (error) {
                    console.log(error.message)
                }
            })
            .catch((error) => {
                return res.json({ status: "error", message: error.message })
            })

    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
}


const checkStatus = async (req, res) => {
    const orderid = req.params.orderid;
    try {
        const options = {
            method: 'GET',
            url: `${process.env.cashfreeUrl}/pg/orders/${orderid}`,
            headers: {
                accept: 'application/json',
                'x-api-version': process.env.apiversion,
                'x-client-id': process.env.cashfree_app_id,
                'x-client-secret': process.env.cashfree_secret_key
            }
        }
        axios
            .request(options)
            .then(async function (response) {
                if (response.data.order_status == "PAID") {
                    const order = await UserModel.findOne({ orderid: orderid })
                    order.paymentstatus = true
                    await order.save()
                    // Sending Mail 
                    const mailOptions = {
                        from: 'uttamkrshaw@iclimbs.com',
                        to: `${order.email}`,
                        subject: 'Welcome To StockTutor Zoom Platform.',
                        text: 'hello world !!',
                        html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Email Tempelate</title>
                            <link rel="preconnect" href="https://fonts.googleapis.com">
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                            <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
                            <!-- <link rel="stylesheet" href="styles.css"> -->
                            <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet">
                            <link rel="shortcut icon" href="https://stocktutor.in/fav.png" type="image/x-icon">
                            <style>
                                *{
                            margin: 0%;
                            padding: 0%;
                            font-family: "Roboto", sans-serif;
                        }
                        .banner img{
                            width: 100%;
                        }
                        .content-container{
                            padding: 40px 40px 40px 40px;
                        }
                        .content-container p{
                            font-size: 16px;
                            color: #2b2b2b;
                            margin: 40px 0px 40px 0px;
                            font-weight: 400;
                        }
                        .content-container i{
                            font-size: 12px;
                            padding-right: 12px;
                        }
                        .content-container .zoom-btn{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                        .content-container .zoom-btn a{
                            padding: 12px 60px 12px 60px;
                            border-radius: 20px;
                            color: #050845;
                            background-color: transparent;
                            border: 1px solid #050845;
                            font-size: 20px;
                            font-weight: 500;
                            text-decoration: none;
                        }
                        .content-container a:hover{
                            cursor: pointer;
                            background-color: #050845;
                            color: aliceblue;
                            transition: 1s ease;
                        }
                      
                          
                            </style>
                        </head>
                        
                        <body>
                            <div class="banner">
                                <img src="https://stocktutor.in/bannr.png" alt="Banner">
                            </div>
                            <div class="content-container">
                                <p>Hey ${order.name},</p>
                                <p><span><i class="em em-wave" aria-role="presentation" aria-label="WAVING HAND SIGN"></i></span>Get ready to kickstart your journey to Stock Market Success with StockTutor!<span><i class="em em-tada" aria-role="presentation" aria-label="PARTY POPPER"></i></span></p>
                                <p>Congratulations on securing your spot in our Crash Course! You're officially on the path to financial empowerment.<span><i class="em em-bulb" aria-role="presentation" aria-label="ELECTRIC LIGHT BULB"></i></span><span><i class="em em-money_with_wings" aria-role="presentation" aria-label="MONEY WITH WINGS"></i></span></p>
                                <p><span><i class="em em-rocket" aria-role="presentation" aria-label="ROCKET"></i></span>Get set to dive into the world of stocks! No more boring lectures or confusing terms—we've got you covered!<span><i class="em em-chart_with_upwards_trend" aria-role="presentation" aria-label="CHART WITH UPWARDS TREND"></i></span><span><i class="em em-rocket" aria-role="presentation" aria-label="ROCKET"></i></span></p>
                                <p><span><i class="em em-muscle" aria-role="presentation" aria-label="FLEXED BICEPS"></i></span>Get ready for an exciting journey packed with expert tips, game-changing strategies, and those "aha" moments you've been waiting for. You'll be trading like a pro before you know it!<span><i class="em em-briefcase" aria-role="presentation" aria-label="BRIEFCASE"></i></span><span><i class="em em-boom" aria-role="presentation" aria-label="COLLISION SYMBOL"></i></span></p>
                                <p><span><i class="em em-mortar_board" aria-role="presentation" aria-label="GRADUATION CAP"></i></span>So sit back, relax, and let the learning begin! Our first Zoom meeting is scheduled for 2nd June - 4PM, Here's the link to join:</p>
                                <div class="zoom-btn">
                                    <a href="https://us06web.zoom.us/j/88235740291?pwd=YxtVMAELo9ejky2rK91Y8MLhXo4sBK.1" target="_blank">Join Now</a>
                                </div>
                                
                                <p>Let's make your financial dreams a reality!<span><i class="em em-star2" aria-role="presentation" aria-label="GLOWING STAR"></i></span><span><i class="em em-moneybag" aria-role="presentation" aria-label="MONEY BAG"></i></span></p>
                                <p>See you in the virtual classroom,</p>
                                <p style=" margin-bottom: 4px; margin-top: 2px;">Regards,</p>
                                <p style=" margin-bottom: 2px; margin-top: 8px;">Team StockTutor</p>
                            </div>
                        </body>
                        
                        </html>`,
                    };
                    // Send email
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Error occurred:', error);
                            // Send error response to frontend
                            return res.json({ success: false, error: 'Failed to send email' });
                        } else {
                            console.log('Email sent:', info.response);
                            // Send success response to frontend
                            return res.redirect(`${process.env.successurl}`);
                        }
                    });
                    // return res.redirect(`http://localhost:3000/success`)
                } else {
                    let terminateStatus = await changeToTerminateStatus(orderid)
                    if (terminateStatus.order_status == "TERMINATION_REQUESTED") {
                        let terminatereason = await getTerminateReason(orderid)
                        if (terminatereason[0].payment_status == 'FAILED') {
                            let reason = terminatereason[0].error_details.error_description_raw;
                            const order = await UserModel.findOne({ orderid: orderid })
                            order.failurereason = reason
                            await order.save()
                            return res.redirect(`${process.env.failureurl}`)
                        } else {
                            return res.redirect(`${process.env.failureurl}`)
                        }
                    } else {
                        return res.redirect(`${process.env.failureurl}`)
                    }
                }
            })
    } catch (error) {
        return res.json({ status: "error", message: error.message })
    }
}

const changeToTerminateStatus = async (props) => {
    const response = await fetch(`${process.env.cashfreeUrl}/pg/orders/${props}`, {
        method: 'PATCH',
        headers: {
            accept: 'application/json',
            'x-api-version': process.env.apiversion,
            'content-type': 'application/json',
            'x-client-id': process.env.cashfree_app_id,
            'x-client-secret': process.env.cashfree_secret_key
        },
        body: JSON.stringify({
            order_status: "TERMINATED"
        })
    })
    const result = await response.json()
    return result
}

const getTerminateReason = async (props) => {
    const response = await fetch(`${process.env.cashfreeUrl}/pg/orders/${props}/payments`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-api-version': process.env.apiversion,
            'x-client-id': process.env.cashfree_app_id,
            'x-client-secret': process.env.cashfree_secret_key
        }

    })
    const result = await response.json()
    return result
}

module.exports = { newOrderId, checkStatus }