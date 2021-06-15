import React, { createContext, useState } from 'react';

export const ClienteCtx = createContext();

export const ClienteProvider = ({ children }) => {
	const [ cliente, setCliente ] = useState({
        direccion: {
          calle: '',
          no_ext: '',
          no_int: '',
          codigo_postal: '',
          colonia: '',
          municipio: '',
          localidad: '',
          estado: '',
          pais: '',
        },
        estado_cliente: true,
        tipo_cliente: 'CLIENTE'
    });
    const [ toUpdate, setToUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);

	return (
		<ClienteCtx.Provider value={{ cliente, setCliente, toUpdate, setToUpdate, error, setError, openRegistro, setOpenRegistro }}>
			{children}
		</ClienteCtx.Provider>
	);
};
