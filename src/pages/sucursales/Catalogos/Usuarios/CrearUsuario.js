import React, { useState, Fragment, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Button, IconButton } from '@material-ui/core';
import { Dialog, DialogActions, Box } from '@material-ui/core';
import FormularioUsuario from './FormularioUsuario';
import { Add, Edit } from '@material-ui/icons';
import { UsuarioContext } from '../../../../context/Catalogos/usuarioContext';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { useMutation } from '@apollo/client';
import { CREAR_USUARIO, ACTUALIZAR_USUARIO } from '../../../../gql/Catalogos/usuarios';
import { numerosRandom } from '../../../../config/reuserFunctions';

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

export default function CrearUsuario({ accion, datos }) {
	const classes = useStyles();
	const { usuario, setUsuario, setError, update, setUpdate } = useContext(UsuarioContext);
	const [ open, setOpen ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const limpiarCampos = useCallback(
		() => {
			setUsuario({
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
				estado_usuario: true
			});
		},
		[ setUsuario ]
	);

	const toggleModal = () => {
		setOpen(true);
		if (datos) {
			setUsuario(datos);
		}
	};
	const onCloseModal = () => {
		setOpen(false);
		limpiarCampos();
	};

	/* Mutations */
	const [ crearUsuario ] = useMutation(CREAR_USUARIO);
	const [ actualizarUsuario ] = useMutation(ACTUALIZAR_USUARIO);

	console.log(datos);

	const saveData = async () => {
		if (
			!usuario.nombre ||
			!usuario.password ||
			!usuario.repeatPassword ||
			!usuario.telefono ||
			!usuario.email
		) {
			setError({error: true, message: "Este campo es requerido"});
			return;
		}
		if(usuario.password !== usuario.repeatPassword){
			setError({error: true, message: "Las contraseñas no coinciden"});
			return;
		}
		setLoading(true);
		try {
			if (accion === 'registrar') {
				usuario.numero_usuario = numerosRandom(100000000, 999999999);
				usuario.empresa = sesion.empresa;
				usuario.sucursal = sesion.sucursal;
				const input = usuario;
				await crearUsuario({
					variables: {
						input
					}
				});
			} else {
				const { numero_usuario, _id, sucursal, empresa, ...input } = usuario;
				await actualizarUsuario({
					variables: {
						input,
						id: usuario._id
					}
				});
			}
			setUpdate(!update);
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setError({error: false, message: ""});
			setLoading(false);
			onCloseModal();
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};

	return (
		<Fragment>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			{accion === 'registrar' ? (
				<Button color="primary" variant="contained" size="large" onClick={toggleModal}>
					<Add /> Nuevo Usuario
				</Button>
			) : (
				<IconButton onClick={toggleModal}>
					<Edit />
				</IconButton>
			)}
			<Dialog open={open} onClose={onCloseModal} fullWidth maxWidth="md">
				<Box className={classes.root} p={5}>
					<BackdropComponent loading={loading} setLoading={setLoading} />
					<FormularioUsuario accion={accion} />
				</Box>
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
