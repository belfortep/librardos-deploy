import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import "./createCommunities.css";


export const CreateCommunities = () => {
  const [community, setCommunity] = useState([]);
  const [book, setBook] = useState({});
  const { user } = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState(1);
  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.id === "name") {
      setCommunity((prev) => ({ ...prev, name: e.target.value }));
    }
    
  };

  const handleCoso = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/community", {name: community.name, bookId: params.id, user_id: user._id, type: selectedValue});
      await axios.post("/api/community/" + result.data, {id: user._id})
      await axios.post("/api/community/mod/" + result.data, {id: user._id})
      navigate("/");
    } catch (err) {
      alert(err.response.data.message)
    }
    
  };

  const fetchBook = async () =>{
    let res = await axios.get("/api/book/" + params.id);
    if (res.data !== null) {
      setBook(res.data);
    } else {

    }

  };

  useEffect(() => {
    if (user) {
      fetchBook();
    }
  }, []);

  return (
    <>
      <h1 style={{marginTop:"20px"}}>Crear Comunidad</h1>
      <form onSubmit={handleCreate} className="loginBoxSmall">
        {/* Radio button 1 */}
        <div style={{ display: 'flex', width: '100%' }}>
        {/* Radio button 1 */}
        <label style={{ flex: 1, textAlign: 'center' }}>
          <input
            type="radio"
            name="comunidad"
            value="1"
            checked={selectedValue === '1'}
            onChange={handleCoso}
          />
          Comunidad del Libro
        </label>

        {/* Radio button 2 */}
        <label style={{ flex: 1, textAlign: 'center' }}>
          <input
            type="radio"
            name="comunidad"
            value="2"
            checked={selectedValue === '2'}
            onChange={handleCoso}
          />
          Comunidad del Autor
        </label>

        {/* Radio button 3 */}
        <label style={{ flex: 1, textAlign: 'center' }}>
          <input
            type="radio"
            name="comunidad"
            value="3"
            checked={selectedValue === '3'}
            onChange={handleCoso}
          />
          Comunidad del Género
        </label>
      </div>
              <input id="name" placeholder="Nombre" type="text" onChange={handleChange} required className="loginInput" />
              <button className="loginButton" type='submit'>Crear</button>
        </form>
    
    </>
  );
};
