import React, { createContext, useState } from 'react';

export const CreateDepartamentosContext = createContext();

export const DepartamentosProvider = ({ children }) => {
	const [ datosDepartamentos, setDatosDepartamentos ] = useState({
        nombre_departamentos: '',
        empresa: {},
        sucursal: {}
    });

    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);

	return (
		<CreateDepartamentosContext.Provider value={
            { 
                datosDepartamentos, 
                setDatosDepartamentos,
                update,
                setUpdate,
                error,
                setError,
                openRegistro,
                setOpenRegistro
            }
        }>
			{children}
		</CreateDepartamentosContext.Provider>
	);
};
