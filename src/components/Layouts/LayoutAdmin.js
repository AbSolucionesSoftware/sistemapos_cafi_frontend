import React from 'react';
import { RegProductoProvider } from '../../context/CtxRegProducto';
import AdminInicio from '../../pages/sucursales/AdminInicio';
import NavegacionAdmin from '../Navegaciones/NavegacionAdmin';


export default function LayoutAdmin(props) {
    const sesion = localStorage.getItem("sesionCafi");

    if(sesion === "false") props.history.push('/');

	return (
		<div>
			<RegProductoProvider>
				<NavegacionAdmin />
				<AdminInicio />
			</RegProductoProvider>
		</div>
	);
}
