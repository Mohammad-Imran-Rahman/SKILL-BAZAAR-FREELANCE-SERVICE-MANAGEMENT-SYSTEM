import React from "react";
import "./Gig.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import getCurrentUser from "../../utils/getCurrentUser";
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate()

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  const handleContact = async (userId) => {
    try {
      const res = await newRequest.post(`/conversations`, { userId }, AxiosHeader);
      if (res.status === 200) {
        navigate(`/message/${res.data._id}`);
      }
    } catch (err) {
      console.log(err)
    }
  };

  const onOrder = async () =>{
    try {
          const res = await newRequest.post(`/order/${id}`, {}, AxiosHeader);
          if(res.status === 201) navigate("/orders");
        } catch (error) {
          console.log(error)
        }
  }

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              SkiLL Bazaar {">"} Graphics & Design {">"}
            </span>
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.photo?.url || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>({dataUser.username})</span>
                {!isNaN(data.totalStars / data.starNumber) ? (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>({Math.round(data.totalStars / data.starNumber)})</span>
                  </div>
                ) : (
                  <span>Not Rated</span>
                )}
              </div>
            )}
            {/* <Carousal slidesToShow={1} arrowsScroll={1}> */}
            <div className="image-content">
              {data.photo?.map((img) => (
                <img key={img} src={img.url} alt="gig img" className="gig-image" />
              ))}
            </div>
            {/* </Carousal> */}
            <h2>About This offer</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.photo?.url || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) ? (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          ({Math.round(data.totalStars / data.starNumber)})
                        </span>
                      </div>
                    ) : (
                      <span>Not Rated</span>
                    )}
                    {
                      getCurrentUser() && !getCurrentUser().isSeller &&
                      <button onClick={() => handleContact(data.userId)}>Contact Me</button>
                    }
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>{data.deliveryTime} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {
                data.features[0].split(",").map((feature, i) =>
                  <div className="item" key={i}>
                    <img src="/img/greencheck.png" alt="" />
                    <span>{feature}</span>
                  </div>
                )}
            </div>
            {
              getCurrentUser() && !getCurrentUser()?.isSeller &&
              <button onClick={onOrder}>Place Order</button>
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
