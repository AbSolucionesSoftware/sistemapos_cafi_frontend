import React, { createContext, useState } from 'react';

export const TraspasosAlmacenContext = createContext();

export const TraspasosProvider = ({ children }) => {


    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);

	return (
		<TraspasosAlmacenContext.Provider value={
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
		</TraspasosAlmacenContext.Provider>
	);
};
