import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Moment from 'react-moment';
import { AuthContext } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import './profile.css';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const [comms, setComms] = useState([]);
  const [friendCommunity, setFriendCommunity] = useState([]);
  const [friendName, setFriendName] = useState("");
  const navigate = useNavigate();

  const acceptFriend = async (friend_name) => {
    const res = await axios.put("/auth/acceptFriend/" + user._id, { friend_name: friend_name });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
  };

  const acceptModeration = async (community_name) => {
    // eslint-disable-next-line no-restricted-globals
    const userResponse = confirm("Quieres ser administrador de esta comunidad?");

    if (userResponse) {
      const res = await axios.put("/auth/acceptModeratorRequest/" + user._id, { community_name: community_name });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
    } else {
      const res = await axios.put("/auth/refuseModReq/" + user._id, { community_name: community_name });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
    }
  };

  const getCommunities = async () => {
    const communities = await axios.get("/api/community");  // todas las communities
    const myCommunities = [];
    for (const community of communities.data) {
      if (community.users.includes(user._id)) {
          myCommunities.push(community);
      }
    }
    setComms(myCommunities)
  }

  const premiumUnsuscribe = async () => {
    // eslint-disable-next-line no-restricted-globals
    const userResponse = confirm("Espera! Ya no quieres formar parte de la red premium de librardos?");
    if (userResponse) {
      const arrayFiltered = user.communities.filter((_, index) => index > 2)
      console.log("filtrado")
      console.log(arrayFiltered)
      arrayFiltered.map(async (com) => await axios.post("/api/community/exit/" + com, { id: user._id }))
      
      
      
      const res = await axios.delete("/auth/premium/" + user._id, {data:{userId: user._id}});
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
    } else {
    }
    
  };

  const handleListOfCommunities = async (friend_name) => {
    const communities = await axios.get("/api/community");  // todas las communities
    const friend = await axios.post("/auth/name", { username: friend_name });
    const communities_of_my_friend = [];
    for (const community of communities.data) {
      for (const user of community.users) {
        if (friend.data[0]._id === user) {
          communities_of_my_friend.push(community);
        }
      }
    }
    setFriendName(friend_name)
    setFriendCommunity(communities_of_my_friend);
  };

  useEffect(() => {
    if(user){
      getCommunities();
    }
  }, []);

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-primary">Perfil de Usuario</h1>
        <div className="card">
          <div className="card-header bg-secondary text-white">
            {user.username}
          </div>
          <div className="card-body">
            <h5 className="card-title">Datos del Usuario</h5>
            <div className="row mb-4">
  <div className="col-md-8">
    <ul className="list-group list-group-flush">
      <li className="list-group-item">Email: {user.email}</li>
      <li className="list-group-item">Dirección: {user.address}</li>
      <li className="list-group-item">
        Fecha de nacimiento: <Moment date={moment(user.birth_date)} format="DD/MM/YYYY" />
      </li>
    </ul>
  </div>
  <div className="col-md-4">
    <li className="list-group-item"><img src={user.photo_url ? user.photo_url : "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"} alt="Profile picture" style={{ width: "30%" }} /></li>
  </div>
</div>
            <h5 className="card-title">Información Adicional</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Géneros favoritos:</strong>
                <ul>
                  {user?.genres?.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              </li>
              <li className="list-group-item">
                <strong>Escritores favoritos:</strong>
                <ul>
                  {user?.writers?.map((writer, index) => (
                    <li key={index}>{writer}</li>
                  ))}
                </ul>
              </li>
              <li className="list-group-item">
                <strong>Comunidades:</strong>
                <ul>
                  {comms.map((community, index) => (
                    <li key={index} onClick={() => navigate("/community/"+community._id) }>{community.name}</li>
                  ))}
                </ul>
              </li>
              <li className="list-group-item">
                <strong>Amigos:</strong>
                <ul>
                  {user?.friends?.map((friend, index) => (
                    <li key={index} onClick={() => handleListOfCommunities(friend)}>{friend}</li>
                  ))}
                </ul>
              </li>
              {friendCommunity.length > 0 && (
                <li className="list-group-item">
                  <strong>Comunidades de mi amigo {friendName}:</strong>
                  <ul>
                    {friendCommunity.map((community, index) => (
                      <li key={index}>
                        <Link to={"/community/" + community._id}>
                          {community.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              <li className="list-group-item">
                <strong>Solicitudes de amistad:</strong>
                <ul>
                  {user?.pending_friend_request?.map((friend_request, index) => (
                    <li key={index}>
                      <button className="btn btn-primary" onClick={() => acceptFriend(friend_request)}>
                        {friend_request}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="list-group-item">
                <strong>Solicitudes de moderacion:</strong>
                <ul>
                  {user?.pending_moderator_request?.map((community_name, index) => (
                    <li key={index}>
                      <button className="btn btn-primary" onClick={() => acceptModeration(community_name)}>
                        {community_name}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className="card-footer">
            <Link className="btn btn-secondary" to={'/edit'}>Editar perfil</Link>
          <button
                className="btn btn-primary"
                onClick={() => navigator.clipboard.writeText("http://localhost:3000/register")}
                >
                Invita a tus amigos
            </button>
            { !user.isPremium ? (
              <button
              className="btn btn-warning"
              onClick={() => navigate("/premium")}
              >
              Conviertete en usuario premium
          </button>
            ) : ""}
            { user.isPremium && (
              <button
              className="btn btn-warning"
              onClick={() => premiumUnsuscribe()}
              >
              Cancela tu subscripcion
          </button>
            )}
            </div>
        </div>
      </div>

    </>
  );
};

export default Profile;