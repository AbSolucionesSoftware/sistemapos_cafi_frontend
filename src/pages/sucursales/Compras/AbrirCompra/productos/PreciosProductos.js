import React, { useState } from 'react';
import { Drawer, Box, Button, useTheme } from '@material-ui/core';
import FormularioPrecios from '../../../Catalogos/Producto/PreciosVenta/registrarInfoAdicional';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { Close, Done } from '@material-ui/icons';

export default function TallasProductos() {
	const [ open, setOpen ] = useState(false);
	const theme = useTheme();

	const toggleDrawer = () => setOpen(!open);

	return (
		<div>
			<Button color="primary" onClick={() => toggleDrawer()} size="large" startIcon={<LocalAtmIcon />}>
				Precios
			</Button>
			<Drawer anchor="right" open={open} onClose={() => toggleDrawer()}>
				<Box p={5} marginBottom={5} width="75vw">
					<FormularioPrecios />
					<Box
						boxShadow={3}
						position="fixed"
						bottom={0}
						right={16}
						style={{ backgroundColor: theme.palette.background.paper }}
						display="flex"
						justifyContent="flex-end"
						alignItems="center"
						width="75vw"
						height="7%"
					>
						<Button color="primary" onClick={() => toggleDrawer()} startIcon={<Close />}>
								Cancelar
							</Button>
							<Box mx={1} />
							<Button
								color="primary"
								variant="contained"
								onClick={() => toggleDrawer()}
								startIcon={<Done />}
							>
								Guardar
							</Button>
							<Box mx={1} />
					</Box>
				</Box>
			</Drawer>
		</div>
	);
}
