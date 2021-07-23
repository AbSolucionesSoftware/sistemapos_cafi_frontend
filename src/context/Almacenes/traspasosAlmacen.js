import React, { createContext, useState } from 'react';

export const TraspasosAlmacenContext = createContext();

export const TraspasosProvider = ({ children }) => {
	const [ datosAlmacen, setDatosAlmacen ] = useState({
        nombre_almacen: '',
        id_usuario_encargado: '',
        direccion: {
            calle: '',
            no_ext: '',
            no_int: '',
            codigo_postal: '',
            colonia: '',
            municipio: '',
            localidad: '',
            estado: '',
            pais: ''
        }
    });

    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);

	return (
		<TraspasosAlmacenContext.Provider value={
            { 
                datosAlmacen, 
                setDatosAlmacen,
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
