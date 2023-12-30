import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";
import getCurrentUser from "../../utils/getCurrentUser";
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`, AxiosHeader).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`, {}, AxiosHeader);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  const getSender = (users, loggedUser) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0]
  }

  return (
    <div className="messages">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <tr>
              <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
              <th>Last Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
            {data.map((c) => (
              <tr
                className={
                  !c.readBy.find(item=>item===getCurrentUser()._id) &&
                  "active"
                }
                key={c.id}
              >
                <td>{getSender(c.users, getCurrentUser())?.username}</td>
                <td>
                  <Link to={`/message/${c._id}`} className="link" onClick={() => handleRead(c._id)}>
                    {c?.latestMessage?.content?.length<80 ? c?.latestMessage?.content : c?.latestMessage?.content.slice(0, 80)+"..."}
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>
                  {!c.readBy.find(item=>item===getCurrentUser()._id) ? (
                    <button onClick={() => handleRead(c._id)}>
                      Mark as Read
                    </button>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
