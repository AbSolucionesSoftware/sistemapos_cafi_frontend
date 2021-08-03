import React, { useState, Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Button, AppBar, Badge, Typography, CircularProgress } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, Tabs, Tab, Box } from '@material-ui/core';
import almacenIcon from '../../../../icons/tarea-completada.svg';
import imagenesIcon from '../../../../icons/imagenes.svg';
import ventasIcon from '../../../../icons/etiqueta-de-precio.svg';
import registroIcon from '../../../../icons/portapapeles.svg';
import costosIcon from '../../../../icons/costos.svg';
import calendarIcon from '../../../../icons/calendar.svg';
import tallasColoresIcon from '../../../../icons/tallas-colores.svg';
import RegistroInfoGenerales from './registrarInfoGeneral';
import RegistroInfoAdidional from '../Producto/PreciosVenta/registrarInfoAdicional';
import CargarImagenesProducto from './cargarImagenesProducto';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';
import RegistroAlmacenInicial from './AlmacenInicial';
import ColoresTallas from './TallasColores/TallasColores';
import ErrorPage from '../../../../components/ErrorPage';

import { useMutation, useQuery } from '@apollo/client';
import { CREAR_PRODUCTO, OBTENER_CONSULTAS } from '../../../../gql/Catalogos/productos';
import validaciones from './validaciones';
import CentroCostos from './CentroCostos';
import PrecioPlazos from './PrecioPlazos/PrecioPlazos';

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
			{value === index && (
				<Box p={3} height="70vh">
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
	},
	dialogContent: {
		padding: 0
	},
}));

export default function CrearProducto({ accion }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(0);
	const {
		datos_generales, setDatosGenerales,
		precios, /* setPrecios, */
		validacion, setValidacion,
		preciosP,
		imagenes, /* setImagenes, */
		unidadesVenta, setUnidadesVenta,
		almacen_inicial, /* setAlmacenInicial, */
		unidadVentaXDefecto, setUnidadVentaXDefecto,
		centro_de_costos, /* setCentroDeCostos */
		preciosPlazos, /* setPreciosPlazos, */
	} = useContext(RegProductoContext);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	/* Mutations */
	const [crearProducto] = useMutation(CREAR_PRODUCTO);

	const toggleModal = () => {
		setOpen(!open);
		setDatosGenerales({});
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const saveData = async () => {
		const validate = validaciones(datos_generales, precios);

		/* if (validate.error) {
			setValidacion(validate);
			return
		}
		setValidacion(validate); */

		if (unidadesVenta.length === 0) {
			unidadesVenta.push(unidadVentaXDefecto);
		} else {
			const unidadxdefecto = unidadesVenta.filter(unidades => unidades.default);
			if (unidadxdefecto.length === 0) unidadesVenta.push(unidadVentaXDefecto);
		}

		precios.precios_producto = preciosP;

		const input = {
			datos_generales,
			precios,
			imagenes,
			almacen_inicial,
			centro_de_costos,
			unidades_de_venta: unidadesVenta,
			precio_plazos: preciosPlazos,
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			usuario: sesion._id,
		};

		console.log(input);

		try {
			await crearProducto({
				variables: {
					input
				}
			});
		} catch (error) {
			console.log(error);
		}
		/* setProductos({
			codigo_barras: ''
		}); */
	};

	return (
		<Fragment>
			{accion ? (
				<Button color="primary" variant="contained" size="large" onClick={toggleModal}>
					Nuevo producto
				</Button>
			) : (
				<Button color="primary" variant="contained" size="large" onClick={toggleModal}>
					Editar producto
				</Button>
			)}
			<Dialog open={open} onClose={toggleModal} fullWidth maxWidth="lg" scroll="paper" disableEscapeKeyDown disableBackdropClick>
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
						<Tab
							label="Datos generales"
							icon={
								<Badge
									color="secondary"
									badgeContent={<Typography variant="h6">!</Typography>}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right'
									}}
									invisible={validacion.error && validacion.vista1 ? false : true}
								>
									<img src={registroIcon} alt="icono registro" className={classes.iconSvg} />
								</Badge>
							}
							{...a11yProps(0)}
						/>
						<Tab
							label="Precios de venta"
							icon={
								<Badge
									color="secondary"
									badgeContent={<Typography variant="h6">!</Typography>}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right'
									}}
									invisible={validacion.error && validacion.vista2 ? false : true}
								>
									<img src={ventasIcon} alt="icono venta" className={classes.iconSvg} />
								</Badge>
							}
							{...a11yProps(1)}
						/>
						<Tab
							label="Inventario y almacen"
							icon={<img src={almacenIcon} alt="icono almacen" className={classes.iconSvg} />}
							{...a11yProps(2)}
						/>
						<Tab
							label="Centro de costos"
							icon={<img src={costosIcon} alt="icono almacen" className={classes.iconSvg} />}
							{...a11yProps(3)}
						/>
						<Tab
							label="Precios a plazos"
							icon={<img src={calendarIcon} alt="icono almacen" className={classes.iconSvg} />}
							{...a11yProps(4)}
						/>
						<Tab
							label="Imagenes"
							icon={<img src={imagenesIcon} alt="icono imagenes" className={classes.iconSvg} />}
							{...a11yProps(5)}
						/>
						{!accion ? (
							<Tab
								label="Tallas y colores"
								icon={<img src={tallasColoresIcon} alt="icono colores" className={classes.iconSvg} />}
								{...a11yProps(6)}
							/>
						) : null}
					</Tabs>
				</AppBar>
				<DialogContent className={classes.dialogContent}>
					<ContenidoModal accion={accion} value={value} />
				</DialogContent>
				<DialogActions>
					<Button
						variant="outlined"
						color="primary"
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

const ContenidoModal = ({ accion, value }) => {
	const classes = useStyles();
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_CONSULTAS, {
		variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id }
	});

	if (loading)
		return (
			<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
				<CircularProgress />
				<Typography variant="h6">Cargando...</Typography>
			</Box>
		);

	if (error) return <ErrorPage error={error} />;

	const { obtenerConsultasProducto } = data;



	return (
		<div className={classes.root}>
			<TabPanel value={value} index={0}>
				<RegistroInfoGenerales obtenerConsultasProducto={obtenerConsultasProducto} refetch={refetch} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<RegistroInfoAdidional />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<RegistroAlmacenInicial obtenerConsultasProducto={obtenerConsultasProducto} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<CentroCostos obtenerConsultasProducto={obtenerConsultasProducto} />
			</TabPanel>
			<TabPanel value={value} index={4}>
				<PrecioPlazos />
			</TabPanel>
			<TabPanel value={value} index={5}>
				<CargarImagenesProducto />
			</TabPanel>
			<TabPanel value={value} index={6}>
				<ColoresTallas />
			</TabPanel>
		</div>
	);
};
