import React, { createContext, useState } from 'react';

export const CrearAlmacenContext = createContext();

export const AlmacenProvider = ({ children }) => {
	
    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);

	return (
		<CrearAlmacenContext.Provider value={
            { 
               
                update,
                setUpdate,
                error,
                setError,
                openRegistro,
                setOpenRegistro
            }
        }>
			{children}
		</CrearAlmacenContext.Provider>
	);
};
