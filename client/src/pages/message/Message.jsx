import ReactScrollableFeed from 'react-scrollable-feed'
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { socket } from '../../components/navbar/Navbar';
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

export var selectedChatCompare

const Message = () => {
  const renderRun = useRef(false)
  const tempMsg = useRef([])
  const [data, setData] = useState([])
  const [newMsg, setNewMsg] = useState(null)
  const [chat, setChat] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { id } = useParams();

  const getSender = (users, loggedUser) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0]
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chatId = id
    const content = e.target[0].value;
    const result = await newRequest.post("/messages", { chatId, content, }, AxiosHeader);
    if (result.status === 200) {
      setData([...data, result.data])
      e.target[0].value = ""
      socket.emit("new msg", result.data)
    }
  };

  const allMessageRequest = async () => {
    setLoading(true)
    try {
      const result = await newRequest.get(`/messages/${id}`, AxiosHeader)
      setData(result.data.msg)
      tempMsg.current = result.data.msg
      setChat(result.data.chat)
      socket.emit('join chat', id)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(true)
      console.log(error)
    }
  }

  useEffect(() => {
    allMessageRequest()
  }, [id])

  useEffect(() => {
    if (renderRun.current === false) {
      socket.on("msg recieved", (newMsgRecieved) => {
        setData([...tempMsg.current, newMsgRecieved])
      })
      return () => { renderRun.current = true }
    }
  }, [])

  return (
    <div className="message">
      <div className="container">
        {
          chat &&
          <span className="breadcrumbs">
            <Link to="/messages">Messages</Link> {" > " + getSender(chat?.users, getCurrentUser())?.username}
          </span>
        }
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : data.length ? (
          <div className="messages">
            <ReactScrollableFeed className='msg-box'>
              {data?.map((m) => (
                <div className={m.sender._id === getCurrentUser()._id ? "owner item" : "item"} key={m._id}>
                  {
                    m.sender._id !== getCurrentUser()._id &&
                    <img
                      src={getSender(chat.users, getCurrentUser())?.photo?.url}
                      alt=""
                    />
                  }
                  <p>{m.content}</p>
                </div>
              ))}
            </ReactScrollableFeed>
          </div>
        ) : (
          <div>No conversation done yet.</div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
