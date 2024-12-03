import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import welcomeImage from '../../images/welcomeimage.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Welcome = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
          {user ? (
            <>
              <div className="container mt-5">
                <div className="row">
                  <div className="col text-center">
                    <h1 className="display-4 text-primary">Bienvenido a Librardos</h1>
                    <h2 className="lead text-secondary">El lugar donde tus libros y tus amigos se unen!</h2>
                  </div>
                </div>
                <div className="row justify-content-center mt-4">
                  <div className="col-md-8">
                    <img 
                      src={welcomeImage} 
                      alt="Welcome to Librardos" 
                      className="img-fluid rounded bg-light p-3" 
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="container mt-5">
              <div className="alert alert-warning text-center" role="alert">
                Necesita estar conectado
              </div>
            </div>
          )}
        </>
      );
};

export default Welcome;