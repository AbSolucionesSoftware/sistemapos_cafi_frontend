import React, { createContext, useState, useEffect } from 'react';

export const TraspasosAlmacenContext = createContext();

export const TraspasosProvider = ({ children }) => {


    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);
    const [ productos, setProductos ] = useState([]);
    const [ productosTo, setProductosTo ] = useState([]);
    const [ productosTras, setProductosTras ] = useState([]);
useEffect(() => {
   console.log("CONTEXT",productosTras)
  
}, [productosTras])
  
	return (
		<TraspasosAlmacenContext.Provider value={
            { 
                
                update,
                setUpdate,
                error,
                setError,
                openRegistro,
                setOpenRegistro,
                productos,
                setProductos,
                productosTras,
                setProductosTras,
                productosTo,
                setProductosTo
            }
        }>
			{children}
		</TraspasosAlmacenContext.Provider>
	);
};
