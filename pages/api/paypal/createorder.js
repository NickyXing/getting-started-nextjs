import client from "../../utils/paypal";
import paypal from "@paypal/checkout-server-sdk";
import jwt from "jsonwebtoken";
import { sql } from "@vercel/postgres";

export default async function Handler(req, res) {
  let token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  if (!decoded) {
    throw new Error("invalid user");
  }

  if (req.method != "POST")
    return res.status(404).json({ success: false, message: "Not Found" });

  if (!req.body.order_price)
    return res.status(400).json({
      success: false,
      message: "Please Provide order_price And User ID",
    });

  try {
    const PaypalClient = client();
    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers["prefer"] = "return=representation";
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: req.body.order_price + "",
          },
        },
      ],
    });
    const response = await PaypalClient.execute(request);
    if (response.statusCode !== 201) {
      console.log("RES: ", response);
      return res
        .status(500)
        .json({ success: false, message: "Some Error Occured at backend" });
    } else {
        console.log(response);
        let payResult = response.result
        let order = payResult.id
        await sql`INSERT INTO fancy_order (email, user_id, order_no, price, paypal_id, paypal_intent, paypal_status)
        VALUES (${decoded.email}, ${decoded.userId}, ${order}, ${req.body.order_price}, ${payResult.id}, ${payResult.intent}, ${payResult.status});`;
        res.status(200).json({ success: true, data: { order } });
    }
    // Your Custom Code for doing something with order
    // Usually Store an order in the database like MongoDB

    
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Could Not Found the user" });
  }
}

function generateOrderNo() {
    // 获取当前日期和时间
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
  
    // 生成随机数
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // 生成 100,000 到 999,999 之间的随机数
  
    // 拼接订单号
    const orderNo = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}-${randomNum}`;
  
    return orderNo;
  }
