import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver'
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import { useRef } from "react";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51NfkTxFVRE1akOJRqzsw9mBI7s8L3iNdCnHMxeRvsIQPIKjArc8SQvRdwvXhPVaRbkQ2pS0AELALJDTr09DlghbZ00VC4ZOuay");
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

const Orders = () => {
  let workRef = useRef()
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [update, setUpdate] = useState(false);

  const navigate = useNavigate();

  const allOrderReq = async () =>{
    setLoading(true)
    try {
      const res = await newRequest.get(`/order`, AxiosHeader)
      setLoading(false)
      setData(res.data)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
   }

  useEffect(()=>{
    allOrderReq()
    setUpdate(false)
  },[update])

  const handleContact = async (order) => {

    const userId = order.buyerId._id === getCurrentUser()._id ? order.gigId.userId : order.buyerId._id;

    try {
      const res = await newRequest.post(`/conversations`, { userId }, AxiosHeader);
      if (res.status === 200) {
        navigate(`/message/${res.data._id}`);
      }
    } catch (err) {
      console.log(err)
    }
  };

  const handleStatus = async (id, status) => {
    const res = await newRequest.put(`order/${id}`, { isCompleted: status }, AxiosHeader);
    if(res.status === 200) setUpdate(true);
  }

  const uploadFile = async (id) => {
    const formData = new FormData()
    formData.append("work", workRef.files[0])
    console.log(formData)
    const res = await newRequest.put(`order/${id}`, formData, AxiosHeader);
    if(res.status === 200) setUpdate(true);
  }

  const downloadImage = (url) => {
    saveAs(url, 'Work.jpg')
  }

  const hanglePayment = async (id) => {
    try {
      const stripe = await stripePromise
      const res = await newRequest.post(`/order/payment/${id}`, {}, AxiosHeader);
      localStorage.setItem("order_intend", res.data.stripeSession.id);
      await stripe.redirectToCheckout({
        sessionId: res.data.stripeSession.id
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : data.length ? (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              {
                getCurrentUser().isSeller &&
                <>
                  <th>Buyer Email</th>
                  <th>Amount</th>
                </>
              }
              <th>Status</th>
              <th>Action</th>
              <th>Invoice</th>
              <th>Contact</th>
            </tr>
            {data.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/gig/${order.gigId?._id}`}>
                    <img className="image" src={order.gigId?.photo[0].url} alt="" />
                  </Link>
                </td>
                <td>{order.gigId?.title<=50 ? order.gigId?.title : order.gigId?.title.slice(0, 50)+"..."}</td>
                <td>{order.gigId?.price}$</td>
                {
                  getCurrentUser().isSeller &&
                  <>
                  <td>{order.buyerId.email}</td>
                  <td>{order.total ? `${order.total}$` : ""}</td>
                  </>
                }
                <td>
                  {
                    (getCurrentUser().isSeller && (order.isCompleted === 'Pending' || order.isCompleted === 'In Progress')) ?
                      <label class="dropdown">
                        <div class="dd-button">
                          {order.isCompleted}
                        </div>
                        <input type="checkbox" class="dd-input" id="test" />
                        <ul class="dd-menu">
                          <li onClick={(e) => handleStatus(order._id, 'In Progress')}>In Progress</li>
                          <li onClick={(e) => handleStatus(order._id, 'Canceled')}>Canceled</li>
                        </ul>
                      </label>
                      :
                      <span>{order.isCompleted}</span>
                  }
                </td>
                <td>
                  {
                    getCurrentUser().isSeller ?
                      (
                        order.isCompleted === 'In Progress' &&
                        <div>
                          <input type="file" id="uploadBtn" onChange={() => uploadFile(order._id)} ref={(i) => workRef = i} />
                          <label htmlFor="uploadBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" /> <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" /> </svg>
                            Upload
                          </label>
                        </div>)
                      :
                      (
                        order.work &&
                        <div>
                          {
                            order.isCompleted === 'Delivered' ?
                              (<button className="payment" onClick={() => hanglePayment(order._id)} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z" clip-rule="evenodd"></path></svg>
                                Payment
                              </button>)
                              :
                              (order.isCompleted === 'Completed') ?
                                (<button onClick={() => downloadImage(order.work.url)} >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" /> <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" /> </svg>
                                  Download
                                </button>)
                                :
                                <></>
                          }
                        </div>
                      )
                  }
                </td>
                <td>
                  <Link to={`/invoice/${order._id}`}>
                    <svg style={{cursor:'pointer'}} id="changeColor" fill="#DC7633" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" zoomAndPan="magnify" viewBox="0 0 375 374.9999" height="30" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><path id="pathAttribute" d="M 7.09375 7.09375 L 367.84375 7.09375 L 367.84375 367.84375 L 7.09375 367.84375 Z M 7.09375 7.09375 " fill="#f41515"></path></defs><g><path id="pathAttribute" d="M 187.46875 7.09375 C 87.851562 7.09375 7.09375 87.851562 7.09375 187.46875 C 7.09375 287.085938 87.851562 367.84375 187.46875 367.84375 C 287.085938 367.84375 367.84375 287.085938 367.84375 187.46875 C 367.84375 87.851562 287.085938 7.09375 187.46875 7.09375 " fill-opacity="1" fill-rule="nonzero" fill="#f41515"></path></g><g id="inner-icon" transform="translate(85, 75)"> <svg xmlns="http://www.w3.org/2000/svg" width="199.8" height="199.8" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16" id="IconChangeColor"> <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" id="mainIconPathAttribute" fill="#ffffff"></path> <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z" id="mainIconPathAttribute" fill="#ffffff"></path> </svg> </g></svg>
                  </Link>
                </td>
                <td>
                  <img
                    className="message"
                    src="./img/message.png"
                    alt=""
                    onClick={() => handleContact(order)}
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <div style={{ padding: '100px 0px', fontSize: '24px', fontWeight: '700' }}>No Order Done Yet</div>
      )}
    </div>
  );
};

export default Orders;
