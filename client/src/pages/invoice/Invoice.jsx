import React from 'react'
import "./Invoice.scss";
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import newRequest from '../../utils/newRequest';
import moment from 'moment';
import { useRef } from 'react';
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

const Invoice = () => {
    const { id } = useParams();
    let componentRef = useRef()
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const getOrderDetailsReq = async () => {
        try {
            const res = await newRequest.get(`/order/${id}`, AxiosHeader)
            setData(res.data)
        } catch (error) {
            setError(error)
        }
    }

    useEffect(() => {
        getOrderDetailsReq()
    }, [])

    const handlePrint = useReactToPrint({
        content: ()=> componentRef.current,
        documentTitle: 'Order-Aggrement',
        onAfterPrint: ()=>alert('Print successful')
    })

    return (
        <div class="container my-50">
            {
                data &&
                <>
                    <div ref={componentRef} style={{ width: '100%' }}>
                        <div class="brand-section">
                            <div class="row">
                                <div class="col-6">
                                    <h1 class="text-white">SkIll.BaZaR</h1>
                                </div>
                                <div class="col-6">
                                    <div class="company-details">
                                        <p class="text-white">assdad asd  asda asdad a sd</p>
                                        <p class="text-white">assdad asd asd</p>
                                        <p class="text-white">+91 888555XXXX</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="body-section">
                            <div class="row">
                                <div class="col-4">
                                    <h2 class="heading">Seller:</h2>
                                    <p class="sub-heading">Name: {data.sellerId.username} </p>
                                    <p class="sub-heading">Email: {data.sellerId.email} </p>
                                    <p class="sub-heading">Phone: {data.sellerId.phone ? data.sellerId.phone : ''} </p>
                                </div>
                                <div class="col-4">
                                    <h2 class="heading">Buyer:</h2>
                                    <p class="sub-heading">Name: {data.buyerId.username} </p>
                                    <p class="sub-heading">Email: {data.buyerId.email} </p>
                                    <p class="sub-heading">Phone: {data.buyerId.phone.length ? data.buyerId.phone : ''} </p>
                                </div>
                                <div class="col-4">
                                    <h2 class="heading">Details</h2>
                                    <p class="sub-heading">Tracking No.: fabcart2025 </p>
                                    <p class="sub-heading">Order Date: {moment(data.createdAt).format("D MMMM, YYYY")} </p>
                                    <p class="sub-heading">Order Status:  {data.isCompleted}</p>
                                </div>
                            </div>
                        </div>

                        <div class="body-section">
                            <h3 class="heading">Ordered Items</h3>
                            <br />
                            <table class="table-bordered">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th class="w-20">Price</th>
                                        <th class="w-20">Quantity</th>
                                        <th class="w-20">Total Pay</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{data.gigId.title}</td>
                                        <td>{data.gigId.price}$</td>
                                        <td>1</td>
                                        <td>{data.total ? `${data.gigId.price}$` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" class="text-right" >Skill Bazar commition (15%): </td>
                                        <td>{data.total ? `${(15 / 100) * data.gigId.price}$` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" class="text-right">Tax:</td>
                                        <td> 0$</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" class="text-right">Total:</td>
                                        <td>{data.total ? `${data.total}$` : ''}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            <h3 class="heading">Payment Status: {data.isCompleted === 'Completed' ? 'Paid' : 'Unpaid'}</h3>
                            <h3 class="heading">Payment Mode: {data.isCompleted === 'Completed' ? 'Card' : ''}</h3>
                        </div>

                        <div class="body-section">
                            <p>&copy; Copyright 2023 - SkIll.BaZaR All rights reserved.
                                <a href="http://localhost:5173/" class="float-right">www.skillbazar.com</a>
                            </p>
                        </div>
                    </div>
                    <button onClick={handlePrint} className='print float-right'>Print</button>
                </>
            }
        </div>
    )
}

export default Invoice
