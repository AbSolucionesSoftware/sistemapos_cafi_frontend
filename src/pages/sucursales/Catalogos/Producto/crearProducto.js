import React, { useState, Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Button, AppBar } from '@material-ui/core';
import { Dialog, DialogActions, Tabs, Tab, Box } from '@material-ui/core';
import almacenIcon from '../../../../icons/tarea-completada.svg';
import imagenesIcon from '../../../../icons/imagenes.svg';
import ventasIcon from '../../../../icons/etiqueta-de-precio.svg';
import registroIcon from '../../../../icons/portapapeles.svg';
import tallasColoresIcon from '../../../../icons/tallas-colores.svg';
import RegistroInfoGenerales from './registrarInfoGeneral';
import RegistroInfoAdidional from './registrarInfoAdicional';
import CargarImagenesProducto from './cargarImagenesProducto';
import { RegProductoContext } from '../../../../context/CtxRegProducto';
import RegistroAlmacenInicial from './AlmacenInicial';
import ColoresTallas from './TallasColores/TallasColores';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-reg-product-${index}`}
			aria-labelledby={`reg-product-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3} minHeight="65vh">{children}</Box>}
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
		id: `reg-product-tab-${index}`,
		'aria-controls': `tabpanel-reg-product-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	iconSvg: {
		width: 50
	}
}));

export default function CrearProducto() {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);
	const [ value, setValue ] = useState(0);
	const { datos, setDatos } = useContext(RegProductoContext);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const toggleModal = () => setOpen(!open);

	const saveData = () => {
		console.log(datos);
		setDatos({
			codigo_barras: ''
		});
	};

	return (
		<Fragment>
			<Button color="primary" variant="contained" size="large" onClick={toggleModal}>
				Nuevo producto
			</Button>
			<Dialog open={open} onClose={toggleModal} fullWidth maxWidth="lg">
				<div className={classes.root}>
					<AppBar position="static" color="default" elevation={0}>
						<Tabs
							value={value}
							onChange={handleChange}
							variant="scrollable"
							scrollButtons="on"
							indicatorColor="primary"
							textColor="primary"
							aria-label="scrollable force tabs example"
						>
							<Tab label="Datos generales" icon={<img src={registroIcon} alt="icono registro" className={classes.iconSvg} />} {...a11yProps(0)} />
							<Tab label="Precios de venta" icon={<img src={ventasIcon} alt="icono venta" className={classes.iconSvg} />} {...a11yProps(1)} />
							<Tab label="Imagenes" icon={<img src={imagenesIcon} alt="icono imagenes" className={classes.iconSvg} />} {...a11yProps(2)} />
							<Tab label="Almacen incial" icon={<img src={almacenIcon} alt="icono almacen" className={classes.iconSvg} />} {...a11yProps(3)} />
							<Tab label="Tallas y colores" icon={<img src={tallasColoresIcon} alt="icono colores" className={classes.iconSvg} />} {...a11yProps(4)} />
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={0}>
						<RegistroInfoGenerales />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<RegistroInfoAdidional />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<CargarImagenesProducto />
					</TabPanel>
					<TabPanel value={value} index={3}>
						<RegistroAlmacenInicial />
					</TabPanel>
					<TabPanel value={value} index={4}>
						<ColoresTallas />
					</TabPanel>
				</div>
				<DialogActions>
					<Button
						variant="outlined"
						color="secondary"
						onClick={toggleModal}
						size="large"
						startIcon={<CloseIcon />}
					>
						Cerrar
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={saveData}
						size="large"
						startIcon={<DoneIcon />}
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
