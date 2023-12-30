import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";
const AxiosHeader = { headers: { "token": localStorage.getItem("token") } }

const Reviews = ({ gigId }) => {
  const [show, setShow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  
  const check = async() =>{
    try {
      const result = await newRequest.get(`/reviews/check/${gigId}`, AxiosHeader)
      setShow(result.data.found)
    } catch (error) {
      console.log(error)
    }
  }

  const allReviewRequest = async () =>{
    setLoading(true)
    try {
      const result = await newRequest.get(`/reviews/${gigId}`)
      setData(result.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(true)
      console.log(error)
    }
  }
   useEffect(()=>{
    allReviewRequest()
    check()
   },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    const result =  await newRequest.post("/reviews", { gigId, desc, star }, AxiosHeader);
    if(result.status === 200) setData([...data, result.data])
  };

  return (
    <div className="reviews">
      {
        data?.length>0 && <h2>Reviews</h2>
      }
      {isLoading
        ? "loading"
        : error
          ? "Something went wrong!"
          : data?.map((review) => <Review key={review._id} review={review} />)}
      {
        show &&
        <div className="add">
          <h3>Add a review</h3>
          <form action="" className="addForm" onSubmit={handleSubmit}>
            <input type="text" placeholder="write your opinion" />
            <select name="" id="">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            <button>Send</button>
          </form>
        </div>
      }
    </div>
  );
};

export default Reviews;
