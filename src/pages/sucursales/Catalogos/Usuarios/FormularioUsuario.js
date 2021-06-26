import React, { Fragment, useContext, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, Avatar } from '@material-ui/core';
import { TextField, Typography, Grid } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { UsuarioContext } from '../../../../context/Catalogos/usuarioContext';

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
						<div className={classes.formInputFlex}>
							<Box width="100%">
								<Typography>
									<span>* </span>Nombre usuario
								</Typography>
								<TextField
									fullWidth
									size="small"
									error={error.error && !usuario.nombre}
									name="nombre"
									variant="outlined"
									value={usuario.nombre ? usuario.nombre : ''}
									helperText={error.message}
									onChange={obtenerCampos}
								/>
							</Box>
						</div>
					</Box>
					<div className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>
								<span>* </span>Contraseña
							</Typography>
							<TextField
								fullWidth
								size="small"
								error={error.error && !usuario.password}
								name="password"
								variant="outlined"
								value={usuario.password ? usuario.password : ''}
								helperText={error.message}
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Repetir contraseña
							</Typography>
							<TextField
								fullWidth
								error={error.error && !usuario.repeatPassword}
								size="small"
								name="repeatPassword"
								variant="outlined"
								value={usuario.repeatPassword ? usuario.repeatPassword : ''}
								helperText={error.message}
								onChange={obtenerCampos}
							/>
						</Box>
					</div>
				</Grid>
				<Grid item md={12}>
					<div className={classes.formInputFlex}>
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
								helperText={error.message}
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
								helperText={error.message}
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
					</div>
					<Box mt={2}>
						<Typography>
							<b>usuario domicilio</b>
						</Typography>
						<Divider />
					</Box>
					<div className={classes.formInputFlex}>
						<Box>
							<Typography>
								<span>* </span>Calle
							</Typography>
							<TextField
								size="small"
								name="calle"
								variant="outlined"
								value={usuario.direccion.calle ? usuario.direccion.calle : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box>
							<Typography>
								<span>* </span>Colonia
							</Typography>
							<TextField
								size="small"
								name="colonia"
								variant="outlined"
								value={usuario.direccion.colonia ? usuario.direccion.colonia : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100px">
							<Typography>
								<span>* </span>Num. Ext
							</Typography>
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
							<Typography>
								<span>* </span>CP
							</Typography>
							<TextField
								size="small"
								name="codigo_postal"
								variant="outlined"
								value={usuario.direccion.codigo_postal ? usuario.direccion.codigo_postal : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
					</div>
					<div className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>
								<span>* </span>Municipio
							</Typography>
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
							<Typography>
								<span>* </span>Estado
							</Typography>
							<TextField
								size="small"
								name="estado"
								variant="outlined"
								value={usuario.direccion.estado ? usuario.direccion.estado : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Pais
							</Typography>
							<TextField
								size="small"
								name="pais"
								variant="outlined"
								value={usuario.direccion.pais ? usuario.direccion.pais : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
}
