import React, { useContext } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Moment from 'react-moment'
import { AuthContext } from '../../context/AuthContext';
import './book.css';
import BookRating from '../../components/Stars/Stars';
import moment from 'moment';
// import { stat } from 'fs';

export const Book = () => {
  const [book, setBook] = useState({});
  const [comment, setComment] = useState("");
  const [messages, setMessages] = useState([])
  const [listName, setListName] = useState("")
  const {user} = useContext(AuthContext);
  const params = useParams()

  const handleFavorite = async (id) => {
    // alert("Libro añadido a favoritos");
    await axios.post(`/api/book/fav/${id}`, { user_id: user._id });
  }

  const [isReversed, setIsReversed] = useState(false);

  const handleMessagesClick = () => {
    setIsReversed((prev) => !prev);
    setMessages((prevMessages) => [...prevMessages].reverse());
  };

  const handleStatusChange = async (id, status) => {
    if (status === "Leido") {
      // Logic for when the status is "Leido"
      await axios.post(`/api/book/readBooks/${id}`, { user_id: user._id});
    } else if (status === "Leyendo") {
      await axios.post(`/api/book/readingBooks/${id}`, { user_id: user._id});
      // Logic for when the status is "Leyendo"
    } else if (status === "Por Leer") {
      await axios.post(`/api/book/toReadBooks/${id}`, { user_id: user._id});
      // Logic for when the status is "Por Leer"
    }
    // You can add your logic to handle the status change here
  };

  const addBookToPersonalList = async (id) => {
    if (listName.trim() === "") {
      alert("Por favor, ingrese un nombre para la lista.");
      return;
    }
    await axios.post(`/api/book/myBookLists/${id}`, { user_id: user._id, list_name: listName });
  };


  const handleChange = (e) => {
    if (e.target.id === "comment") {
      setComment(e.target.value)
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/book/message/" + params.id, {username: user.username, message: comment});
    setComment("")
    await fetchBook()
  };
  const fetchBook = async () =>{
    let res = await axios.get("/api/book/" + params.id);
    const api_messages = []
    if (res.data !== null) {
  
      for (const message_id of res.data.comments) {
        const response = await axios.get("/api/message/" + message_id)
        api_messages.push(response.data)
      }
      setBook(res.data);
      setMessages(api_messages)
    } else {

    }

  };

  const deleteMessage = async (message) => {
    const id_msg = message._id;
    await axios.put("/api/book/message/" + params.id, {message_id: id_msg});
    await fetchBook()
  }

  useEffect(()=>{
    
    
    if(user){
      fetchBook();
    }
  }, []);
  

  return (
    <>
  
      <div style={{marginTop:"30px"}} className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="card mislibrardos-wrapper">
              <div className="card-header">
                {book.title}
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">{book.description}</li>
                <li className="list-group-item">Editorial - {book.editorial}</li>
                <li className="list-group-item">Género - {book.gender}</li>
                <li className="list-group-item">Escritor - {book.writer}</li>
                <li className="list-group-item">Páginas - {book.num_pages}</li>
                <li className="list-group-item">Fecha edición - <Moment format='MM/YYYY'>{book.date_edition}</Moment></li>
                <li style={{marginTop:"10px" ,textAlign:"center"}} className="list-group-item"><img src={book.image} alt="Book cover" /></li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <form  onSubmit={handleSubmit} className="loginBoxSmall">
              <input id="comment" value={comment} placeholder="comentario" type="text" onChange={handleChange} required className="loginInput" />
              <button className="loginButton" type='submit'>Enviar</button>
            </form>
            <hr></hr>
            <h5 className="card-title">Comentarios</h5>
            <span style={{textDecoration:"none"}} onClick={handleMessagesClick} className="btn btn-link">
              {isReversed ? "Mensajes en orden de más nuevos" : "Mensajes en orden de más antiguos"}
            </span>
            <ul className="list-group list-group-flush mb-4">
              {messages?.map((message, index) => (
                <li key={index} className="list-group-item">
                  {message.username}: <span >{message.message}</span> - <Moment style={{color:"gray"}}  date={moment(message.createdAt)} format="DD/MM/YYYY" />
                  {user.isAdmin ? (
                    <button className="btn btn-danger tachito" onClick={() => deleteMessage(message) }>
                      🗑️
                    </button>
                  ) : ""}
                
                </li>
              ))}
            </ul>
            <hr></hr>
            <div className="d-flex flex-column align-items-start">
              <button className='btn btn-danger mb-2' onClick={()=>handleFavorite(book._id)}>❤️</button>
              <select
                className="btn btn-secondary mb-2"
                onChange={(e) => handleStatusChange(book._id, e.target.value)}
              >
                <option value="Nada">Status</option>
                <option value="Leido">Leido</option>
                <option value="Leyendo">Leyendo</option>
                <option value="Por Leer">Por Leer</option>
              </select>
              <BookRating bookId={book._id}/>
              <a style={{marginBottom: 10}} className="btn btn-primary" href={"https://www.amazon.com/s?k=" + book.title} target="_blank">Encuentra este libro en Amazon!</a>
              <Link style={{marginBottom: 10}} className="btn btn-primary" to={'/create/' + book._id}>Crear comunidad</Link>
              <button
                className="btn btn-primary"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Copiar enlace del libro
              </button>
              <input
                type="text"
                placeholder="Nombre de la lista"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="form-control mb-2"
                style={{marginTop:"10px", marginBottom:"5px"}}
              />
              
              <button className="btn btn-success" onClick={() => addBookToPersonalList(book._id)}>
                Añadir a lista personal
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}
