import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./users.css";


export const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const { user } = useContext(AuthContext);
  const [blockedUsers, setBlockedUsers] = useState([])
  const { loading, error, dispatch } = useContext(AuthContext);

  const fetchUsers = async () => {
    const res = await axios.get("/auth");
    const users_to_add = []
    const users_to_block = []
    for (const other_user of res.data) {
      if (user?.blocked_users?.includes(other_user._id) || other_user?.blocked_users?.includes(user._id)) {
        users_to_block.push(other_user)
        continue
      }
      users_to_add.push(other_user)
      
    }
    setUsers(users_to_add)
    setBlockedUsers(users_to_block)
  }

  const handleFriend = async (user_id) => {
    const res = await axios.put("/auth/sendFriend/" + user_id, {my_name: user.username})
  }

  const handleBlock = async (user_id) => {
    const res = await axios.put("/auth/block/" + user._id, {user_id: user_id})
    console.log(res.data)
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
    setBlockedUsers((prevUsers) => [...prevUsers, user_id]);
  }

  const handleChange = async (e) => {
    if (e.target.id === "name") {
      if (e.target.value.length > 2) {
        setName(e.target.value);
      } else {
        setName("")
      }
    }
    const res = await axios.post("/auth/name", {username: name})
    const users_to_add = []
    const users_to_block = []
    for (const other_user of res.data) {
      if (user?.blocked_users?.includes(other_user._id) || other_user?.blocked_users?.includes(user._id)) {
        users_to_block.push(other_user)
        continue
      }
      users_to_add.push(other_user)
      
    }
    setUsers(users_to_add)
    setBlockedUsers(users_to_block)
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, []);

  return (
    <>
      {user ? (
        <>
          <div className="mislibrardos-main-div">
          <h1 style={{marginTop:"15px", fontSize:"48px"}} className="mislibrardos-title">Librardos</h1>
            <h2 className="mislibrardos-sub-title">Lista de usuarios</h2>
            <input id="name" placeholder="name" type="text" onChange={handleChange} required className="loginInput" />
            <div className="mislibrardos-container">
              <ul className="mislibrardos-sub-container">
              {users
  .filter((other_user) => !blockedUsers.includes(other_user._id))
  .map((other_user) => (
    <div className="mislibrardos-sub-container-div" key={other_user._id}>
      <li className="mislibrardos-name-container">
        <Link
          className="btn btn-secondary button-mislibrardos-update"
          to={"/user/" + other_user._id}
        >
          <span className="mislibrardos-name">{other_user.username}</span>
          <img className="avatar" src={other_user.photo_url ? other_user.photo_url : "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"} alt="Profile picture"/>
        </Link>
        {user.username !== other_user.username ? (
          <>
            { !user.friends.includes(other_user.username) && ( <button
              className="btn btn-secondary"
              onClick={() => handleFriend(other_user._id)}
              style={{marginLeft:"5px"}}
            >
              Enviar solicitud de amistad
            </button>
            )}
            <button
            style={{marginLeft:"5px"}}
              className="btn btn-danger"
              onClick={() => handleBlock(other_user._id)}
            >
              Bloquear
            </button>
          </>
        ) : (
          <></>
        )}
      </li>
    </div>
  ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div>
          Necesita estar conectado
        </div>
      )}
    </>
  );
};
