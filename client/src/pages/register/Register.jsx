import React, { useRef, useState } from "react";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  let userImgRef = useRef()
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("username", user.username)
      formData.append("email", user.email)
      formData.append("password", user.password)
      formData.append("photo", userImgRef.files[0])
      formData.append("country", user.country)
      formData.append("phone", user.phone)
      formData.append("isSeller", user.isSeller)
      formData.append("desc", user.desc)
      //API Call
      const res = await newRequest.post("/auth/register", formData);
      //redirect login Page
      if(res.status===200) navigate("/login")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="Emarn"
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="name@company.com"
            onChange={handleChange}
          />
          <label htmlFor="">Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Profile Picture</label>
          <input type="file" ref={(input)=>userImgRef=input} accept="image/*"/>
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+8801818567891"
            onChange={handleChange}
          />
          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
