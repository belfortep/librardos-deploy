import { Book, Users, LogOut, BookOpen, Users2, Moon, Sun, PencilLine } from 'lucide-react';
import React, { useContext, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../ThemeContext/ThemeContext';
import "./navbar.css"

export const Navbar = () => {
  const { dispatch, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  console.log(user)
  const handleClick = (e) =>{
    e.preventDefault();
    dispatch({type: 'LOGOUT'});
    navigate('/login');
  }

  const getEmoji = (isAdmin) => {
    switch (isAdmin) {
      case true:
        return " 👑"; // Admin
      case false:
        return ""; // Admin
      default:
        return;
    }
  }

  return (
    <>
    {user ? <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          Librardos
        </a>

        <div className="navbar-links">
          <a href="/catalog" className="navbar-button">
            <Book className="icon" />
            Catálogo
          </a>

          <a href="/myBooks" className="navbar-button">
            <BookOpen className="icon" />
            Mis Libros
          </a>

          <a href="/communities" className="navbar-button">
            <Users className="icon" />
            Comunidades
          </a>

          <a href="/users" className="navbar-button">
            <Users2 className="icon" />
            Usuarios
          </a>

          <a href={user.isPremium ? "/writers" : "/premium"} className="navbar-button">
            <PencilLine className="icon" />
            Escritores
          </a>
        </div>

        <div className="navbar-user">
          <button className="navbar-button theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
            {isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
          </button>

          <button className="navbar-button logout-button" onClick={handleClick} aria-label="Cerrar sesión">
            <LogOut className="icon" />
          </button>

          <div className="user-profile">
            {/* if (user.isPremium) {
              <span className="premium-badge">
                  <Link to={'/profile'}>{user.username + getEmoji(user.level)} </Link>
              </span>
            } */}
            <span className="username">
              <Link to={'/profile'} style={{ color: user.isPremium ? "gold" : "blue" }}>{user.username + getEmoji(user.isAdmin)}</Link>
            </span>
            <div className="avatar">
              <img src={user.photo_url ? user.photo_url : "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"} alt="Profile picture"/>
            </div>
          </div>
        </div>
      </div>
    </nav> : <><nav className="navbar navbar-expand-lg navbar-light bg-light">
      
      <div className="container-fluid">
        
        <div className="navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
            </li>
            <li className="nav-item">
            <Link className="nav-link" to={'/register'}>Registrarse</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to={'/login'}>Login</Link>
            </li>
            <li className="nav-item">
            </li>
          </ul>
        </div>
      </div>
    </nav></>}
    
    </>
  );
}
