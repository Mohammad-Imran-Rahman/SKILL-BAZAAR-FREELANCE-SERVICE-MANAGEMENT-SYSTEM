import React, { useReducer, useRef } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
const AxiosHeader = { headers: { "token": localStorage.getItem("token"), "Content-Type": "multipart/form-data" } }

const Add = () => {
  let gigsImgRef = useRef()

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //handle form data
    const formData = new FormData()
    formData.append("title", state.title)
    formData.append("cat", state.cat)
    formData.append("desc", state.desc)
    formData.append("shortTitle", state.shortTitle)
    formData.append("shortDesc", state.shortDesc)
    formData.append("deliveryTime", state.deliveryTime)
    formData.append("revisionNumber", state.revisionNumber)
    formData.append("features", state.features)
    formData.append("price", state.price)

    //handle multiple file
    for (let i = 0 ; i < gigsImgRef.files.length ; i++) {
      formData.append("photo", gigsImgRef.files[i])
    }
    // Api call
    const res = await newRequest.post("/gigs", formData, AxiosHeader);
    //redirect gigs page
    if(res.status===200) navigate("/mygigs")
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New offer</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="" disabled selected>Select one category</option>
              <option value="1">Web Development</option>
              <option value="2">Logo Design</option>
              <option value="3">WordPress</option>
              <option value="4">UI/UX Designe</option>
              <option value="5">Video Explainer</option>
              <option value="6">Social Media</option>
              <option value="7">SEO</option>
              <option value="8">Illustration</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  ref={(input)=>gigsImgRef=input}
                  multiple
                  accept="image/*"
                />
              </div>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
