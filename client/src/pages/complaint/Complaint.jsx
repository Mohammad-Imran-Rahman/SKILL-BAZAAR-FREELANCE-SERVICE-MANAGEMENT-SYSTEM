import React from 'react'
import "./Complaint.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useRef } from 'react';
import { useState } from 'react';
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

const Complaint = () => {
    let userImgRef = useRef()
    const [complaint, setComplaint] = useState({
        username: "",
        email: "",
        regarding: "",
        desc: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setComplaint((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData()
            formData.append("username", complaint.username)
            formData.append("email", complaint.email)
            formData.append("regarding", complaint.regarding)
            formData.append("desc", complaint.desc)
            for (let i = 0 ; i < userImgRef.files.length ; i++) {
                formData.append("photo", userImgRef.files[i])
            }
            //API Call
            const res = await newRequest.post("/complaint", formData, AxiosHeader);
            //redirect login Page
            if (res.status === 201) navigate("/")
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="complaint">
            <form onSubmit={handleSubmit}>
                <div className="left">
                    <h1>Complaint Form</h1>
                    <label htmlFor="">Name of the person against whom the complaint is filed:</label>
                    <input
                        name="username"
                        type="text"
                        placeholder="Emarn"
                        onChange={handleChange}
                    />
                    <label htmlFor="">Email of the person against whom the complaint is filed:</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        onChange={handleChange}
                    />
                    <label htmlFor="">The complaint is regarding:</label>
                    <input name="regarding" type="text" onChange={handleChange} />
                    <label htmlFor="">Picture (max: 5):</label>
                    <input type="file" ref={(input) => userImgRef = input} accept="image/*" multiple />
                    <label htmlFor="">The specific details of the complaint:</label>
                    <textarea
                        placeholder="A short description...."
                        name="desc"
                        id=""
                        cols="30"
                        rows="10"
                        onChange={handleChange}
                    ></textarea>
                    <button type="submit">File Complaint</button>
                </div>
            </form>
        </div>
    )
}

export default Complaint