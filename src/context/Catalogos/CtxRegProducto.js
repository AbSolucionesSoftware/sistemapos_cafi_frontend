import React, { createContext, useState } from 'react';

export const RegProductoContext = createContext();

export const RegProductoProvider = ({ children }) => {
	const [ datos, setDatos ] = useState({
        codido_barras: ''
    });

	return (
		<RegProductoContext.Provider value={{ datos, setDatos }}>
			{children}
		</RegProductoContext.Provider>
	);
};
