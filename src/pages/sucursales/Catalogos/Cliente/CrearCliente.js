import React, { useState, Fragment, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Button, AppBar, IconButton } from '@material-ui/core';
import { Dialog, DialogActions, Tabs, Tab, Box } from '@material-ui/core';
import perfilIcon from '../../../../icons/perfil.svg';
import fiscalIcon from '../../../../icons/fiscal.svg';
import RegistrarInfoBasica from './RegistrarInfoBasica';
import RegistrarInfoCredito from './RegistroInfoCredito';
import { Add, Edit } from '@material-ui/icons';
import { ClienteCtx } from '../../../../context/Catalogos/crearClienteCtx';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { useMutation } from '@apollo/client';
import { CREAR_CLIENTE, ACTUALIZAR_CLIENTE, OBTENER_CLIENTES } from '../../../../gql/Catalogos/clientes';

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
				<Box p={3} minHeight="70vh">
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
	}
}));

export default function CrearCliente({ tipo, accion, datos }) {
	const classes = useStyles();
	const { cliente, setCliente, setError } = useContext(ClienteCtx);
	const [ open, setOpen ] = useState(false);
	const [ value, setValue ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });

	const limpiarCampos = useCallback(
		() => {
			setCliente({
				direccion: {
					calle: '',
					no_ext: '',
					no_int: '',
					codigo_postal: '',
					colonia: '',
					municipio: '',
					localidad: '',
					estado: '',
					pais: ''
				},
				estado_cliente: true,
				tipo_cliente: 'CLIENTE'
			});
		},
		[ setCliente ]
	);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const toggleModal = () => {
		setOpen(true);
		if (datos) {
			setCliente(datos);
		}
	};
	const onCloseModal = () => {
		setOpen(false);
		limpiarCampos();
	};

	/* Mutations */
	const [ crearCliente ] = useMutation(CREAR_CLIENTE, {
		update(cache, { data: { crearCliente } }) {
			const { obtenerClientes } = cache.readQuery({
				query: OBTENER_CLIENTES
			});

			cache.writeQuery({
				query: OBTENER_CLIENTES,
				data: {
					obtenerClientes: {
						...obtenerClientes,
						crearCliente
					}
				}
			});
		}
	});
	const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE, {
		update(cache, { data: { actualizarCliente } }) {
			const { obtenerClientes } = cache.readQuery({
				query: OBTENER_CLIENTES
			});

			cache.writeQuery({
				query: OBTENER_CLIENTES,
				data: {
					obtenerClientes: {
						...obtenerClientes,
						actualizarCliente
					}
				}
			});
		}
	});

	const saveData = async () => {
		const input = cliente;
		if (
			!input.numero_cliente ||
			!input.clave_cliente ||
			!input.nombre_cliente ||
			!input.representante ||
			!input.telefono ||
			!input.email ||
			!input.direccion.calle ||
			!input.direccion.colonia ||
			!input.direccion.no_ext ||
			!input.direccion.codigo_postal ||
			!input.direccion.municipio ||
			!input.direccion.estado ||
			!input.direccion.pais
		) {
			setError(true);
			return;
		}
		setLoading(true);
		console.log(input);
		try {
			if (accion === 'registrar') {
				await crearCliente({
					variables: {
						input
					}
				});
			} else {
				await actualizarCliente({
					variables: {
						input,
						id: cliente._id
					}
				});
			}
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setError(false);
			setLoading(false);
		} catch (error) {
			console.log(error.networkError.result.errors);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};

	return (
		<Fragment>
			{accion === 'registrar' ? (
				<Button color="primary" variant="contained" size="large" onClick={toggleModal}>
					<Add /> Nuevo {tipo}
				</Button>
			) : (
				<IconButton onClick={toggleModal}>
					<Edit />
				</IconButton>
			)}
			<Dialog open={open} onClose={onCloseModal} fullWidth maxWidth="md">
				<SnackBarMessages alert={alert} setAlert={setAlert} />
				<div className={classes.root}>
					<BackdropComponent loading={loading} setLoading={setLoading} />
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
								label="Información básica"
								icon={<img src={perfilIcon} alt="icono perfil" className={classes.iconSvg} />}
								{...a11yProps(0)}
							/>
							<Tab
								label="Datos Crediticios"
								icon={<img src={fiscalIcon} alt="icono factura" className={classes.iconSvg} />}
								{...a11yProps(1)}
							/>
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={0}>
						<RegistrarInfoBasica tipo={tipo} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<RegistrarInfoCredito tipo={tipo} />
					</TabPanel>
				</div>
				<DialogActions>
					<Button
						variant="outlined"
						color="secondary"
						onClick={onCloseModal}
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
