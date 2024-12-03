import { Link } from 'react-router-dom';
import './registerModerator.css'
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


export const RegisterModerator = () => {
  const navigate = useNavigate();
  const params = useParams()

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    passwordAgain: "",
    isAdmin: true
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

  return (
    <>
    {params.id.startsWith("1234") ? <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Librardos</h3>
            <span className="loginDesc">
              Crea tu nueva cuenta como moderador invitado!
            </span>
          </div>
          <div className="loginRight">
            <form onSubmit={handleSubmit} className="loginBox">
              <input id="email" placeholder="Email" type="email" onChange={handleChange} required className="loginInput" />
              <input id="username" placeholder="Username" type="text" onChange={handleChange} required className="loginInput" />
              <input id="password" placeholder="Password" type="password" onChange={handleChange} minLength="6" required className="loginInput" />
              <input id="passwordAgain" placeholder="Confirm password" onChange={handleChange} type="password" minLength="6" required className="loginInput" />
              <button className="loginButton" type='submit'>Registrar</button>
              <span className="loginForgot"></span>
              <Link to={'/login/'} className="loginRegisterButton">Tienes una cuenta?</Link>
            </form>
          </div>
        </div>
      </div> : ""}
      
    </>
  )
}
