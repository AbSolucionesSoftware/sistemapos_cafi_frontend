import React, { createContext, useState } from 'react';

export const ComprasContext = createContext();

export const ComprasProvider = ({ children }) => {
	const [ datosCompra, setDatosCompra ] = useState({
		proveedor: {},
		producto: {},
		almacen: {}
	});

	const [ compras, setCompras ] = useState([]);

	return (
		<ComprasContext.Provider
			value={{
				datosCompra,
				setDatosCompra,
				compras,
				setCompras
			}}
		>
			{children}
		</ComprasContext.Provider>
	);
};
