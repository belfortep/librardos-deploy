import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./communities.css";

export const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [name, setName] = useState("");
  const [amountMessages, setAmount] = useState([])
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const ALL = 0;
  const BOOKS = 1;
  const WRITERS = 2;
  const THEMES = 3;
  const [coms, setComs] = useState(0)

  const fetchCommunities = async () => {
    const res = await axios.get("/api/community");
    let array = []
    console.log(res.data)

    
      for (const community of res.data) {
        let counter = 0
        for (const message of community.messages) {
          const msg = await axios.get("/api/message/"+ message)
          const dateMsg = new Date(msg.data.createdAt)
          const dateUser = new Date(user.last_time_in_community)
          if (dateMsg > dateUser) {
            counter += 1
          }
        }
        array.push([community._id, counter])
      }
    
    setCommunities(res.data)
    setAmount(array)
  }

  const isMember = (community, userId) => {
    const array = community.users    
    return array.includes(userId)
  }

  const handleTitleChange = async (e) => {
    if (e.target.id === "name") {
      if (e.target.value.length > 3) {
        setName(e.target.value);
      } else {
        setName("")
      }
    }
    const res = await axios.post("/api/community/name", {name: name})
    setCommunities(res.data)
  };

  const handleBookChange = async (e) => {
    if (e.target.id === "book") {
      if (e.target.value.length > 3) {
        setName(e.target.value);
      } else {
        setName("")
      }
    }
    const res = await axios.post("/api/community/book", {bookName: e.target.value})
    setCommunities(res.data)
  };

  const handleGenderChange = async (e) => {
    if (e.target.id === "gender") {
      if (e.target.value.length > 3) {
        setName(e.target.value);
      } else {
        setName("")
      }
    }
    const res = await axios.post("/api/community/gender", {bookGender: e.target.value})
    setCommunities(res.data)
  };

  const handleJoin = async (id) => {
    try {
      await axios.post("/api/community/" + id, { id: user._id });
      navigate("/community/" + id)
    } catch (err) {
      alert(err.response.data.message)
     
    }
    
  }

  useEffect(() => {
    if (user) {
      fetchCommunities();
    }
  }, []);

  return (
    <>
      {user ? (
        <>
          <div className="mislibrardos-main-div">
          <h1 style={{marginTop:"15px", fontSize:"48px"}} className="mislibrardos-title">Librardos</h1>
            <h2 className="mislibrardos-sub-title">Lista de comunidades</h2>
            <input id="name" placeholder="name" type="text" onChange={handleTitleChange} required className="loginInput" />
            <input id="book" placeholder="book" type="text" onChange={handleBookChange} required className="loginInput" />
            <input id="gender" placeholder="gender" type="text" onChange={handleGenderChange} required className="loginInput" />
            <div className="community-filters">
              <button onClick={() => setComs(ALL)}>Todas</button>
              <button onClick={() => setComs(BOOKS)}>Libros</button>
              <button onClick={() => setComs(WRITERS)}>Autores</button>
              <button onClick={() => setComs(THEMES)}>Géneros</button>
            </div>    
            <h3> {coms === ALL ? "Todas" : coms === BOOKS ? "Libros" : coms === WRITERS ? "Autores" : "Géneros"} </h3>
            <div className="mislibrardos-container">
              <ul className="mislibrardos-sub-container">

                {coms === ALL ? communities.map((community,index) => (
                  <div className="mislibrardos-sub-container-div" key={community._id}>
                    <li className="mislibrardos-name-container">
                    <Link
                          className="btn btn-secondary button-mislibrardos-update"
                          to={"/community/" + community._id}
                        >
                          <span className="mislibrardos-name">
                        {community.name} -  <span style={{color:"blue"}}>{(amountMessages.length > 0) && (amountMessages[index][0] == community._id) && (amountMessages[index][1] > 0) ? amountMessages[index][1] : ""}</span>
                      </span>
                        </Link>
                      <div className="mislibrardos-button-div">
                      { !isMember(community, user._id) ? (
                          <button
                          className="btn btn-danger "
                          onClick={() => handleJoin(community._id)}
                        >
                          Unirse
                        </button>
                        ): ( <div> </div> )
                      }  
                      </div>
                    </li>
                  </div>
                )) : communities.filter((community) => community.type === coms).map((community,index) => (
                  <div className="mislibrardos-sub-container-div" key={community._id}>
                    <li className="mislibrardos-name-container">
                    <Link
                          className="btn btn-secondary button-mislibrardos-update"
                          to={"/community/" + community._id}
                        >
                          <span className="mislibrardos-name">
                        {community.name} -  <span style={{color:"blue"}}>{(amountMessages.length > 0) && (amountMessages[index][0] == community._id) && (amountMessages[index][1] > 0) ? amountMessages[index][1] : ""}</span>
                      </span>
                        </Link>
                      <div className="mislibrardos-button-div">
                      { !isMember(community, user._id) ? (
                          <button
                          className="btn btn-danger "
                          onClick={() => handleJoin(community._id)}
                        >
                          Unirse
                        </button>
                        ): ( <div> </div> )
                      }  
                      </div>
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
