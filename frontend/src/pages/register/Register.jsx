import { Link } from 'react-router-dom';
import './register.css'
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"

export const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    passwordAgain: "",
  });
  
  const handleChange = (e) => {
    if (e.target.id === "username") {
      setUser((prev) => ({ ...prev, username: e.target.value }));
    }
    if (e.target.id === "email") {
      setUser((prev) => ({ ...prev, email: e.target.value }));
    }
    if (e.target.id === "password") {
      setUser((prev) => ({ ...prev, password: e.target.value }));
    }
    if (e.target.id === "passwordAgain") {
      setUser((prev) => ({ ...prev, passwordAgain: e.target.value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.username === undefined || user.username.length < 3 || user.username.length > 25) {
      return alert("El nombre debe tener entre 3 y 25 letras");
    }
    if (user.password === undefined || user.username.length < 6 ) {
      return alert("Contraseña demasiado corta");
    }

    if (user.password != user.passwordAgain) {
      return alert("Las contraseñas no coinciden");
    }
    const {passwordAgain, ...userData} = user;
    await axios.post("/auth/register", userData);
    navigate("/login");
  };

  const register = async (data) => {
    console.log(data)
    await axios.post("/auth/register", data);
    navigate("/login");
  }

  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Librardos</h3>
            <span className="loginDesc">
              Interactua con lectores y busca tu siguiente libro para leer!
            </span>
          </div>
          <div className="loginRight">
            <form onSubmit={handleSubmit} className="loginBox">
              <input id="email" placeholder="Email" type="email" onChange={handleChange} required className="loginInput" />
              <input id="username" placeholder="Usuario" type="text" onChange={handleChange} required className="loginInput" />
              <input id="password" placeholder="Contraseña" type="password" onChange={handleChange} minLength="6" required className="loginInput" />
              <input id="passwordAgain" placeholder="Confirmar contraseña" onChange={handleChange} type="password" minLength="6" required className="loginInput" />
              <button className="loginButton" type='submit'>Registrar</button>
              <button className="loginRegisterButton" type='submit'><Link to={'/login/'} style={{color:"white", textDecoration:"none"}} >Tienes una cuenta?</Link></button>
              
              <div className='Login' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px' }}>
              
               </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
