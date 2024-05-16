import client from "../../utils/paypal";
import paypal from "@paypal/checkout-server-sdk";
import jwt from "jsonwebtoken";
import { sql } from "@vercel/postgres";

export default async function Handler(req, res) {
    let token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    throw new Error("invalid user");
  }

  if (req.method != "POST")
    return res.status(404).json({ success: false, message: "Not Found" });

  if (!req.body.orderID)
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Order ID" });

  //Capture order to complete payment
  const { orderID } = req.body;
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});
  const response = await PaypalClient.execute(request);

  let credits = 500
  if (!response) {
    return res
      .status(500)
      .json({ success: false, message: "Some Error Occured at backend" });
  } else {
    console.log(response);
    let payResult = response.result
    if (payResult.status === 'COMPLETED') {
        
        await sql`
            UPDATE fancy_order 
            SET paypal_status = ${payResult.status},
                updated_at = ${new Date()}
            WHERE paypal_id = ${payResult.id}
        `;
        await sql`
        UPDATE fancy_user 
        SET credits = credits + ${credits},
        is_paid_user = ${true}
        WHERE id = ${decoded.userId}
    `;
    }
  }

  // Your Custom Code to Update Order Status
  // And Other stuff that is related to that order, like wallet
  // Here I am updateing the wallet and sending it back to frontend to update it on frontend

  res.status(200).json({ success: true, data: { status: 'pay success', credits } });
}
