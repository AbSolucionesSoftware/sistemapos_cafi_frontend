import React, { useState, Fragment} from 'react';
import { Drawer, AppBar, Dialog, Toolbar, Divider, BottomNavigation, BottomNavigationAction, Button, Grid, Slide, Badge } from '@material-ui/core';
import { CssBaseline, Avatar, Box, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { FaPowerOff } from 'react-icons/fa';
import { FcDonate, FcExpired } from 'react-icons/fc';
import { FcBusinessman, FcCurrencyExchange, FcPaid } from 'react-icons/fc';
import useStyles from './styles';
import addIcon from '../../icons/ventas/add.svg'
import articuloRapido from '../../icons/ventas/tiempo-rapido.svg'
import listaEspera from '../../icons/ventas/lista-de-espera.svg'
import calendario from '../../icons/ventas/calendario.svg'
import buscarPrecio from '../../icons/ventas/precios.svg'
import cartIcon from '../../icons/ventas/cart.svg'
import moneyIcon from '../../icons/money.svg';
import cartaddIcon from '../../icons/ventas/cart-add.svg'
import cajon from '../../icons/ventas/cajon.svg'
import cashregisterIcon from '../../icons/ventas/cash-register.svg'
import cashregister2Icon from '../../icons/ventas/cash-register2.svg'
import adminIcon from '../../icons/ventas/admin.svg'
import shiftIcon from '../../icons/ventas/shift.svg'
import tagIcon from '../../icons/ventas/tag.svg'
import shoppingcartIcon from '../../icons/ventas/shopping-cart.svg'

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
import ArticuloRapido from '../../pages/ventas/ArticuloRapido/ArticuloRapido';
import VentaEnEspera from '../../pages/ventas/Operaciones/VentaEnEspera';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function NavegacionVentas(props) {
	const classes = useStyles();
	const [ value, setValue ] = useState('venta-general');
	const [open, setOpen] = useState(false);
	const [ventana, setVentana] = useState('');

	const signOut = () => {
		localStorage.removeItem('sesionCafi');
		localStorage.removeItem('tokenCafi');
		props.history.push('/');
	};

	const handleClickOpen = () => {
		setOpen(!open);
	};

	const ventanas = () => {
		switch (ventana) {
			case 'retiroDepositoCaja':
				return <DepositoRetiroCaja handleClickOpen={handleClickOpen} />
			case 'abrirCerrarTurno':
				return <Turnos handleClickOpen={handleClickOpen} />
			case 'cerrarCaja':
				return <CerrarCaja handleClickOpen={handleClickOpen} />
			case 'ventasEspera':
				return <VentasEspera handleClickOpen={handleClickOpen} />
			case 'ventasRealizadas':
				return <VentasRealizadas handleClickOpen={handleClickOpen} />
			case 'abrirCajon':
				return <AbrirCajon handleClickOpen={handleClickOpen} />
			case 'cancelarVenta':
				return <CancelarVenta handleClickOpen={handleClickOpen} />
			case 'preciosProductos':
				return <PreciosProductos handleClickOpen={handleClickOpen} />
			case 'consultarPrecio':
				return <ConsultarPrecio handleClickOpen={handleClickOpen} />
			case 'cerrarVenta':
				return <CerrarVenta handleClickOpen={handleClickOpen} />
			case 'cotizacion':
				return <Cotizacion handleClickOpen={handleClickOpen} />
			case 'articuloRapido':
				return <ArticuloRapido handleClickOpen={handleClickOpen} />
			case 'ventaEnEspera':
				return <VentaEnEspera handleClickOpen={handleClickOpen} />
			default:
				break;
		}
	};

	// function funcion_tecla(event) {
	// 	const tecla_escape = event.keyCode;
	// 	if(tecla_escape === 27){
	// 		handleClickOpen();
	// 		return setVentana('cerrarVenta');
	// 	}
	// }

	// window.onkeydown = funcion_tecla;

	return (
		<Fragment>
			<CssBaseline />
			<AppBar position="fixed" elevation={1} className={classes.appBar}>
				<BottomNavigation
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue);
					}}
					showLabels
					className={classes.navigationTop}
				>
					<BottomNavigationAction
						onClick={() =>{
							setVentana('articuloRapido');
							handleClickOpen();
						}}
						value="articulo-rapido"
						label={<Typography variant="subtitle2">Articulo Rapido</Typography>}
						icon={<img src={articuloRapido} alt="icono caja2" className={classes.iconSizeSecondSuperior} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						onClick={() =>{
							setVentana('cotizacion');
							handleClickOpen();
						}}
						value="cotizacion"
						label={<Typography variant="subtitle2">Cotización</Typography>}
						icon={<FcCurrencyExchange className={classes.iconSizeSuperior} />}
					/>
					
					<Divider orientation="vertical" />
					<BottomNavigationAction
						onClick={() =>{
							setVentana('retiroDepositoCaja');
							handleClickOpen();
						}}
						value="retiro-caja"
						label={<Typography variant="subtitle2">Deposito/Retiro</Typography>}
						icon={<img src={cashregister2Icon} alt="icono caja" className={classes.iconSizeSecondSuperior} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="abrir-turno"
						onClick={() =>{
							setVentana('abrirCerrarTurno');
							handleClickOpen();
						}}
						label={<Typography variant="subtitle2">Abrir/Cerrar turno</Typography>}
						icon={<img src={shiftIcon} alt="icono turno" className={classes.iconSizeSecondSuperior} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="corte-caja"
						onClick={() =>{
							setVentana('cerrarCaja');
							handleClickOpen();
						}}
						label={<Typography variant="subtitle2">Corte de caja</Typography>}
						icon={<img src={cashregisterIcon} alt="icono caja2" className={classes.iconSizeSecondSuperior} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="en-espera"
						onClick={() =>{
							setVentana('ventaEnEspera');
							handleClickOpen();
						}}
						label={<Typography variant="subtitle2">En espera</Typography>}
						icon={<FcExpired className={classes.iconSizeSuperior} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="regresar"
						onClick={() => props.history.push('/admin')}
						label={<Typography variant="subtitle2">Administrador</Typography>}
						icon={<img src={adminIcon} alt="icono admin" className={classes.iconSizeSecondSuperior} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="salir"
						onClick={() =>{
							props.history.push('/')
							signOut()
						}}
						label={<Typography variant="subtitle2">Salir</Typography>}
						icon={<FaPowerOff className={classes.iconSizeSuperior} style={{color: 'red'}} />}
					/>
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
							<img src={calendario} alt="icono admin" className={classes.avatar} />
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
						<Button 
							className={classes.borderBoton}
						>
							<Box>
								<Box>
									<img src={addIcon} alt="icono credito" className={classes.iconSizeSecondInferiorGrande} />
								</Box>
								<Box>
									Venta Credito
								</Box>
							</Box>
						</Button>
						<Button className={classes.borderBoton}>
							<Box>
								<Box>
									<img src={tagIcon} alt="icono apartados" className={classes.iconSizeSecondInferiorGrande} />
								</Box>
								<Box>
									Apartados
								</Box>
							</Box>
						</Button>
					</Grid>
					<Grid item lg={6}>
						<Button className={classes.borderBoton}>
							<Box>
								<Box>
									<img src={cartaddIcon} alt="icono general" className={classes.iconSizeSecondInferiorGrande} />
								</Box>
								<Box>
									Venta General
								</Box>
							</Box>
						</Button>
						<Button className={classes.borderBoton}>
							<Box>
								<Box>
									<FcDonate className={classes.iconSizeInferiorGrande} />
								</Box>
								<Box>
									Abonos
								</Box>
							</Box>
						</Button>
					</Grid>
				</Grid>
				{/* <Box mt={4} /> */}
				<Grid container className={classes.drawerColor}>
					<Grid item lg={4}>
						<Button 
							className={classes.borderBotonChico}
							onClick={() =>{
								setVentana('cancelarVenta');
								handleClickOpen();
							}}
						>
							<Box>
								<Box>
									<img src={shoppingcartIcon} alt="icono cancelarventa" className={classes.iconSizeSecondInferior} />
								</Box>
								<Box>
									Cancelar Venta
								</Box>
							</Box>
						</Button>
						<Button 
							className={classes.borderBotonChico}
							onClick={() =>{
								setVentana('abrirCajon');
								handleClickOpen();
							}}
						>
							<Box>
								<Box>
									<img src={cajon} alt="icono ventas" className={classes.iconSizeSecondInferior} />
								</Box>
								<Box>
									Cajon
								</Box>
							</Box>
						</Button>
						<Button 
							className={classes.borderBotonChico}
							onClick={() =>{
								setVentana('consultarPrecio');
								handleClickOpen();
							}}
						>
							<Box>
								<Box>
									<img src={buscarPrecio} alt="icono ventas" className={classes.iconSizeSecondInferior} />
								</Box>
								<Box>
									Consultar Precio
								</Box>
							</Box>
						</Button>
					</Grid>
					<Grid item lg={4}>
						<Button 
							className={classes.borderBotonChico}
							onClick={() =>{
								setVentana('cerrarVenta');
								handleClickOpen();
							}}
						>
							<Box>
								<Box>
									<img src={cartIcon} alt="icono ventas" className={classes.iconSizeSecondInferior} />
								</Box>
								<Box>
									Pagar
								</Box>
							</Box>
						</Button>
						<Button className={classes.borderBotonChico}>
							<Box>
								<Box>
								<FcBusinessman className={classes.iconSizeInferior} />
								</Box>
								<Box>
									Clientes
								</Box>
							</Box>
						</Button>
						<Button 
							className={classes.borderBotonChico}
							onClick={() =>{
								setVentana('ventasEspera');
								handleClickOpen();
							}}
						>
							<Box>
								<Box>
									<Badge badgeContent={4} color="primary">
										<img src={listaEspera} alt="icono caja2" className={classes.iconSizeSecondInferior} />
									</Badge>
								</Box>
								<Box>
									Lista Espera
								</Box>
							</Box>
						</Button>
					</Grid>
					<Grid item lg={4}>
						<Button 
							className={classes.borderBotonChico}
							onClick={() =>{
								setVentana('ventasRealizadas');
								handleClickOpen();
							}}
						>
							<Box>
								<Box>
								<FcPaid className={classes.iconSizeInferior} />
								</Box>
								<Box>
									Ventas Realizadas
								</Box>
							</Box>
						</Button>
						<Button 
							className={classes.borderBotonChico}
							onClick={() =>{
								setVentana('preciosProductos');
								handleClickOpen();
							}}
						>
							<Box>
								<Box>
									<img src={moneyIcon} alt="icono money" className={classes.iconSizeSecondInferior} />
								</Box>
								<Box>
									Precios
								</Box>
							</Box>
						</Button>
					</Grid>
				</Grid>
			</Drawer>


			<Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
				{ventanas()}
			</Dialog>

		</Fragment>
	);
}

export default withRouter(NavegacionVentas);