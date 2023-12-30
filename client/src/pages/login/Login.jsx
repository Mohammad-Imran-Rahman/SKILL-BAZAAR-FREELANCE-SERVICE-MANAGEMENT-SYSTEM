import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { email, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);
      if(res.status===200) navigate("/")
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Email</label>
        <input
          name="email"
          type="text"
          placeholder="name@company.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && error}
      </form>
    </div>
  );
}

export default Login;
