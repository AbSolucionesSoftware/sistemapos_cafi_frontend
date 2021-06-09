import React, { Fragment, useContext, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, Avatar } from '@material-ui/core';
import { TextField, Typography, Grid } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
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

export default function RegistrarInfoBasica() {
	const classes = useStyles();
	const { datos, setDatos } = useContext(RegProductoContext);
	const [ preview, setPreview ] = useState('');

	//dropzone
	const onDrop = useCallback((acceptedFiles) => {
		// Do something with the files
		// Creamos el objeto de la clase FileReader
		let reader = new FileReader();

		// Leemos el archivo subido y se lo pasamos a nuestro fileReader
		reader.readAsDataURL(acceptedFiles[0]);

		// Le decimos que cuando este listo ejecute el código interno
		reader.onload = function() {
			let image = reader.result;
			setPreview(image);
		};
	}, []);
	const { getRootProps, getInputProps} = useDropzone({
		accept: 'image/jpeg, image/png',
		noKeyboard: true,
		onDrop
	});

	const obtenerCampos = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
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
                            <Box width="100%">
								<Typography>Huella dactilar</Typography>
								
							</Box>
							<Box width="100%">
								<Typography>Numero de cliente</Typography>
								<TextField
									fullWidth
									size="small"
									/* error */
									name="codigo_barras"
									id="form-producto-codigo-barras"
									variant="outlined"
									value={datos.codigo_barras}
									/* helperText="Incorrect entry." */
									onChange={obtenerCampos}
								/>
							</Box>
							<Box width="100%">
								<Typography>Clave de cliente</Typography>
								<TextField
									fullWidth
									size="small"
									/* error */
									name="codigo_barras"
									id="form-producto-codigo-barras"
									variant="outlined"
									value={datos.codigo_barras}
									/* helperText="Incorrect entry." */
									onChange={obtenerCampos}
								/>
							</Box>
						</div>
					</Box>
					<div className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>Nombre Cliente</Typography>
							<TextField
								fullWidth
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>Representante</Typography>
							<TextField
								fullWidth
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
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
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>Num. Telefono</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
                        <Box width="100%">
							<Typography>Num. Celular</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>Email</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
					</div>
                    <Box mt={2}>
                        <Typography><b>Datos domicilio</b></Typography>
                        <Divider />
                    </Box>
                    <div className={classes.formInputFlex}>
						<Box>
							<Typography>Calle</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
                        <Box>
							<Typography>Colonia</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100px">
							<Typography>Num. Ext</Typography>
							<TextField
								
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
                        <Box width="100px">
							<Typography>Num. Int</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100px">
							<Typography>CP</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
					</div>
                    <div className={classes.formInputFlex}>
						<Box width="100%">
							<Typography>Municipio</Typography>
							<TextField
								fullWidth
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>Localidad</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
                        <Box width="100%">
							<Typography>Estado</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
						<Box width="100%">
							<Typography>Pais</Typography>
							<TextField
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
						</Box>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
}
