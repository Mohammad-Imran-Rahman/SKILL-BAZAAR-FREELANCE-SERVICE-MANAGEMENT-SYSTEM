import React, { Fragment, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

const Success = () => {
  const renderRun = useRef(false)
  // const { search } = useLocation();
  const navigate = useNavigate();
  // const params = new URLSearchParams(search);
  // const payment_intent = params.get("payment_intent");

  useEffect(() => {
    if (renderRun.current === false) {
      const makeRequest = async () => {
        try {
          const res = await newRequest.put("/order", { order_intend: localStorage.getItem("order_intend") }, AxiosHeader);
          if (res.status === 200) {
            localStorage.removeItem("order_intend")
            setTimeout(() => {
              navigate("/orders");
            }, 4000);
          }
        } catch (err) {
          console.log(err);
        }
      };

      makeRequest();
      return () => { renderRun.current = true }
    }
  }, []);

  return (
    <Fragment>
      <div className='success'>
        <div className='success-container'>
          <div className="text-xl">Thanks for your order</div>
          <div className="text-lg">Your order has been placed successfully</div>
          <svg viewBox="0 0 24 24" class="icon text-green-600 w-16 h-16 mx-auto mt-6 mb-2">
            <path fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
            </path>
          </svg>
          <span className="text-base">
            Payment successful
          </span>
          <div className='text-sm md:text-base font-medium'>
            You are being redirected to the orders page. Please do not close the page.
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Success;
