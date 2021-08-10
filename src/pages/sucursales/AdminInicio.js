import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FcShop, FcPaid, FcSurvey, FcNews,FcPrint } from 'react-icons/fc';
import { Toolbar, Box, Tab, Tabs, AppBar } from '@material-ui/core';
import Empresa from './Empresa/Empresa';
import Compras from './Compras/Compras';
import Catalogos from './Catalogos/Catalogos';
import Tesoreria from './Tesoreria/Tesoreria';
import facturaIcon from '../../icons/factura.svg';
import moneyIcon from '../../icons/money.svg';
import almacenIcon from '../../icons/almacen.svg';
import Almacenes from './Almacenes/Almacenes';
import cartIcon from '../../icons/ventas/cart-add.svg';
import { withRouter } from 'react-router';
import cajaIcon from '../../icons/cajas.svg';
import Cajas from './Cajas/Cajas';
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3} my={6} minHeight="50vh">
					{children}
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		'aria-controls': `scrollable-force-tabpanel-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundColor: theme.palette.background.paper
	},
	icon: {
		fontSize: 100
	},
	iconSvg: {
		width: 100
	},
	iconSvgVenta: {
		width: 90
	}
}));

function AdminInicio(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [ value, setValue ] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleChangeIndex = (index) => {
		setValue(index);
	};

	return (
		<div className={classes.root}>
			<Toolbar />
			<Box>
				<AppBar position="static" color="default" elevation={0}>
					<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered variant="scrollable" scrollButtons="on">
						<Tab label="Mi empresa" icon={<FcShop className={classes.icon} />} {...a11yProps(0)} />
						<Tab
							label="Almacenes"
							icon={<img src={almacenIcon} alt="icono almacen" className={classes.iconSvg} />}
							{...a11yProps(1)}
						/>
						<Tab label="Cajas" icon={<FcPrint className={classes.icon} />} {...a11yProps(2)} />
						<Tab label="Compras" icon={<FcPaid className={classes.icon} />} {...a11yProps(3)} />
						<Tab label="Catalogos" icon={<FcNews className={classes.icon} />} {...a11yProps(4)} />
						<Tab
							label="Tesoreria"
							icon={<img src={moneyIcon} alt="icono money" className={classes.iconSvg} />}
							{...a11yProps(5)}
						/>
						<Tab label="Reportes" icon={<FcSurvey className={classes.icon} />} {...a11yProps(6)} />
						<Tab
							label="Ventas"
							icon={<img src={cartIcon} alt="icono ventas" className={classes.iconSvg} />}
							{...a11yProps(8)}
							onClick={() => props.history.push('/ventas/venta-general')}
						/>
						<Tab
							label="Facturación"
							icon={<img src={facturaIcon} alt="icono factura" className={classes.iconSvg} />}
							{...a11yProps(7)}
						/>
						
					</Tabs>
				</AppBar>
				<SwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
					index={value}
					onChangeIndex={handleChangeIndex}
				>
					<TabPanel value={value} index={0}>
						<Empresa />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Almacenes />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Cajas />
					</TabPanel>
					<TabPanel value={value} index={3}>
						<Compras />
					</TabPanel>
					<TabPanel value={value} index={4}>
						<Catalogos />
					</TabPanel>
					<TabPanel value={value} index={5}>
						<Tesoreria />
					</TabPanel>
					<TabPanel value={value} index={6}>
						Item Five
					</TabPanel>
					<TabPanel value={value} index={7}>
						Item Six
					</TabPanel>
					<TabPanel value={value} index={8}>
						Ventas
					</TabPanel>
				</SwipeableViews>
			</Box>
		</div>
	);
}

export default withRouter(AdminInicio);
