/* eslint-disable no-unused-vars */
import "./userloginrequest.css";
import Moment from "moment";
import axios from "axios";

export default function Userloginrequest({ request }) {
  const authorizeUser = async () => {
    const res = await axios.get(
      `http://localhost:8800/api/userAuth/authorizeuser/${request._id}`
    );
  };

  const handleClick = async (e) => {
    authorizeUser();
    e.preventDefault();
  };

  return (
    <div className="usercardcontainer">
      <div class="card text-center">
        <div class="card-header">Requested user details</div>
        <div class="card-body">
          <h5 class="card-title">Name : {request.name}</h5>
          <p class="card-text">Username : {request.username}</p>
          <p class="card-text">Email : {request.email}</p>
          <p class="card-text">Favourite Book : {request.favBook}</p>
          <p class="card-text">Favourite Movie Quote : {request.movieQuote}</p>
          <p class="card-text">DateOfBirth : {request.dob}</p>
          <p class="card-text">Why Here? : {request.ydesc}</p>
          <button
            onClick={handleClick}
            type="button"
            class="btn btn-outline-success"
          >
            Authorize
          </button>
        </div>
        <div class="card-footer text-muted">
          {Moment(request.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
}
