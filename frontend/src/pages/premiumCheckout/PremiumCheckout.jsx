import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export const PremiumCheckout = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const premiumCheckout = async (userId) => {
        // eslint-disable-next-line no-restricted-globals
        const userResponse = confirm("Estas apunto de convertirte en premium! Procede?");
        if (userResponse) {
            const res = await axios.put(`/auth/premium/${user._id}`, { userId: user._id });
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.details });
            navigate("/profile");
        } else {
            setCardNumber("")
            setCardName("")
            setExpiryDate("")
            setCvv("")
        }
    };

    const [showForm, setShowForm] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const isFormValid = cardNumber && cardName && expiryDate && cvv;

    return (
        <>
            <div className="container mt-3">
                <h1 className="text-primary">Conviertete en Premium</h1>
                <div className="card mt-3">
                    <div className="card-header bg-secondary text-white">
                        Beneficios
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-8">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Comunidades ilimitadas</li>
                                    <li className="list-group-item">Contacto con autores</li>
                                    <li className="list-group-item">Sin anuncios</li>
                                    <li className="list-group-item">Apoya al futuro de Librardos</li>
                                    <li className="list-group-item">¡Mucho más!</li>
                                </ul>
                            </div>
                        </div>
                        {/* <h5 className="card-title">Información Adicional</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Planes:</strong>
                            </li>
                            <li className="list-group-item">Plan 1 - 10 U$D premium por 3 meses</li>
                            <li className="list-group-item">Plan 2 - 15 U$D premium por 6 meses</li>
                            <li className="list-group-item">Plan 3 - 25 U$D premium por 12 meses</li>
                        </ul> */}
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-warning" onClick={() => setShowForm(!showForm)}>
                            Obtener
                        </button>
                    </div>
                    {showForm && (
                        <>
                            <div className="card-footer">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="plan" className="form-label">Selecciona un Plan</label>
                                        <select 
                                            className="form-select" 
                                            id="plan" 
                                            onChange={(e) => setShowForm(showForm)}
                                        >
                                            <option value="10">Plan 1 - 10 U$D premium por 3 meses</option>
                                            <option value="15">Plan 2 - 15 U$D premium por 6 meses</option>
                                            <option value="25">Plan 3 - 25 U$D premium por 12 meses</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cardNumber" className="form-label">Número de Tarjeta</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="cardNumber" 
                                            placeholder="1234 5678 9012 3456" 
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cardName" className="form-label">Nombre en la Tarjeta</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="cardName" 
                                            placeholder="Nombre Apellido" 
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="expiryDate" className="form-label">Fecha de Expiración</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="expiryDate" 
                                                placeholder="MM/AA" 
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="cvv" className="form-label">CVV</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="cvv" 
                                                placeholder="123" 
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer">
                                <button 
                                    className="btn btn-warning" 
                                    onClick={() => premiumCheckout(user._id)} 
                                    disabled={!isFormValid}
                                >
                                    ¡Conviértete en usuario Premium hoy!
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </>
    );
};

export default PremiumCheckout;
