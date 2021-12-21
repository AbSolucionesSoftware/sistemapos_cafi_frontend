import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { BrowserRouter as Switch, Route } from 'react-router-dom';
import NavegacionVentas from '../Navegaciones/NavegacionVentas';
import NavegacionVentasLateral from '../Navegaciones/NavegacionVentasLateral';
import { Grid, Toolbar, Box } from '@material-ui/core';
import { VentasProvider } from '../../context/Ventas/ventasContext';
import VentaIndex from '../../pages/ventas/venta_index';


const drawerWidth = '22%';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	content: {
		flexGrow: 1,
	},
    toolbar: {
		height: theme.spacing(9)
	}
}));

export default function LayoutVentas(props) {
	const classes = useStyles();
    const sesion = localStorage.getItem("sesionCafi");

    if(!sesion) props.history.push('/');

	return (
		<Box height='100vh'>
			<VentasProvider>
				<Grid lg={12} style={{height: '10vh'}}>
					<NavegacionVentas />
				</Grid>
				<Grid container style={{height: '90vh'}}>
					<Grid lg={9}>
						<VentaIndex />
					</Grid>
					<Grid lg={3}>
						<NavegacionVentasLateral />
					</Grid>
				</Grid>
			</VentasProvider>
		</Box>
	);
}