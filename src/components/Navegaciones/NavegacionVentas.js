import React, { useState, useContext} from 'react';
import { Drawer, AppBar, Toolbar, Divider, BottomNavigation, Button, Grid, Dialog, Slide, DialogContent, DialogActions } from '@material-ui/core';
import { CssBaseline, Avatar, Box, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { FaPowerOff } from 'react-icons/fa';
import useStyles from './styles';
import moment from 'moment';
import 'moment/locale/es';
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
import DepositoRetiroCaja from '../../pages/ventas/Operaciones/DepositoRetiroCaja';
import Turnos from '../../pages/ventas/AbrirCerrarTurno/Turnos';
import PreCorteCaja from '../../pages/ventas/Operaciones/PreCorteCaja';
import VentasEspera from '../../pages/ventas/VentasEspera/VentasEspera';
import AbrirCajon from '../../pages/ventas/Operaciones/AbrirCajon';
import VentasRealizadas from '../../pages/ventas/VentasRealizadas/VentasRealizadas';
import PreciosProductos from '../../pages/ventas/Operaciones/PreciosProducto';
import CancelarVenta from '../../pages/ventas/Operaciones/CancelarVenta';
import CerrarVenta from '../../pages/ventas/Operaciones/CerrarVenta';
import ConsultarPrecio from '../../pages/ventas/Operaciones/ConsultarPrecio';
import Cotizacion from '../../pages/ventas/Cotizacion/Cotizacion';
import BuscarProducto from '../../pages/ventas/BuscarProductos/BuscarProducto';
import VentaEnEspera from '../../pages/ventas/Operaciones/VentaEnEspera';
import ProductoRapidoIndex from '../../pages/ventas/ArticuloRapido/indexArticuloRapido';
import ClientesVentas from '../../pages/ventas/ClientesVentas/ClientesVentas';

// import VentasCredito from '../../pages/ventas/VentasCredito/VentasCredito';
// import ListaApartados from '../../pages/ventas/Apartados/ListaApartados';
// import CrearApartado from '../../pages/ventas/Apartados/CrearApartado';

import SnackBarMessages from '../SnackBarMessages';
import { VentasContext } from '../../context/Ventas/ventasContext';
// import { VentasProvider } from '../../context/Ventas/ventasContext'; 

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function NavegacionVentas(props) {
	const { alert, setAlert, abrirTurnosDialog, setAbrirTurnosDialog, setUbicacionTurno } = useContext(VentasContext);
	const classes = useStyles();
	const [ value, setValue ] = useState('venta-general');
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));

	moment.locale('es');

	const signOut = () => {
		if (sesion.turno_en_caja_activo === true && turnoEnCurso) {
			setAbrirTurnosDialog(!abrirTurnosDialog);
			setUbicacionTurno('SESION');
		}else{
			props.history.push('/');
			localStorage.removeItem('sesionCafi');
			localStorage.removeItem('tokenCafi');
            localStorage.removeItem('DatosVentas');
			localStorage.removeItem('turnoEnCurso');
			localStorage.removeItem('ListaEnEspera');
		}
	};

	function Mi_función(e){
		if( e.keyCode === 112){ 
			props.history.push('/admin');
		}
		if( e.keyCode === 115){ 
			props.history.push('/');
		}
	};

	window.addEventListener('keydown', Mi_función); 

	return (
		<>
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
					<PreCorteCaja />
						<Divider orientation="vertical" />
					<VentaEnEspera />
						<Divider orientation="vertical" />
					<Button
						onClick={() => props.history.push('/admin')}
						style={{textTransform: 'none', height: '100%', width: '60%'}}
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
							signOut()
						}}
						style={{textTransform: 'none', height: '100%', width: '40%'}}
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
						</Box>
					</Button>
					<Box 
						display="flex" 
						justifyContent="flex-end"
						style={{height: '100%', width: '100%'}}
					>
						<Box mr={3} display="flex" alignItems="center">
							<Avatar alt="Remy Sharp" srsc="/static/images/avatar/1.jpg" className={classes.avatar} />
							<div>
								<Box>
									<Typography color="textSecondary">{sesion?.nombre}</Typography>
									{!turnoEnCurso?.numero_caja ? (
										""
									) : (
										<Typography color="textSecondary">
											<b>Caja: </b>{turnoEnCurso?.numero_caja}
										</Typography>
									)}
									
								</Box>
							</div>
						</Box>
						<Box mr={3} display="flex" alignItems="center">
							<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/calendario.svg' alt="icono admin" className={classes.avatar} />
							<div>
								<Box>
									<Typography color="textSecondary">
										{moment().format('MM/DD/YYYY')}
									</Typography>
									<Typography color="textSecondary">
										<b>{moment().format('h:mm')} hrs.</b> 
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
				{/* <Grid container className={classes.drawerColor}>
					<Grid item lg={6} xs={6} md={6}>
						<VentasCredito />
					</Grid>
				</Grid> */}
				<Grid container className={classes.drawerColor}>
					<Grid item lg={6} md={6} xs={6}>
						<CerrarVenta />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<BuscarProducto />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<CancelarVenta />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<AbrirCajon />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<PreciosProductos />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<VentasEspera />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<ClientesVentas />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<VentasRealizadas />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<ConsultarPrecio />
					</Grid>
					<Grid item lg={6} md={6} xs={6}>
						<Abonos />
					</Grid>
					
				</Grid>
			</Drawer>

		</>
	);
}

export default withRouter(NavegacionVentas);