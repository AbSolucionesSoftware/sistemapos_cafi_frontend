import React, { useState, Fragment, useContext} from 'react';
import { Drawer, AppBar, Toolbar, Divider, BottomNavigation, Button, Grid, Slide, Badge } from '@material-ui/core';
import { CssBaseline, Avatar, Box, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { FaPowerOff } from 'react-icons/fa';
import { FcBusinessman, FcPaid } from 'react-icons/fc';
import useStyles from './styles';
// import addIcon from '../../icons/ventas/add.svg'
// import articuloRapido from '../../icons/ventas/tiempo-rapido.svg'
// import listaEspera from '../../icons/ventas/lista-de-espera.svg'
// import calendario from '../../icons/ventas/calendario.svg'
// import buscarPrecio from '../../icons/ventas/precios.svg'
// import cartIcon from '../../icons/ventas/cart.svg'
// import moneyIcon from '../../icons/money.svg';
// import cartaddIcon from '../../icons/ventas/cart-add.svg'
// import cajon from '../../icons/ventas/cajon.svg'
// import cashregisterIcon from '../../icons/ventas/cash-register.svg'
// import cashregister2Icon from '../../icons/ventas/cash-register2.svg'
// import adminIcon from '../../icons/ventas/admin.svg'
// import shiftIcon from '../../icons/ventas/shift.svg'
// import tagIcon from '../../icons/ventas/tag.svg'
// import shoppingcartIcon from '../../icons/ventas/shopping-cart.svg'

import Abonos from '../../pages/ventas/Abonos/Abonos';
import VentasCredito from '../../pages/ventas/VentasCredito/VentasCredito';
import DepositoRetiroCaja from '../../pages/ventas/Operaciones/DepositoRetiroCaja';
import Turnos from '../../pages/ventas/AbrirCerrarTurno/Turnos';
import CerrarCaja from '../../pages/ventas/Operaciones/CerrarCaja';
import VentasEspera from '../../pages/ventas/VentasEspera/VentasEspera';
import AbrirCajon from '../../pages/ventas/Operaciones/AbrirCajon';
import VentasRealizadas from '../../pages/ventas/VentasRealizadas/VentasRealizadas';
import PreciosProductos from '../../pages/ventas/Operaciones/PreciosProducto';
import CancelarVenta from '../../pages/ventas/Operaciones/CancelarVenta';
import CerrarVenta from '../../pages/ventas/Operaciones/CerrarVenta';
import ConsultarPrecio from '../../pages/ventas/Operaciones/ConsultarPrecio';
import Cotizacion from '../../pages/ventas/Cotizacion/Cotizacion';
import VentaEnEspera from '../../pages/ventas/Operaciones/VentaEnEspera';
import ListaApartados from '../../pages/ventas/Apartados/ListaApartados';
import CrearApartado from '../../pages/ventas/Apartados/CrearApartado';
import ClientesVentas from '../../pages/ventas/ClientesVentas/ClientesVentas';
import ProductoRapidoIndex from '../../pages/ventas/ArticuloRapido/indexArticuloRapido';
import SnackBarMessages from '../SnackBarMessages';
import { VentasContext } from '../../context/Ventas/ventasContext';

function NavegacionVentas(props) {
	const classes = useStyles();
	const { alert, setAlert } = useContext(VentasContext);
	const [ value, setValue ] = useState('venta-general');
	const [open, setOpen] = useState(false);

	const signOut = () => {
		localStorage.removeItem('sesionCafi');
		localStorage.removeItem('tokenCafi');
		props.history.push('/');
	};

	const handleClickOpen = () => {
		setOpen(!open);
	};

	// function funcion_tecla(event) {
	// 	const tecla_escape = event.keyCode;
	// 	if(tecla_escape === 27){
	// 		handleClickOpen();
	// 		return setVentana('cerrarVenta');
	// 	}
	// } CODIGO PARA PODER EJECUTAR LAS VENTANAS A BASE DE LAS TECLAS

	// window.onkeydown = funcion_tecla;

	return (
		<Fragment>
			<CssBaseline />
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<AppBar position="fixed" elevation={1} className={classes.appBar}>
				<BottomNavigation
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue);
					}}
					showLabels
					className={classes.navigationTop}
				>
					<ProductoRapidoIndex />
						<Divider orientation="vertical" />
					<Cotizacion /> 
						<Divider orientation="vertical" />
					<DepositoRetiroCaja />
						<Divider orientation="vertical" />
					<Turnos />
						<Divider orientation="vertical" />
					<CerrarCaja />
						<Divider orientation="vertical" />
					<VentaEnEspera handleClickOpen={handleClickOpen} />
						<Divider orientation="vertical" />
					<Button
						onClick={() => props.history.push('/admin')}
						style={{textTransform: 'none'}}
					>
						<Box display="flex" flexDirection="column">
							<Box display="flex" justifyContent="center" alignItems="center">
								<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/admin.svg' alt="icono admin" className={classes.iconSizeSecondSuperior} />
							</Box>
							Administrador
						</Box>
					</Button>
						<Divider orientation="vertical" />
					<Button
						onClick={() =>{
							props.history.push('/')
							signOut()
						}}
						style={{textTransform: 'none'}}
					>
						<Box display="flex" flexDirection="column">
							<Box display="flex" justifyContent="center" alignItems="center">
								<FaPowerOff className={classes.iconSizeSuperior} style={{color: 'red'}} />
							</Box>
								Salir
						</Box>
					</Button>
					<Box width="350px" display="flex" justifyContent="flex-end">
						<Box display="flex" alignItems="center">
							<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar} />
							<div>
								<Box mr={2}>
									<Typography color="textSecondary">aldo chagollan</Typography>
									<Typography color="textSecondary">
										<b>Caja: </b>xx
									</Typography>
								</Box>
							</div>
						</Box>
						<Box display="flex" alignItems="center">
							<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/calendario.svg' alt="icono admin" className={classes.avatar} />
							<div>
								<Box mr={2}>
									<Typography color="textSecondary">29/Julio/2021</Typography>
									<Typography color="textSecondary">
										<b>08:00 hrs.</b>
									</Typography>
								</Box>
							</div>
						</Box>
					</Box>
				</BottomNavigation>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				anchor= 'right'
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<Toolbar className={classes.navigationTop} />
				<Grid container className={classes.drawerColor}>
					<Grid item lg={6}>
						<VentasCredito />
						<CrearApartado />
					</Grid>
					<Grid item lg={6}>
						<Button className={classes.borderBoton}>
							<Box>
								<Box>
									<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart-add.svg' alt="icono general" className={classes.iconSizeSecondInferiorGrande} />
								</Box>
								<Box>
									Venta General
								</Box>
							</Box>
						</Button>
						<Abonos />
					</Grid>
				</Grid>

				<Grid container className={classes.drawerColor}>
					<Grid item lg={4}>
						<CancelarVenta />
						<AbrirCajon />
						<ConsultarPrecio />
					</Grid>
					<Grid item lg={4}>
						<CerrarVenta />
						<ClientesVentas />
						<VentasEspera />
					</Grid>
					<Grid item lg={4}>
						<VentasRealizadas />
						<PreciosProductos />
						<ListaApartados />
					</Grid>
				</Grid>
			</Drawer>
		</Fragment>
	);
}

export default withRouter(NavegacionVentas);