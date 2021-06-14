import React, { Fragment, useContext, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, Avatar } from '@material-ui/core';
import { TextField, Typography, Grid } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { useDropzone } from 'react-dropzone';
import { ClienteCtx } from '../../../../context/Catalogos/crearClienteCtx';

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

export default function RegistrarInfoBasica({ tipo }) {
	const classes = useStyles();
	const { cliente, setCliente, error } = useContext(ClienteCtx);
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
			setCliente({
				...cliente,
				imagen: acceptedFiles[0]
			});
		},
		[ cliente, setCliente ]
	);

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/jpeg, image/png',
		noKeyboard: true,
		onDrop
	});

	const obtenerCampos = (e) => {
		const name = e.target.name;
		if (name === 'numero_cliente' || name === 'clave_cliente') {
			setCliente({
				...cliente,
				[e.target.name]: parseInt(e.target.value)
			});
			return;
		}
		setCliente({
			...cliente,
			[e.target.name]: e.target.value
		});
	};
	const obtenerCamposDireccion = (e) => {
		setCliente({
			...cliente,
			direccion: { ...cliente.direccion, [e.target.name]: e.target.value }
		});
	};

	return (
		<Fragment>
			<Grid container>
				<Grid item md={3}>
					<Box className={classes.avatarContainer} {...getRootProps()}>
						<input {...getInputProps()} />
						{preview ? (
							<Avatar className={classes.avatar} src={preview} />
						) : (
							<Avatar className={classes.avatar}>
								<AccountCircle className="icon" />
							</Avatar>
						)}
					</Box>
				</Grid>
				<Grid item md={9}>
					<Box display="flex" justifyContent="flex-end" width="100%">
						<div className={classes.formInputFlex}>
							{/* <Box width="100%">
								<Typography>Huella dactilar</Typography>
								
							</Box> */}
							<Box width="100%">
								<Typography>
									<span>* </span>Numero de cliente
								</Typography>
								<TextField
									fullWidth
									size="small"
									error={error && !cliente.numero_cliente}
									name="numero_cliente"
									variant="outlined"
									value={cliente.numero_cliente ? cliente.numero_cliente : ''}
									helperText={error ? 'Campo Requerido' : ''}
									onChange={obtenerCampos}
								/>
							</Box>
							<Box width="100%">
								<Typography>
									<span>* </span>Clave de cliente
								</Typography>
								<TextField
									fullWidth
									size="small"
									error={error && !cliente.clave_cliente}
									name="clave_cliente"
									variant="outlined"
									value={cliente.clave_cliente ? cliente.clave_cliente : ''}
									helperText={error ? 'Campo Requerido' : ''}
									onChange={obtenerCampos}
								/>
							</Box>
						</div>
					</Box>
					<div className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>
								<span>* </span>Nombre Cliente
							</Typography>
							<TextField
								fullWidth
								size="small"
								error={error && !cliente.nombre_cliente}
								name="nombre_cliente"
								variant="outlined"
								value={cliente.nombre_cliente ? cliente.nombre_cliente : ''}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Representante
							</Typography>
							<TextField
								fullWidth
								size="small"
								error={error && !cliente.representante}
								name="representante"
								variant="outlined"
								value={cliente.representante ? cliente.representante : ''}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCampos}
							/>
						</Box>
					</div>
				</Grid>
				<Grid item md={12}>
					<div className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>CURP</Typography>
							<TextField
								fullWidth
								size="small"
								name="curp"
								variant="outlined"
								value={cliente.curp ? cliente.curp : ''}
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Num. Telefono
							</Typography>
							<TextField
								size="small"
								error={error && !cliente.telefono}
								name="telefono"
								variant="outlined"
								value={cliente.telefono ? cliente.telefono : ''}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>Num. Celular</Typography>
							<TextField
								size="small"
								name="celular"
								variant="outlined"
								value={cliente.celular ? cliente.celular : ''}
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Email
							</Typography>
							<TextField
								size="small"
								error={error && !cliente.email}
								name="email"
								variant="outlined"
								value={cliente.email ? cliente.email : ''}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCampos}
							/>
						</Box>
					</div>
					<Box mt={2}>
						<Typography>
							<b>cliente domicilio</b>
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
								error={error && !cliente.direccion.calle}
								name="calle"
								variant="outlined"
								value={cliente.direccion.calle}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box>
							<Typography>
								<span>* </span>Colonia
							</Typography>
							<TextField
								size="small"
								error={error && !cliente.direccion.colonia}
								name="colonia"
								variant="outlined"
								value={cliente.direccion.colonia}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100px">
							<Typography>
								<span>* </span>Num. Ext
							</Typography>
							<TextField
								size="small"
								error={error && !cliente.direccion.no_ext}
								name="no_ext"
								variant="outlined"
								value={cliente.direccion.no_ext}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100px">
							<Typography>Num. Int</Typography>
							<TextField
								size="small"
								name="no_int"
								variant="outlined"
								value={cliente.direccion.no_int}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100px">
							<Typography>
								<span>* </span>CP
							</Typography>
							<TextField
								size="small"
								error={error && !cliente.direccion.codigo_postal}
								name="codigo_postal"
								variant="outlined"
								value={cliente.direccion.codigo_postal}
								helperText={error ? 'Campo Requerido' : ''}
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
								error={error && !cliente.direccion.municipio}
								name="municipio"
								variant="outlined"
								value={cliente.direccion.municipio}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>Localidad</Typography>
							<TextField
								size="small"
								name="localidad"
								variant="outlined"
								value={cliente.direccion.localidad}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Estado
							</Typography>
							<TextField
								size="small"
								error={error && !cliente.direccion.estado}
								name="estado"
								variant="outlined"
								value={cliente.direccion.estado}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>
								<span>* </span>Pais
							</Typography>
							<TextField
								size="small"
								error={error && !cliente.direccion.pais}
								name="pais"
								variant="outlined"
								value={cliente.direccion.pais}
								helperText={error ? 'Campo Requerido' : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
}
