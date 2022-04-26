import React, { createContext, useState, useEffect } from "react";

export const AbonosCtx = createContext();

export const AbonosProvider= ({ children }) => {

    const [alert, setAlert] = useState({ message: "", status: "", open: false });
    const [ventas, setVentas] = useState([]);
    const [reload, setReload] = useState(false);
    const [openAbonar, setOpenAbonar] = useState(false);
    const [selectedClient, setSelectedClient] = useState("");
    const [abonos, setAbonos] = useState([]);
    useEffect(() => {
      console.log(abonos);
    }, [abonos])
    
    return (
        <AbonosCtx.Provider
            value={{
                alert, 
                setAlert,
                ventas, 
                setVentas,
                reload, 
                setReload,
                openAbonar, 
                setOpenAbonar,
                selectedClient,
                setSelectedClient,
                abonos,
                setAbonos
            }}
        >
            {children}
        </AbonosCtx.Provider>
    );
};
