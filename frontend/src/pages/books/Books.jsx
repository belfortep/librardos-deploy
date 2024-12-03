import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import "./books.css";
import BookRatingDisplay from "../../components/DisplayBookRating/DisplayBookRating";


export const Books = () => {
  const [bookToSearch, setBookToSearch] = useState(""); // Estado para el término de búsqueda
  const [writerToSearch, setWriterToSearch] = useState(""); // Estado para el término de búsqueda
  const [genderToSearch, setGenderToSearch] = useState(""); // Estado para el término de búsqueda
  const [starsToSearch, setStarsToSearch] = useState(""); // Estado para el término de búsqueda
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  const [writerCheckbox, setWriterCheckbox] = useState(false);
  const [genderCheckbox, setGenderCheckbox] = useState(false);

  const [books, setBooks] = useState([]);
  const { user } = useContext(AuthContext);
  const { loading, error, dispatch } = useContext(AuthContext);

  const calculateAverageScore = (book) => {
    const scores = book.scores;
    if (scores.length === 0) return 0; // Maneja el caso donde no haya scores
    
    const totalScore = scores.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = totalScore / scores.length;
  
    return averageScore;
  };

  const fetchBooks = async () => {
    const res = await axios.get("/api/book");
    setFavoriteBooks(user.books)
    setBooks(res.data)
  }

  const handleFavorite = async (id) => {
    let res = await axios.post(`/api/book/fav/${id}`, { user_id: user._id });
    if (favoriteBooks.includes(id)) {
      setFavoriteBooks((prevBooks) =>
        prevBooks.filter((book) => book !== id)
      );
    } else {
      setFavoriteBooks((prevBooks) => [...prevBooks, id]);
    }
    
    console.log(favoriteBooks)
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
  }

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, []);

   // Filtra los libros según el término de búsqueda
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(bookToSearch.toLowerCase()) &&
    book.writer.toLowerCase().includes(writerToSearch.toLowerCase()) &&
    book.gender.toLowerCase().includes(genderToSearch.toLowerCase()) &&
    (starsToSearch === "" ? true : calculateAverageScore(book) === Number(starsToSearch))
  );

  
  const handleImgOnClick = (book) => {
    if (writerCheckbox) {
      setWriterToSearch(book.writer);
    } 

    if (genderCheckbox) {
      setGenderToSearch(book.gender);
    } 
  };

  return (
    <>
      {user ? (
        <>
          <div className="mislibrardos-main-div">
            <h1 style={{marginTop:"15px", fontSize:"48px"}} className="mislibrardos-title">Librardos</h1>
            <h2 style={{marginBottom:"15px"}} className="mislibrardos-sub-title">Catálogo</h2>
            
            {/* Input de búsqueda */}
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={bookToSearch}
              onChange={(e) => setBookToSearch(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Buscar por genero"
              value={genderToSearch}
              onChange={(e) => setGenderToSearch(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Buscar por escritor"
              value={writerToSearch}
              onChange={(e) => setWriterToSearch(e.target.value)}
              className="search-input"
            />
            <input
              type="number"
              placeholder="Buscar por calificacion"
              value={starsToSearch}
              onChange={(e) => setStarsToSearch(e.target.value)}
              className="search-input"
            />
            <label>
              <input
                type="checkbox"
                checked={writerCheckbox}
                onChange={(e) => setWriterCheckbox(e.target.checked)}
                style={{marginLeft:"5px"}}
              />
              Filtrar por autor
            </label>         
            <label>
              <input
                type="checkbox"
                checked={genderCheckbox}
                onChange={(e) => setGenderCheckbox(e.target.checked)}
                style={{marginLeft: "5px"}}
              />
              Filtrar por genero
            </label>

            <div style={{marginLeft: "10px", marginTop:"5px", marginBottom:"5px"}} className="sort-container">
              <label style={{marginRight:"5px"}} htmlFor="sort">Ordenar por:</label>
              <select

                id="sort"
                onChange={(e) => {
                  const sortBy = e.target.value;
                  const sortedBooks = [...filteredBooks].sort((a, b) => {
                    if (sortBy === "title") {
                      return a.title.localeCompare(b.title);
                    } else if (sortBy === "writer") {
                      return a.writer.localeCompare(b.writer);
                    } else if (sortBy === "gender") {
                      return a.gender.localeCompare(b.gender);
                    } else if (sortBy === "date") {
                      return new Date(a.date_edition) - new Date(b.date_edition);
                    } else if (sortBy === "rating") {
                      return calculateAverageScore(b) - calculateAverageScore(a);
                    } else if (sortBy === "title - desc") {
                      return b.title.localeCompare(a.title);
                    } else if (sortBy === "writer - desc") {
                      return b.writer.localeCompare(a.writer);
                    } else if (sortBy === "gender - desc") {
                      return b.gender.localeCompare(a.gender);
                    } else if (sortBy === "date - desc") {
                      return new Date(b.date_edition) - new Date(a.date_edition);
                    } else if (sortBy === "rating - desc") {
                      return calculateAverageScore(a) - calculateAverageScore(b);
                    }
                    return 0;
                  });
                  setBooks(sortedBooks);
                }}
              >
                <option value="title">Título</option>
                <option value="writer">Escritor</option>
                <option value="gender">Género</option>
                <option value="date">Fecha de edición</option>
                <option value="rating">Calificación</option>
                <option value="title - desc">Título - desc</option>
                <option value="writer - desc">Escritor - desc</option>
                <option value="gender - desc">Género - desc</option>
                <option value="date - desc">Fecha de edición - desc</option>
                <option value="rating - desc">Calificación - desc</option>
              </select>
            </div>
            <div className="mislibrardos-container">
              <ul className="mislibrardos-sub-container">
                {filteredBooks.map((book) => {
                  const averageRating = calculateAverageScore(book); 
                  return (
                    <div className="mislibrardos-sub-container-div" key={book._id}>
                      <li className="mislibrardos-name-container">
                        <Link
                          className="btn btn-secondary button-mislibrardos-update"
                          to={"/" + book._id}
                        >
                          <span className="mislibrardos-name">
                            {book.title}
                          </span>
                        </Link>
                        <div className="mislibrardos-button-div">
                          <button
                            className="btn btn-danger button-mislibrardos-delete"
                            onClick={() => handleFavorite(book._id)}
                          >
                            {(favoriteBooks.includes(book._id)) ? "💔" : "❤️"}
                          </button>
                        </div>
                      </li>
                      <li>
                        <span>
                          Escritor: {book.writer}
                        </span>
                      </li>
                      <li>
                        <span>
                          Genero: {book.gender}
                        </span>
                      </li>
                      <li>
                        <span>
                          Calificacion: <BookRatingDisplay rating={averageRating}/>
                        </span>
                      </li>
                      <li className="mislibrardos-date-container">
                        <span className="mislibrardos-date-text">
                          Fecha de edicion:
                        </span>
                        <Moment
                          className="mislibrardos-date"
                          date={moment(book.date_edition).add(1, "d")}
                          format="MM/YYYY"
                        />
                      </li>
                      <li style={{textAlign:"center"}}>
                        <img onClick={() => handleImgOnClick(book)} src={book.image} alt={book.title} className="book-image" style={{ width: "25%", cursor:"pointer" }} />
                      </li>
                    </div>
                    )
                }
                )}
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
