import React, { createContext, useState } from 'react';

export const AccesosContext = createContext();

export const AccesosProvider = ({ children }) => {

    const [ abrirPanelAcceso, setAbrirPanelAcceso ] = useState(false);
    const [ departamentos, setDepartamentos ] = useState({departamento: '', subDepartamento: '', tipo_acceso: ''});

    const [ reloadAdministrador, setReloadAdministrador ] = useState(false);
    const [ reloadProductoRapido, setReloadProductoRapido ] = useState(false);
    const [ reloadCancelarVenta, setReloadCancelarVenta ] = useState(false);
    const [ reloadVerPrecios, setReloadVerPrecios ] = useState(false);
    const [ reloadVerPreCorte, setReloadVerPreCorte ] = useState(false);
    const [ reloadEliminarVentaEspera, setReloadEliminarVentaEspera ] = useState(false);
    const [ reloadCrearCotizacion, setReloadCrearCotizacion ] = useState(false);

    return (
		<AccesosContext.Provider value={
            { 
                departamentos, 
                setDepartamentos,
                reloadProductoRapido, 
                setReloadProductoRapido,
                reloadAdministrador, 
                setReloadAdministrador,
                abrirPanelAcceso, 
                setAbrirPanelAcceso,
                reloadCancelarVenta, 
                setReloadCancelarVenta,
                reloadVerPrecios, 
                setReloadVerPrecios,
                reloadVerPreCorte, 
                setReloadVerPreCorte,
                reloadEliminarVentaEspera, 
                setReloadEliminarVentaEspera,
                reloadCrearCotizacion, 
                setReloadCrearCotizacion
            }
        }>
			{children}
		</AccesosContext.Provider>
	);
};