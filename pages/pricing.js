import Header from "../components/Header";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
export default function IndexPage() {
  const paypalCreateOrder = async (price) => {
    try {
      let response = await axios.post(
        "/api/paypal/createorder",
        {
          order_price: price,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response);
      return response.data.data.order;
    } catch (err) {
      // Your custom code to show an error like showing a toast:
      // toast.error('Some Error Occured')
      return null;
    }
  };
  const paypalCaptureOrder = async (orderID) => {
    try {
      let response = await axios.post(
        "/api/paypal/captureorder",
        {
          orderID,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success) {
        console.log("pay success");
        // Order is successful
        // Your custom code

        // Like showing a success toast:
        // toast.success('Amount Added to Wallet')

        // And/Or Adding Balance to Redux Wallet
        // dispatch(setWalletBalance({ balance: response.data.data.wallet.balance }))
      }
    } catch (err) {
      // Order is not successful
      // Your custom code
      // Like showing an error toast
      // toast.error('Some Error Occured')
    }
  };
  return (
    <div>
      <Header></Header>
      <div className="h-24 "></div>
      <h1 className="mt-4 text-4xl font-bold text-center">Choose Your Plan</h1>
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center md:gap-8">
          {/* free plan */}
          <div className="p-6 border border-gray-200 shadow-sm rounded-2xl sm:px-8 lg:p-12 min-height">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                <span className="font-bold ">Free</span>
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  $0{" "}
                </strong>

                {/* <span className="text-sm font-medium text-gray-700">
                  /month
                </span> */}
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> 30 credits</span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700">
                  {" "}
                  Free Trial on First Sign Up{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Image canvas Tools </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Free image download </span>
              </li>
            </ul>

            {/* <a
              href="#"
              className="block px-12 py-3 mt-8 text-sm font-medium text-center text-indigo-600 bg-white border border-indigo-600 rounded-full hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            >
              Get Started
            </a> */}
          </div>
          {/* pro plan */}
          <div className="p-6 border border-indigo-600 shadow-sm rounded-2xl ring-1 ring-indigo-600 sm:px-8 lg:p-12 min-height">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Pro
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  $29.9{" "}
                </strong>

                {/* <span className="text-sm font-medium text-gray-700">
                  /month
                </span> */}
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> 2000 credits </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> No time limit </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Free image download </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Image canvas Tools </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-xs text-gray-700 ">
                  {" "}
                  $0.075 / per image remove background{" "}
                </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-xs text-gray-700 ">
                  {" "}
                  $0.15 / per image Upscale{" "}
                </span>
              </li>
            </ul>

            <PayPalScriptProvider
              options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                fundingSource="paypal"
                className="mt-8"
                style={{
                  color: "silver",
                  shape: "pill",
                  label: "buynow",
                  height: 46,
                }}
                createOrder={async (data, actions) => {
                  let order_id = await paypalCreateOrder(29.9);
                  return order_id + "";
                }}
                onApprove={async (data, actions) => {
                  let response = await paypalCaptureOrder(data.orderID);
                  if (response) return true;
                }}
              />
            </PayPalScriptProvider>
          </div>
          {/* basic plan */}
          <div className="p-6 border border-gray-200 shadow-sm rounded-2xl sm:px-8 lg:p-12 min-height">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                <span className="font-bold">Basic</span>
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  $9.9{" "}
                </strong>

                {/* <span className="text-sm font-medium text-gray-700">
                  /month
                </span> */}
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> 500 credits </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> No time limit </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Free image download </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Image canvas Tools </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-xs text-gray-700 ">
                  {" "}
                  $0.099 / per image remove background{" "}
                </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-xs text-gray-700 ">
                  {" "}
                  $0.198 / per image Upscale{" "}
                </span>
              </li>
            </ul>

            {/* <a
              href="#"
              className="block px-12 py-3 mt-8 text-sm font-medium text-center text-indigo-600 bg-white border border-indigo-600 rounded-full hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            >
              Get Started
            </a> */}
            <PayPalScriptProvider
              options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                fundingSource="paypal"
                className="mt-8"
                style={{
                  color: "silver",
                  shape: "pill",
                  label: "buynow",
                  height: 46,
                }}
                createOrder={async (data, actions) => {
                  let order_id = await paypalCreateOrder(9.9);
                  return order_id + "";
                }}
                onApprove={async (data, actions) => {
                  let response = await paypalCaptureOrder(data.orderID);
                  if (response) return true;
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
