import React, { useState, Fragment } from 'react';
import { Drawer, AppBar, Toolbar, Divider, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { CssBaseline, Avatar, Box, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { FaPowerOff } from 'react-icons/fa';
import { FcDonate, FcExpired } from 'react-icons/fc';
import { FcBusinessman, FcCurrencyExchange, FcPaid } from 'react-icons/fc';
import useStyles from './styles';
import addIcon from '../../icons/ventas/add.svg'
import cartIcon from '../../icons/ventas/cart.svg'
import cartaddIcon from '../../icons/ventas/cart-add.svg'
import cashregisterIcon from '../../icons/ventas/cash-register.svg'
import cashregister2Icon from '../../icons/ventas/cash-register2.svg'
import adminIcon from '../../icons/ventas/admin.svg'
import shiftIcon from '../../icons/ventas/shift.svg'
import tagIcon from '../../icons/ventas/tag.svg'
import shoppingcartIcon from '../../icons/ventas/shopping-cart.svg'

function NavegacionVentas(props) {
	const classes = useStyles();
	const [ value, setValue ] = useState('venta-general');

	const signOut = () => {
		localStorage.removeItem('sesionCafi');
		localStorage.removeItem('tokenCafi');
		props.history.push('/');
	};
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
						value="venta-general"
						label={<Typography variant="subtitle2">Venta General</Typography>}
                        icon={<img src={cartaddIcon} alt="icono general" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="venta-credito"
						label={<Typography variant="subtitle2">Venta a credito</Typography>}
                        icon={<img src={addIcon} alt="icono credito" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="abonos"
						label={<Typography variant="subtitle2">Abonos</Typography>}
						icon={<FcDonate className={classes.iconSize} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="apartados"
						label={<Typography variant="subtitle2">Apartados</Typography>}
						icon={<img src={tagIcon} alt="icono apartados" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="retiro-caja"
						label={<Typography variant="subtitle2">Deposito/Retiro</Typography>}
						icon={<img src={cashregister2Icon} alt="icono caja" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="abrir-turno"
						label={<Typography variant="subtitle2">Abrir/Cerrar turno</Typography>}
						icon={<img src={shiftIcon} alt="icono turno" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="cancelar-editar"
						label={<Typography variant="subtitle2">Cancelar venta</Typography>}
						icon={<img src={shoppingcartIcon} alt="icono cancelarventa" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="corte-caja"
						label={<Typography variant="subtitle2">Corte de caja</Typography>}
						icon={<img src={cashregisterIcon} alt="icono caja2" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="vertical" />
					<BottomNavigationAction
						value="regresar"
						onClick={() => props.history.push('/admin')}
						label={<Typography variant="subtitle2">Administrador</Typography>}
						icon={<img src={adminIcon} alt="icono admin" className={classes.iconSizeSecond} />}
					/>
					<Box width="250px" display="flex" justifyContent="flex-end">
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
					</Box>
				</BottomNavigation>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<Toolbar className={classes.navigationTop} />
				<BottomNavigation
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue);
					}}
					showLabels
					className={classes.root}
				>
					<BottomNavigationAction
						value="cerrar-venta"
						label={<Typography variant="subtitle2">Cerrar venta</Typography>}
						icon={<img src={cartIcon} alt="icono ventas" className={classes.iconSizeSecond} />}
					/>
					<Divider orientation="horizontal" />
					<BottomNavigationAction
						value="cliente"
						label={<Typography variant="subtitle2">Cliente</Typography>}
						icon={<FcBusinessman className={classes.iconSize} />}
					/>
					<Divider orientation="horizontal" />
					<BottomNavigationAction
						value="en-espera"
						label={<Typography variant="subtitle2">En espera</Typography>}
						icon={<FcExpired className={classes.iconSize} />}
					/>
					<Divider orientation="horizontal" />
					<BottomNavigationAction
						value="compras"
						label={<Typography variant="subtitle2">Compras</Typography>}
						icon={<FcPaid className={classes.iconSize} />}
					/>
					<Divider orientation="horizontal" />
					<BottomNavigationAction
						value="cotizacion"
						label={<Typography variant="subtitle2">Cotización</Typography>}
						icon={<FcCurrencyExchange className={classes.iconSize} />}
					/>
					<Divider orientation="horizontal" />
					<BottomNavigationAction
						onClick={signOut}
						value="salir"
						label={<Typography variant="subtitle2">Salir</Typography>}
						icon={<FaPowerOff className={classes.iconSize} style={{color: 'red'}} />}
					/>
				</BottomNavigation>
			</Drawer>
		</Fragment>
	);
}

export default withRouter(NavegacionVentas);
