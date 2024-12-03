import React, { useContext } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Moment from 'react-moment'
import { AuthContext } from '../../context/AuthContext';
import './editProfile.css';

export const EditProfile = () => {
  const {user} = useContext(AuthContext);
  const [securityLevel, setSecurityLevel] = useState(user.privacy_level);

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: user.email,
    user_password: "",
  });

  const [userInfo, setUserInfo] = useState({
    photo_url: user.photo_url,
    address: user.address,
    birth_date: user.birth_date,
    username: user.username,

  })

  const [genre, setGenre] = useState("")
  const [writer, setWriter] = useState("")

  const handleUserChange = (e) => {
    setUserInfo((prev) => ({...prev, [e.target.id]: e.target.value}))
  }
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/auth/" + user._id, credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate('/profile')
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const handleGenreSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.put("/auth/genre/" + user._id, {genre: genre});
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      setGenre("")
      alert("Añadido nuevo genero preferido")
    } catch (err) {
      
    }
  };

  const handleWriterSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.put("/auth/writer/" + user._id, {writer: writer});
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      setWriter("")
      alert("Añadido nuevo escritor preferido")
    } catch (err) {
      
    }
  };

  const handleSecurityChange = async (event) => {
    setSecurityLevel(Number(event.target.value)); // Convertir a número para usarlo correctamente
    let res = await axios.put("/auth/user/" + user._id, {privacy_level: event.target.value})
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
  };


  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/user/" + user._id, userInfo);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate('/profile')
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };


  return (
    <>
      <h1>Usuario</h1>
      <div className="card mislibrardos-wrapper">
      <form  className="form-control" onSubmit={handleSubmit}>
        
        <input
          type="text"
          placeholder="email"
          id="email"
          value={credentials.email}
          onChange={handleChange}
          className="form-control"
        />
        <input
          type="password"
          placeholder="password"
          id="user_password"
          value={credentials.user_password}
          onChange={handleChange}
          className="form-control"
        />
        <button className="btn btn-secondary">
          Confirmar
        </button>
        </form>
        <form  className="form-control" onSubmit={handleUserSubmit}>
        <input
          type="text"
          placeholder="username"
          id="username"
          value={userInfo.username}
          onChange={handleUserChange}
          className="form-control"
        />
        <input
          type="text"
          placeholder="address"
          id="address"
          value={userInfo.address}
          onChange={handleUserChange}
          className="form-control"
        />
        <input
          type="date"
          placeholder="birth_date"
          id="birth_date"
          value={credentials.birth_date}
          onChange={handleUserChange}
          className="form-control"
        />
        <input
          type="text"
          placeholder="url de imagen"
          id="photo_url"
          value={userInfo.photo_url}
          onChange={handleUserChange}
          className="form-control"
        />
        <div style={{marginBottom: 10, marginTop: 10}}><img style={{width:"12.5%", height:"12.5%"}} src={userInfo.photo_url} alt="Book cover" /></div>
        
        <button className="btn btn-secondary">
          Confirmar
        </button>
        </form>
        <form  className="form-control" onSubmit={handleGenreSubmit}>
        <input
          type="text"
          placeholder="genre"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-secondary">
          Agregar
        </button>
        </form>
        <form  className="form-control" onSubmit={handleWriterSubmit}>
        <input
          type="text"
          placeholder="writer"
          id="writer"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-secondary">
          Agregar
        </button>
        </form>
        <label htmlFor="security">Nivel de privacidad: </label>
    <select
      id="security"
      value={securityLevel}
      onChange={handleSecurityChange}
    >
      <option value={0}>Por defecto</option>
      <option value={1}>Menos visibilidad</option>
      <option value={2}>Visibilidad mínima</option>
    </select>
      </div>
    </>
  )
}
