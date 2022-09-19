import axios from "axios";
import { useEffect, useState } from "react";
import "./mentorconversation.css";

export default function MentorConversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("http://localhost:8800/api/users/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={require("../../assets/noAvatar.png")}
        alt=""
      />
      <span className="conversationName">{user?.name}</span>
    </div>
  );
}
