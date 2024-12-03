import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import "./writers.css";
import BookRatingDisplay from "../../components/DisplayBookRating/DisplayBookRating";


export const Writers = () => {
  const [writers, setWriters] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const handleInputChange = (id, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const handleKeyDown = (event, id) => {
    if (event.key === 'Enter') {
      setInputValues((prevValues) => ({
        ...prevValues,
        [id]: '',
      }));
      setSuccessMessage(id);  // Mostrar el mensaje de éxito para este escritor
      setTimeout(() => setSuccessMessage(null), 3000);  // Ocultar mensaje después de 3 segundos
    }
  };
  const { user } = useContext(AuthContext);

  const fetchWriters = async () => {
    const writer1 = {id: 0,name: "Guillermo Díaz Ibáñez", photo: "https://pbs.twimg.com/media/EegoMwIXsAUcvIG.jpg", description: "Guillermo Díaz Ibáñez (Madrid, 9 de mayo de 1993), más conocido como Willyrex, es un youtuber, streamer y empresario español. Cuenta con dos canales de YouTube: Willyrex, que cuenta con más de 17,1 millones de suscripciones y 5,22 mil millones de visualizaciones4​ y TheWillyrex; con más de 18,3 millones de suscripciones y 7,13 mil millones de visitas, lo que lo convierte en el octavo canal con más suscriptores en España y el 230.º canal más suscrito del mundo."}
    const writer2 = {id: 1,name: "Samuel de Luque Batuecas", photo: "https://i.scdn.co/image/ab67616d0000b27314d0195278619a1b94f83367", description:
      
      "Samuel de Luque Batuecas (Madrid, 12 de abril de 1989), más conocido como Vegetta777, es un youtuber y streamer español que sube vídeos y hace emisiones en directo de gameplays. Su canal de YouTube cuenta con más de 34 millones de suscriptores (lo que lo convierte en el tercer canal más grande de España) y 15 000 000 000 (quince mil millones) de vistas. Escribio junto a Guillermo la saga de libros Wigetta"}

    const writer3 = {id: 2,name: "Ángel David Revilla Lenoci", photo: "https://pbs.twimg.com/profile_images/702983368015749121/7XYkvHBZ_400x400.jpg", description: "Ángel David Revilla Lenoci (Caracas, 16 de julio de 1982), conocido como Dross Rotzank o simplemente Dross, es un youtuber y escritor venezolano. Conocido por su libro Luna de Pluton y sus videos dedicados al terror y misterio"}
    const writer4 = {id: 3,name: "Javier Santaolalla", photo: "https://pbs.twimg.com/profile_images/1477938089075085314/SfZLbuIG_400x400.jpg", description: "Javier Santaolalla Camino (Burgos, 31 de agosto de 1982) es un físico, ingeniero, doctor en física de partículas y divulgador científico español.1​ Ha trabajado en el Centro Nacional de Estudios Espaciales en Francia, el CIEMAT y la Organización Europea para la Investigación Nuclear, donde formó parte del equipo que descubrió el bosón de Higgs a través del Experimento CMS del gran colisionador de hadrones"}


    const escritores = [writer1, writer2, writer3, writer4]
    setWriters(escritores)
  }


  useEffect(() => {
    if (user) {
      if (!user.isPremium) {
        navigate("/premium")
      }
      fetchWriters();
    }
  }, []);

  return (
    <>
      {user ? (
        <>
          <div className="mislibrardos-main-div">
            <h1 className="mislibrardos-title">Librardos</h1>
            <h2 className="mislibrardos-sub-title">Lista de libros</h2>
            
           
            <div className="mislibrardos-container">
              <ul className="mislibrardos-sub-container">
              {writers.map((writer) => (
        <div className="mislibrardos-sub-container-div" key={writer.id}>
          <li className="mislibrardos-name-container">
            <span className="mislibrardos-name">{writer.name}</span>
          </li>
          <li style={{ textAlign: "center" }}>
            <img
              src={writer.photo}
              className="book-image"
              style={{ width: "25%" }}
            />
          </li>
          <li>{writer.description}</li>
          <input
            type="text"
            value={inputValues[writer.id] || ''}
            onChange={(e) => handleInputChange(writer.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, writer.id)}
            placeholder="Mensaje!"
          />
          {successMessage === writer.id && (
            <div className="success-message">¡Mensaje enviado con éxito!</div>
          )}
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
