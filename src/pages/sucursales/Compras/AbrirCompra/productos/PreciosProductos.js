import React, { useState } from 'react';
import { Drawer, Box, Button } from '@material-ui/core';
import FormularioPrecios from '../../../Catalogos/Producto/PreciosVenta/registrarInfoAdicional';

export default function PreciosProductos() {
	const [ open, setOpen ] = useState(false);

	const toggleDrawer = () => setOpen(!open);

	return (
		<div>
			<Button color="primary" onClick={() => toggleDrawer()}>
				Cambiar Precios
			</Button>
			<Drawer anchor="right" open={open} onClose={() => toggleDrawer()}>
				<Box p={5} width="75vw">
					<FormularioPrecios />
				</Box>
				<Box position="fixed" bottom={0} right={32}>
					<Button color="primary" onClick={() => toggleDrawer()}>
						Cancelar
					</Button>
					<Button color="primary" variant="contained" onClick={() => toggleDrawer()}>
						Guardar
					</Button>
				</Box>
			</Drawer>
		</div>
	);
}
