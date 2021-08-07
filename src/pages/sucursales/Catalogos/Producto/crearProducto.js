import React, { useState, Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Button, AppBar, Badge, Typography, CircularProgress, Backdrop } from '@material-ui/core';
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
import { validaciones } from './validaciones';
import CentroCostos from './CentroCostos';
import PrecioPlazos from './PrecioPlazos/PrecioPlazos';

import {
	initial_state_datos_generales,
	initial_state_precios,
	initial_state_unidadVentaXDefecto,
	initial_state_preciosP,
	initial_state_unidadesVenta,
	initial_state_almacen_inicial,
	initial_state_centro_de_costos,
	initial_state_preciosPlazos,
	initial_state_subcategorias,
	initial_state_imagenes,
	initial_state_onPreview,
	initial_state_validacion,
	initial_state_subcostos
} from '../../../../context/Catalogos/initialStatesProducto';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import SnackBarMessages from '../../../../components/SnackBarMessages';

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
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

export default function CrearProducto({ accion }) {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);
	const [ value, setValue ] = useState(0);
	const { datos_generales, setDatosGenerales, precios, setPrecios, validacion, setValidacion } = useContext(
		RegProductoContext
	);
	const { preciosP, setPreciosP, imagenes, setImagenes, unidadesVenta, setUnidadesVenta } = useContext(
		RegProductoContext
	);
	const { almacen_inicial, setAlmacenInicial, unidadVentaXDefecto } = useContext(RegProductoContext);
	const { setUnidadVentaXDefecto, centro_de_costos, setCentroDeCostos } = useContext(RegProductoContext);
	const { preciosPlazos, setPreciosPlazos, setSubcategorias, setOnPreview, setSubcostos } = useContext(
		RegProductoContext
	);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const [ loading, setLoading ] = useState(false);

	/* Mutations */
	const [ crearProducto ] = useMutation(CREAR_PRODUCTO);

	const toggleModal = () => {
		setOpen(!open);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	/* ###### GUARDAR LA INFO EN LA BD ###### */

	const saveData = async () => {
		const validate = validaciones(datos_generales, precios, almacen_inicial);

		if (validate.error) {
			setValidacion(validate);
			return;
		}
		setValidacion(validate);

		if (unidadesVenta.length === 0) {
			unidadesVenta.push(unidadVentaXDefecto);
		} else {
			const unidadxdefecto = unidadesVenta.filter((unidades) => unidades.default);
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
			usuario: sesion._id
		};

		console.log(input);
		setLoading(true);
		try {
			await crearProducto({
				variables: {
					input
				}
			});
			resetInitialStates();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
			toggleModal();
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};

	/* ###### RESET STATES ###### */
	const resetInitialStates = () => {
		setDatosGenerales(initial_state_datos_generales);
		setPrecios(initial_state_precios);
		setUnidadVentaXDefecto(initial_state_unidadVentaXDefecto);
		setPreciosP(initial_state_preciosP);
		setUnidadesVenta(initial_state_unidadesVenta);
		setAlmacenInicial(initial_state_almacen_inicial);
		setCentroDeCostos(initial_state_centro_de_costos);
		setPreciosPlazos(initial_state_preciosPlazos);
		setSubcategorias(initial_state_subcategorias);
		setImagenes(initial_state_imagenes);
		setOnPreview(initial_state_onPreview);
		setValidacion(initial_state_validacion);
		setSubcostos(initial_state_subcostos);
	};

	return (
		<Fragment>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			{accion ? (
				<Button color="primary" variant="contained" size="large" onClick={() => toggleModal()}>
					Nuevo producto
				</Button>
			) : (
				<Button color="primary" variant="contained" size="large" onClick={() => toggleModal()}>
					Editar producto
				</Button>
			)}
			<Dialog
				open={open}
				onClose={toggleModal}
				fullWidth
				maxWidth="lg"
				scroll="paper"
				disableEscapeKeyDown
				disableBackdropClick
			>
				<AppBar position="static" color="default" elevation={0}>
					<Box display="flex" justifyContent="space-between">
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
								icon={
									<Badge
										color="secondary"
										badgeContent={<Typography variant="h6">!</Typography>}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'right'
										}}
										invisible={validacion.error && validacion.vista3 ? false : true}
									>
										<img src={almacenIcon} alt="icono almacen" className={classes.iconSvg} />
									</Badge>
								}
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
									icon={
										<img src={tallasColoresIcon} alt="icono colores" className={classes.iconSvg} />
									}
									{...a11yProps(6)}
								/>
							) : null}
						</Tabs>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={() => toggleModal()} size="large">
								<CloseIcon />
							</Button>
						</Box>
					</Box>
				</AppBar>
				<DialogContent className={classes.dialogContent}>
				<Backdrop className={classes.backdrop} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
					<ContenidoModal accion={accion} value={value} />
				</DialogContent>
				<DialogActions>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => setValue( value - 1)}
						size="large"
						startIcon={<NavigateBefore />}
						disabled={value === 0}
					>
						Anterior
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => setValue( value + 1)}
						size="large"
						endIcon={<NavigateNext />}
						disabled={value === 5}
						disableElevation
					>
						Siguiente
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => saveData()}
						size="large"
						startIcon={<DoneIcon />}
						disabled={
							!datos_generales.clave_alterna ||
							!datos_generales.tipo_producto ||
							!datos_generales.nombre_generico ||
							!datos_generales.nombre_comercial ||
							!precios.precio_de_compra.precio_con_impuesto ||
							!precios.precio_de_compra.precio_sin_impuesto ||
							!precios.unidad_de_compra.cantidad ? (
								true
							) : (
								false
							)
						}
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
				<RegistroAlmacenInicial obtenerConsultasProducto={obtenerConsultasProducto} refetch={refetch} />
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
