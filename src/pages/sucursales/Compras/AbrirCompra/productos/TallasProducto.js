import React, { useState } from 'react';
import { Drawer, Box, Button, useTheme, CircularProgress, Typography } from '@material-ui/core';
import TallasProducto from '../../../Catalogos/Producto/TallasColores/TallasColores';
import { Close, Done } from '@material-ui/icons';
import PaletteIcon from '@material-ui/icons/Palette';
import { useQuery } from '@apollo/client';
import { OBTENER_CONSULTAS } from '../../../../../gql/Catalogos/productos';
import ErrorPage from '../../../../../components/ErrorPage';

export default function PreciosProductos() {
	const [ open, setOpen ] = useState(false);
    const theme = useTheme();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    /* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_CONSULTAS, {
		variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id }
	});


    if (loading)
		return (
			<Button color="primary" disabled={true} size="large" startIcon={<CircularProgress size={18} color="inherit" />}>
                Tallas y colores
			</Button>
		);

	if (error) return <ErrorPage error={error} />;

	const { obtenerConsultasProducto } = data;
	

	const toggleDrawer = () => setOpen(!open);

	return (
		<div>
			<Button color="primary" onClick={() => toggleDrawer()} size="large" startIcon={<PaletteIcon />}>
                Tallas y colores
			</Button>
            <Drawer anchor="right" open={open} onClose={() => toggleDrawer()}>
				<Box p={5} marginBottom={5} width="75vw">
					{/* <TallasProducto obtenerConsultasProducto={obtenerConsultasProducto} refetch={refetch} /> */}
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

/* const DrawColors = ({toggleDrawer, open}) => {
    
    

    
    return (
      
    )
} */
