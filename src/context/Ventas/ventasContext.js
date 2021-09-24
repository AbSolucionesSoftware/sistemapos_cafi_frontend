import React, { createContext, useState } from 'react';

export const VentasContext = createContext();

export const VentasProvider = ({ children }) => {

    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ alert, setAlert ] = useState({ message: "", status: "", open: false });

	return (
		<VentasContext.Provider value={
            { 
                alert, 
                setAlert,
                update,
                setUpdate,
                error,
                setError,
            }
        }>
			{children}
		</VentasContext.Provider>
	);
};