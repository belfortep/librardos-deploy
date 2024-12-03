import React, { useContext } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Footer } from '../../components/Footer/Footer'
import CommunityNameChange from '../../components/NameChangeWindow/NameChangeWindow';
import Moment from 'react-moment'
import { AuthContext } from '../../context/AuthContext';
import './community.css';
import moment from 'moment';

export const Community = () => {
  const [community, setCommunity] = useState({});
  const [messages, setMessages] = useState([]);
  const [responseMessages, setResponseMessages] = useState([])
  const {loading, error, dispatch } = useContext(AuthContext);
  const [communities, setCommunities] = useState([])
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [replyingTo, setReplyingTo] = useState(undefined);
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");
  const {user} = useContext(AuthContext);
  const params = useParams()
  const navigate = useNavigate();

  const [isReversed, setIsReversed] = useState(true);

  const handleMessagesClick = () => {
    setIsReversed((prev) => !prev);
    setMessages((prevMessages) => [...prevMessages].reverse());
  };

  const handleChange = (e) => {
    if (e.target.id === "message") {
      setMessage(e.target.value)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/community/message/" + params.id, {username: user.username, message: message, father_id: replyingTo});
    setMessage("")
    setReplyingTo(undefined)
    await fetchCommunity()
  };

  const inviteMod = async (invitedId) => {
    await axios.put("/api/community/sendModeratorRequest/" + params.id, {user_id: invitedId});
  }
  const deleteFromCommunity = async (userId) => {
    await axios.post("/api/community/exit/" + params.id, { id: userId });
    user.communities = user.communities.filter(communityId => communityId !== params.id);
    await fetchCommunity()
  }

  const handleExit = async (id) => {
    await axios.post("/api/community/exit/" + id, { id: user._id });
    user.communities = user.communities.filter(communityId => communityId !== id);
    navigate("/")
  }

  const deleteCommunity = async (id) => {
    await axios.delete("/api/community/" + id);
    navigate("/")
  }

  const deleteMessage = async (message) => {
    const id_msg = message._id;
    await axios.delete("/api/community/message/" + params.id, {data: {message_id: id_msg}});

    // await axios.delete("/api/community/message/" + params.id, {data: {id_msg: id_msg}});
    await fetchCommunity()
  }

  const setSpam = async (message) => {
    const id_msg = message._id;
    const spam = !message.spam
    await axios.put("/api/message/" + id_msg, {spam: spam});

    await fetchCommunity()
  }

  const setPingMsg = async (message) => {
    const id_msg = message._id;
    const ping = !message.ping
    await axios.put("/api/message/" + id_msg, {ping: ping});

    await fetchCommunity()
  }



  const modifyCommunityName = async (id) => {
    // const newName = prompt("Ingrese el nuevo nombre de la comunidad:");
    if (newName) {
      await axios.patch("/api/community/" + id, { name: newName });
    }
  }

  const handleReplyMessage = async (id) => {
    setReplyingTo(id)
    if (id === replyingTo) {
      setReplyingTo(undefined)
    }
  }

  const handleJoin = async (id) => {
    try {
      await axios.post("/api/community/" + id, { id: user._id });
      navigate("/community/" + id)
    } catch (err) {
      alert("Ya formas parte de esta comunidad")
    }
    
  }
  

  const fetchCommunity = async () =>{
    let res = await axios.get("/api/community/" + params.id);
    const today = new Date();
    const formattedDate = today.toISOString();
    const res_user = await axios.put("/auth/user/" + user._id, {last_time_in_community: formattedDate});
    dispatch({ type: "LOGIN_SUCCESS", payload: res_user.data.details });


    if (res.data) {
      setCommunity(res.data);
      const users = [];
      if (res.data.users.length === 0) {
        await deleteCommunity(params.id);
      }
      const admin_id = res.data.users[0] // ? El primero que la creo es el admin (?)
      setIsAdmin(admin_id == user._id)
      
      setIsMod(res.data?.moderators.includes(user._id))

      for (const user_data of res.data.users) {
          const response = await axios.get("/auth/" + user_data);
          if (user_data === user._id) {
            setIsMember(true)
          }
          users.push(response.data);
      }
      const api_messages = []
      const response_messages = []
      for (const message_id of res.data.messages) {
        const response = await axios.get("/api/message/" + message_id)
        if (response.data.father_id === undefined) {
          api_messages.push(response.data)
        } else {
          response_messages.push(response.data)
        }

      }

      const resComm = await axios.get("/api/community");

      const filteredCommunities = resComm.data.filter((searchedCommunity) => {
        if (searchedCommunity.users.includes(user._id)) {
          return false;
        }
        if (searchedCommunity.name === res.data?.name) {
          return false;
        }
        return searchedCommunity.bookName === res.data?.bookName;
      });

      setCommunities(filteredCommunities);

      setMembers(users);
      if (isReversed) {
        api_messages.reverse()
      }
      setMessages(api_messages)
      setResponseMessages(response_messages)

      
    } 

  };

  const getColor = (username) => {
    const usuario = members.find((u) => u.username === username);
    console.log(usuario)
    if (!usuario) {
      return "Usuario no encontrado";
    }

    switch (usuario.level) {
      case 0:
        return "black"; // Usuario estandar
      case 1:
        return "black"; // Moderador
      case 2:
        return "black"; // Admin
      default:
        return "black"; // Usuario estandar
    }
}

const getEmoji = (username) => {
  const usuario = members.find((u) => u.username === username);
  console.log(usuario)
  if (!usuario) {
    return "";
  }

  switch (usuario.level) {
    case 0:
      return ""; // Usuario estandar
    case 1:
      return " ⚙️"; // Moderador
    case 2:
      return " 👑"; // Admin
    default:
      return ""; // Usuario estandar
  }
}

const isPinged = (message) => {
  if (message.ping) {
    return "📌 ";
  } else {
    return "";
  }
}

const getMessageColor = (message, color) => {
  if (message.spam) {
    return "red"
  } else {
    return color
  }
}

  useEffect(()=>{
    if(user){
        fetchCommunity();
    }
  }, []);
  
  return (
    <>
        <div className="container mt-5">
          <h1 className="text-primary"> {community.name} </h1>
          <div className="card">
            <div className="card-header bg-secondary text-white">
            Comunidad sobre {community.type === 1
    ? community.bookName
    : community.type === 3
    ? community.bookGender
    : community.bookAuthor}. Creada el: <Moment date={moment(community.createdAt)} format="DD/MM/YYYY HH:mm" />
            </div>
            <div className="card-body">
            {isMember || user.isAdmin ? (
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group">
                  <input
                    id="message"
                    value={message}
                    placeholder={replyingTo ? "Respondiendo..." : "Escribe un mensaje"}
                    type="text"
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  <button className="btn btn-primary" type="submit">
                    Enviar
                  </button>
                </div>
              </form>
            ) : ""}
            <h5 className="card-title">Mensajes Destacados</h5>
            <ul className="list-group list-group-flush mb-4">
              {messages?.filter((message) => message.ping).map((message, index) => {
                const messageDate = new Date(message.createdAt); // Convierte el string en un objeto Date
                const lastLoginDate = new Date(user.updatedAt); // Convierte la fecha de inicio de sesión

                // Sumar 5 minutos (300,000 ms) a la fecha de creación del mensaje
                const messageDatePlus5Min = new Date(messageDate.getTime() + 5 * 60 * 1000);

                // Determina el color según la comparación
                const textColor = messageDatePlus5Min > lastLoginDate ? 'blue' : 'black';
                return (
                  <li key={index} className="list-group-item" style={{ padding: "10px", marginBottom: "10px", cursor: "pointer", color: textColor }}>
                    <span style={{color: getColor(message.username) }}>{isPinged(message) + message.username + getEmoji(message.username)}</span>: <span style={{color: getMessageColor(message, textColor)}} >{message.message}</span> - <Moment style={{color:"gray"}}  date={moment(message.createdAt)} format="DD/MM/YYYY HH:mm" />
                  </li>
                )
              })}
            </ul>

            <h5 className="card-title">Mensajes</h5>
            <span onClick={handleMessagesClick} className="btn btn-link">
              {isReversed ? "Mensajes en orden de más antiguos" : "Mensajes en orden de más nuevos"}
            </span>
            <ul className="list-group list-group-flush mb-4">
              {isMember || user.isAdmin ? messages?.map((message, index) => {
                const messageDate = new Date(message.createdAt); // Convierte el string en un objeto Date
                const lastLoginDate = new Date(user.updatedAt); // Convierte la fecha de inicio de sesión
                
                // Sumar 5 minutos (300,000 ms) a la fecha de creación del mensaje
                const messageDatePlus5Min = new Date(messageDate.getTime() + 5 * 60 * 1000);
                
                // Determina el color según la comparación
                const textColor = messageDatePlus5Min > lastLoginDate ? 'blue' : 'black';
                return (

                  <>
                <li onClick={() => handleReplyMessage(message._id)}  style={{
            backgroundColor: replyingTo === message._id ? "#c3c3c3" : "white", // Cambia el color según el estado
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
            color: textColor
          }}  key={index} className="list-group-item">
                 <span style={{color: getColor(message.username) }}>{isPinged(message) + message.username + getEmoji(message.username)}</span>: <span style={{color: getMessageColor(message, textColor)}} >{message.message}</span> - <Moment style={{color:"gray"}}  date={moment(message.createdAt)} format="DD/MM/YYYY HH:mm" />
                  {isMod || user.isAdmin ? (
                    <button className="btn btn-danger tachito" onClick={() => deleteMessage(message) }>
                      🗑️
                    </button>
                  ) : ""}
                  {isMod || user.isAdmin ? (
                    <button className="btn btn-danger tachito" onClick={() => setSpam(message) }>
                      Spam
                    </button>
                  ) : ""}
                  {isMod || user.isAdmin ? (
                    <button className="btn btn-msg fijar" onClick={() => setPingMsg(message) }>
                      Fijar msj 📌
                    </button>
                  ) : ""}
                </li>
                
                {responseMessages.filter((response) => response.father_id === message._id).map((response) => (
                  <li key={index} className="list-group-item" style={{ marginLeft: "25px" }}>
                   <span style={{color: getColor(response.username) }}>{response.username + getEmoji(response.username)}</span>: <span>{response.message}</span> - <Moment style={{color:"gray"}}  date={moment(response.createdAt)} format="DD/MM/YYYY HH:mm" />
                </li>
                ))}
                </>


                )


              }
                

              ) : ""}
            </ul>
            <h5 className="card-title">Miembros</h5>
            <ul className="list-group list-group-flush mb-4">
              {members?.map((member, index) => (
                <li key={index} className="list-group-item">
                  <span style={{color: getColor(member.username) }}>{member.username + getEmoji(member.username)}</span>
                  {(isMod && user.username !== member.username) || (isAdmin && user.username !== member.username) ? (
                  <button className="btn btn-primary chico" onClick={() => inviteMod(member._id)}>
                    Hacer Moderador
                  </button>
                  ) : ""}
                  {(isMod && user.username !== member.username) || (isAdmin && user.username !== member.username) ? (
                  <button className="btn btn-danger chico" onClick={() => deleteFromCommunity(member._id)}>
                    Eliminar de comunidad
                  </button>
                  ) : ""}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-footer">
              {communities?.map((community) => (
                  <div className="mislibrardos-sub-container-div" key={community._id}>
                    <li className="mislibrardos-name-container">
                    <Link className="btn btn-secondary button-mislibrardos-update" to={"/community/" + community._id}>
                      <span className="mislibrardos-name"> {community.name}</span>
                    </Link>
                      <div className="mislibrardos-button-div">
                        <button className="btn btn-danger " onClick={() => handleJoin(community._id)}>
                          Unirse
                        </button>
                      </div>
                    </li>
                  </div>
                ))}

          </div>
          <div className="card-footer">
            {isMember ? (
              <button className="btn btn-danger me-2" onClick={() => handleExit(community._id)}>
                Salir de comunidad
              </button>
            ) : ""}
            {isAdmin || user.isAdmin ? (
              <button className="btn btn-danger me-2" onClick={() => deleteCommunity(community._id)}>
                Eliminar Comunidad
              </button>
            ) : ""}
            {isAdmin || user.isAdmin ? (
        <>
          {!showInput ? (
            <button
              className="btn btn-warning me-2"
              onClick={() => setShowInput(true)}
            >
              Cambiar nombre
            </button>
          ) : (
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Nuevo nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button className="btn btn-success me-2" onClick={() => {
                modifyCommunityName(community._id);
                setShowInput(false);
                navigate(0)
              }}>
                Guardar
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowInput(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </>
      ) : ""}
          </div>
        </div>
      </div>

    </>

  )
}
