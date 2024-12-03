import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'

export const Advertisment = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {(!user || !user.isPremium) && (
        <div className="horizontal-banner" style={{ backgroundColor: "red", height: "100px", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", flexWrap: "nowrap", overflow: "hidden", height: "100px", width: "100%", justifyContent: "center" }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKyh8oCOn6SrqJHiDBcQcG529zWdHoFbzTw&s" alt="Advertisement" style={{ height: "100%", flexShrink: 0 }} />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKyh8oCOn6SrqJHiDBcQcG529zWdHoFbzTw&s" alt="Advertisement" style={{ height: "100%", flexShrink: 0 }} />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKyh8oCOn6SrqJHiDBcQcG529zWdHoFbzTw&s" alt="Advertisement" style={{ height: "100%", flexShrink: 0 }} />
          </div>
        </div>
      )}
    </>
  );
};
