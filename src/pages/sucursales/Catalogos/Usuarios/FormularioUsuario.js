import React, { Fragment, useContext, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, Avatar, IconButton, OutlinedInput, FormHelperText, Button } from '@material-ui/core';
import { TextField, Typography, Grid, FormControl, InputAdornment } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useDropzone } from 'react-dropzone';
import { UsuarioContext } from '../../../../context/Catalogos/usuarioContext';
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { useMutation } from '@apollo/client';
import { ACTUALIZAR_USUARIO } from '../../../../gql/Catalogos/usuarios';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& span': {
			color: 'red'
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	avatarContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 150,
		height: 150,
		border: 'dashed 2px black',
		borderRadius: '100%'
	},
	avatar: {
		width: 130,
		height: 130,
		'& > .icon': {
			fontSize: 100
		}
	}
}));

export default function FormularioUsuario({ accion }) {
	const classes = useStyles();
	const { usuario, setUsuario, error } = useContext(UsuarioContext);
	const [ preview, setPreview ] = useState('');
	const [ showPassword, setShowPassword ] = useState(false);

	//dropzone
	const onDrop = useCallback(
		(acceptedFiles) => {
			let reader = new FileReader();
			reader.readAsDataURL(acceptedFiles[0]);
			reader.onload = function() {
				let image = reader.result;
				setPreview(image);
			};
			setUsuario({
				...usuario,
				imagen: acceptedFiles[0]
			});
		},
		[ usuario, setUsuario ]
	);

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/jpeg, image/png',
		noKeyboard: true,
		onDrop
	});

	const obtenerCampos = (e) => {
		const name = e.target.name;
		if (name === 'numero_usuario') {
			setUsuario({
				...usuario,
				[e.target.name]: parseInt(e.target.value)
			});
			return;
		}
		setUsuario({
			...usuario,
			[e.target.name]: e.target.value
		});
	};
	const obtenerCamposDireccion = (e) => {
		setUsuario({
			...usuario,
			direccion: { ...usuario.direccion, [e.target.name]: e.target.value }
		});
	};

	return (
		<Fragment>
			<Grid container>
				<Grid item md={3}>
					<Box className={classes.avatarContainer} {...getRootProps()}>
						<input {...getInputProps()} />
						{preview ? (
							<Avatar className={classes.avatar} src={`${preview}`} />
						) : (
							<Avatar className={classes.avatar} src={`${usuario.imagen}`} />
						)}
					</Box>
				</Grid>
				<Grid item md={9}>
					<Box>
						<form autoComplete="off" className={classes.formInputFlex}>
							<Box width="100%">
								<Typography>
									<span>* </span>Nombre usuario
								</Typography>
								<TextField
									fullWidth
									type="text"
									size="small"
									error={error.error && !usuario.nombre}
									name="nombre"
									variant="outlined"
									value={usuario.nombre ? usuario.nombre : ''}
									helperText={
										error.error && error.message !== 'Las contraseñas no coinciden' ? (
											error.message
										) : (
											''
										)
									}
									onChange={obtenerCampos}
								/>
							</Box>
						</form>
					</Box>
					{accion === 'registrar' ? (
						<form autoComplete="off" className={classes.formInputFlex}>
							<Box width="100%">
								<Typography>
									<span>* </span>Contraseña
								</Typography>
								<FormControl
									fullWidth
									size="small"
									error={
										error.error && !usuario.password ? (
											true
										) : error.error && error.message === 'Las contraseñas no coinciden' ? (
											true
										) : (
											false
										)
									}
									name="password"
									variant="outlined"
								>
									<OutlinedInput
										name="password"
										type={showPassword ? 'text' : 'password'}
										value={usuario.password ? usuario.password : ''}
										onChange={obtenerCampos}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													size="small"
													aria-label="toggle password visibility"
													onClick={() => setShowPassword(!showPassword)}
													onMouseDown={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<Visibility color="primary" />
													) : (
														<VisibilityOff color="primary" />
													)}
												</IconButton>
											</InputAdornment>
										}
									/>
									<FormHelperText>{error.message}</FormHelperText>
								</FormControl>
							</Box>
							<Box width="100%">
								<Typography>
									<span>* </span>Repetir contraseña
								</Typography>
								<FormControl
									fullWidth
									size="small"
									error={
										error.error && !usuario.password ? (
											true
										) : error.error && error.message === 'Las contraseñas no coinciden' ? (
											true
										) : (
											false
										)
									}
									name="repeatPassword"
									variant="outlined"
								>
									<OutlinedInput
										name="repeatPassword"
										type={showPassword ? 'text' : 'password'}
										value={usuario.repeatPassword ? usuario.repeatPassword : ''}
										onChange={obtenerCampos}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													size="small"
													aria-label="toggle password visibility"
													onClick={() => setShowPassword(!showPassword)}
													onMouseDown={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<Visibility color="primary" />
													) : (
														<VisibilityOff color="primary" />
													)}
												</IconButton>
											</InputAdornment>
										}
									/>
									<FormHelperText>{error.message}</FormHelperText>
								</FormControl>
							</Box>
						</form>
					) : (
						<ActualizarPasswordModal />
					)}
				</Grid>
				<Grid item md={12}>
					<form autoComplete="off" className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>
								<span>* </span>Email
							</Typography>
							<TextField
								fullWidth
								size="small"
								error={error.error && !usuario.email}
								name="email"
								variant="outlined"
								value={usuario.email ? usuario.email : ''}
								helperText={
									error.error && error.message !== 'Las contraseñas no coinciden' ? error.message : ''
								}
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Num. Telefono
							</Typography>
							<TextField
								fullWidth
								size="small"
								error={error.error && !usuario.telefono}
								name="telefono"
								variant="outlined"
								value={usuario.telefono ? usuario.telefono : ''}
								helperText={
									error.error && error.message !== 'Las contraseñas no coinciden' ? error.message : ''
								}
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>Num. Celular</Typography>
							<TextField
								fullWidth
								size="small"
								name="celular"
								variant="outlined"
								value={usuario.celular ? usuario.celular : ''}
								onChange={obtenerCampos}
							/>
						</Box>
					</form>
					<Box mt={2}>
						<Typography>
							<b>usuario domicilio</b>
						</Typography>
						<Divider />
					</Box>
					<form autoComplete="off" className={classes.formInputFlex}>
						<Box>
							<Typography>Calle</Typography>
							<TextField
								size="small"
								name="calle"
								variant="outlined"
								value={usuario.direccion.calle ? usuario.direccion.calle : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box>
							<Typography>Colonia</Typography>
							<TextField
								size="small"
								name="colonia"
								variant="outlined"
								value={usuario.direccion.colonia ? usuario.direccion.colonia : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100px">
							<Typography>Num. Ext</Typography>
							<TextField
								size="small"
								name="no_ext"
								variant="outlined"
								value={usuario.direccion.no_ext ? usuario.direccion.no_ext : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100px">
							<Typography>Num. Int</Typography>
							<TextField
								size="small"
								name="no_int"
								variant="outlined"
								value={usuario.direccion.no_int ? usuario.direccion.no_int : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100px">
							<Typography>CP</Typography>
							<TextField
								size="small"
								name="codigo_postal"
								variant="outlined"
								value={usuario.direccion.codigo_postal ? usuario.direccion.codigo_postal : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
					</form>
					<form autoComplete="off" className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>Municipio</Typography>
							<TextField
								fullWidth
								size="small"
								name="municipio"
								variant="outlined"
								value={usuario.direccion.municipio ? usuario.direccion.municipio : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>Localidad</Typography>
							<TextField
								size="small"
								name="localidad"
								variant="outlined"
								value={usuario.direccion.localidad ? usuario.direccion.localidad : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>Estado</Typography>
							<TextField
								size="small"
								name="estado"
								variant="outlined"
								value={usuario.direccion.estado ? usuario.direccion.estado : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>Pais</Typography>
							<TextField
								size="small"
								name="pais"
								variant="outlined"
								value={usuario.direccion.pais ? usuario.direccion.pais : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
					</form>
				</Grid>
			</Grid>
		</Fragment>
	);
}

const ActualizarPasswordModal = () => {
	const [ open, setOpen ] = useState(false);
	const { usuario, setUsuario, error, setError, update, setUpdate } = useContext(UsuarioContext);
	const [ showPassword, setShowPassword ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });

	const [ actualizarUsuario ] = useMutation(ACTUALIZAR_USUARIO);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setError({ error: false, message: '' });
	};

	const obtenerCampos = (e) => {
		setUsuario({
			...usuario,
			[e.target.name]: e.target.value
		});
	};

	const confirmarPassowrd = async () => {
		if (!usuario.password || !usuario.repeatPassword) {
			setError({ error: true, message: 'Este campo es requerido' });
			return;
		}
		if (usuario.password !== usuario.repeatPassword) {
			setError({ error: true, message: 'Las contraseñas no coinciden' });
			return;
		}
		setLoading(true);

		try {
			await actualizarUsuario({
				variables: {
					input: {
						password: usuario.password,
						repeatPassword: usuario.repeatPassword
					},
					id: usuario._id
				}
			});
			setUpdate(!update);
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
			handleClose();
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};

	return (
		<Fragment>
			<Button color="primary" variant="text" onClick={handleClickOpen}>
				Cambiar contraseña
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<SnackBarMessages alert={alert} setAlert={setAlert} />
				<DialogTitle id="alert-dialog-title">{'Cambiar contraseña'}</DialogTitle>
				<DialogContent>
					<form autoComplete="off">
						<Box width="100%">
							<Typography>
								<span>* </span>Contraseña
							</Typography>
							<FormControl
								fullWidth
								size="small"
								error={
									error.error && !usuario.password ? (
										true
									) : error.error && error.message === 'Las contraseñas no coinciden' ? (
										true
									) : (
										false
									)
								}
								name="password"
								variant="outlined"
							>
								<OutlinedInput
									name="password"
									type={showPassword ? 'text' : 'password'}
									value={usuario.password ? usuario.password : ''}
									onChange={obtenerCampos}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												size="small"
												aria-label="toggle password visibility"
												onClick={() => setShowPassword(!showPassword)}
												onMouseDown={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<Visibility color="primary" />
												) : (
													<VisibilityOff color="primary" />
												)}
											</IconButton>
										</InputAdornment>
									}
								/>
								<FormHelperText>{error.message}</FormHelperText>
							</FormControl>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Repetir contraseña
							</Typography>
							<FormControl
								fullWidth
								size="small"
								error={
									error.error && !usuario.password ? (
										true
									) : error.error && error.message === 'Las contraseñas no coinciden' ? (
										true
									) : (
										false
									)
								}
								name="repeatPassword"
								variant="outlined"
							>
								<OutlinedInput
									name="repeatPassword"
									type={showPassword ? 'text' : 'password'}
									value={usuario.repeatPassword ? usuario.repeatPassword : ''}
									onChange={obtenerCampos}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												size="small"
												aria-label="toggle password visibility"
												onClick={() => setShowPassword(!showPassword)}
												onMouseDown={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<Visibility color="primary" />
												) : (
													<VisibilityOff color="primary" />
												)}
											</IconButton>
										</InputAdornment>
									}
								/>
								<FormHelperText>{error.message}</FormHelperText>
							</FormControl>
						</Box>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancelar
					</Button>
					<Button
						onClick={confirmarPassowrd}
						color="primary"
						variant="contained"
						autoFocus
						endIcon={loading ? <CircularProgress color="inherit" size={25} /> : null}
					>
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
