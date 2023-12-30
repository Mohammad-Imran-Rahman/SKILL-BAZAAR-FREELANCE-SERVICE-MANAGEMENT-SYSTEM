import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Cancel.scss";

const Cancel = () => {
    const renderRun = useRef(false)
    const navigate = useNavigate();
    useEffect(() => {
        if (renderRun.current === false) {
                localStorage.removeItem("order_intend")
                setTimeout(() => {
                  navigate(`/orders`);
                }, 4000);
          return () => { renderRun.current = true }
        }
      }, []);
  return (
    <Fragment>
      <div className='success'>
        <div className='success-container'>
          <div className="text-xl">opps!</div>
          <div className="text-lg">Your order has been failed.</div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle icon" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
          <span className="text-base">
            Payment failed
          </span>
          <div className='text-sm md:text-base font-medium'>
            You are being redirected to the gig page. Please do not close the page.
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Cancel