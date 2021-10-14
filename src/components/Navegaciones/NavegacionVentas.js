import React, { useState, Fragment, useContext} from 'react';
import { Drawer, AppBar, Toolbar, Divider, BottomNavigation, Button, Grid } from '@material-ui/core';
import { CssBaseline, Avatar, Box, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { FaPowerOff } from 'react-icons/fa';
import useStyles from './styles';
import moment from 'moment';
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
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const signOut = () => {
		localStorage.removeItem('sesionCafi');
		localStorage.removeItem('tokenCafi');
		props.history.push('/');
	};

	window.addEventListener('keydown', Mi_función); 
	function Mi_función(e){
		if( e.keyCode === 112){ 
			props.history.push('/admin');
		}
		if( e.keyCode === 115){ 
			props.history.push('/');
		}
	};

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
					<VentaEnEspera />
						<Divider orientation="vertical" />
					<Button
						onClick={() => props.history.push('/admin')}
						style={{textTransform: 'none', height: '100%', width: '70%'}}
					>
						<Box display="flex" flexDirection="column">
							<Box display="flex" justifyContent="center" alignItems="center">
								<img 
									src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/admin.svg' 
									alt="icono admin" 
									className={classes.iconSizeSecondSuperior} 
								/>
							</Box>
							<Box>
								<Typography variant="body2" >
									<b>Administrador</b>
								</Typography>
							</Box>
							<Box>
								<Typography variant="caption" style={{color: '#808080'}} >
									<b>F1</b>
								</Typography>
							</Box>
						</Box>
					</Button>
						<Divider orientation="vertical" />
					<Button
						onClick={() =>{
							props.history.push('/')
							signOut()
						}}
						style={{textTransform: 'none', height: '100%', width: '70%'}}
					>
						<Box display="flex" flexDirection="column" style={{textTransform: 'none', height: '100%', width: '100%'}}>
							<Box display="flex" justifyContent="center" alignItems="center">
								<FaPowerOff className={classes.iconSizeSuperior} style={{color: 'red'}} />
							</Box>
							<Box>
								<Typography variant="body2" >
									<b>Salir</b>
								</Typography>
							</Box>
							<Box>
								<Typography variant="caption" style={{color: '#808080'}} >
									{/* <b>F3</b> */}
								</Typography>
							</Box>
						</Box>
					</Button>
					<Box width="350px" display="flex" justifyContent="flex-end">
						<Box display="flex" alignItems="center">
							<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar} />
							<div>
								<Box mr={2}>
									<Typography color="textSecondary">{sesion.nombre}</Typography>
									<Typography color="textSecondary">
										<b>Caja: </b>2 
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
					<Grid item lg={6} xs={6} md={6}>
						<VentasCredito />
						<CrearApartado />
					</Grid>
					<Grid item  lg={6} xs={6} md={6}>
						<Button className={classes.borderBoton}>
							<Box>
								<Box>
									<img 
										src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart-add.svg' 
										alt="icono general" 
										className={classes.iconSizeSecondInferiorGrande} 
									/>
								</Box>
								<Box>
									<Typography variant="body2" >
										<b>Venta General</b>
									</Typography>
								</Box>
								<Box>
									<Typography variant="caption" style={{color: '#808080'}} >
										<b>F4</b>
									</Typography>
								</Box>
							</Box>
						</Button>
						<Abonos />
					</Grid>
				</Grid>

				<Grid container className={classes.drawerColor}>
					<Grid item lg={4} md={4} xs={4}>
						<CancelarVenta />
						<AbrirCajon />
						<ClientesVentas />
					</Grid>
					<Grid item lg={4} md={4} xs={4}>
						<CerrarVenta />
						<VentasEspera />
						<ConsultarPrecio />
					</Grid>
					<Grid item lg={4} md={4} xs={4}>
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