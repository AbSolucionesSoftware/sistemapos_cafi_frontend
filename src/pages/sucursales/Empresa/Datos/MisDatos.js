import React, {  useContext,useState,useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, TextField, Button, Dialog, Avatar } from '@material-ui/core';
import { Slide, Typography, IconButton, Toolbar, AppBar, Divider, DialogActions,CircularProgress  } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@material-ui/icons/Close';
import { FcNook } from 'react-icons/fc';
import { useMutation } from '@apollo/client';
import { EmpresaContext } from '../../../../context/Catalogos/empresaContext';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import {  ACTUALIZAR_EMPRESA } from '../../../../gql/Empresa/empresa';


const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		fontSize: 100
	},
	input:{
		width:'100%'	
	},
	subtitle: {
		marginLeft: '10px',
		width:'100%'
	},
	
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& span': {
			color: 'red'
		}
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

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function MisDatos() {
	const classes = useStyles();
	const [ loading, setLoading ] = React.useState(false);
	const [ preview, setPreview ] = useState('');
	const [ open, setOpen ] = React.useState(false);
	const [ error, setError ] = useState({error: false, message: ''});
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const { empresa, setUpdate } = useContext(EmpresaContext);
	const [ actualizarEmpresa ] = useMutation(ACTUALIZAR_EMPRESA);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [ empresaDatos, setEmpresaDatos ] = useState({
		nombre_empresa:'',
        nombre_dueno:'',
		telefono_dueno:'',
		celular:'',
		correo_empresa:'',
        nombre_fiscal:'',
        rfc:'',
		regimen_fiscal:'',
        curp:'',
        info_adicio:'',
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
        direccionFiscal: {
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
        datosBancarios:{
            cuenta: '',
            sucursal: '',
            clave_banco: ''
        },
		imagen: null
	});

	useEffect(() => {
		try {
			setEmpresaDatos({
				nombre_empresa:empresa.nombre_empresa,
				nombre_dueno:empresa.nombre_dueno,
				telefono_dueno:empresa.telefono_dueno,
				celular:empresa.celular,
				correo_empresa:empresa.correo_empresa,
				direccion: empresa.direccion,
				imagen: empresa.imagen
			})
			
		} catch (errorCatch) {
			console.log(errorCatch)
		}
	}, [empresa])

	const actEmp = async () =>{
		try {
			setLoading(true)
			//console.log(empresaDatos, sesion.empresa._id )
			await actualizarEmpresa({
				variables: {
					id: sesion.empresa._id,
					input: empresaDatos
				}
			});
			//console.log(act.data.actualizarEmpresa.message)
			setUpdate(true);
			setLoading(false);
			setAlert({ message: 'Se han actualizado correctamente los datos.', status: 'success', open: true });	
			setError(false);
		} catch (errorCatch) {
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			console.log("ACtualizar Empresa",errorCatch)
		}
	}
	const handleClickOpen = () => {
		setOpen(true);
	};
  
	const handleClose = () => {
		setOpen(false);
	};
	const obtenerCampos = (e) => {
		//console.log(e.target.name, e.target.value)
		setEmpresaDatos({
			...empresaDatos,
			[e.target.name]: e.target.value
		});
	};
	const obtenerCamposDireccion = (e) => {
		setEmpresaDatos({
			...empresaDatos,
			direccion: { ...empresaDatos.direccion, [e.target.name]: e.target.value }
		});
	};

	//dropzone
	const onDrop = useCallback(
		(acceptedFiles) => {
			let reader = new FileReader();
			reader.readAsDataURL(acceptedFiles[0]);
			reader.onload = function() {
				let image = reader.result;
				setPreview(image);
			};
			setEmpresaDatos({
				...empresaDatos,
				imagen: acceptedFiles[0]
			});
		},
		[ empresaDatos, setEmpresaDatos ]
	);
	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/jpeg, image/png',
		noKeyboard: true,
		onDrop
	});

	
	
	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<FcNook className={classes.icon} />
					</Box>
					Datos de empresa
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<SnackBarMessages alert={alert} setAlert={setAlert} />
				<BackdropComponent loading={loading} setLoading={setLoading} />
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Datos
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClose} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>

				<Grid container width="100%" >			
					
						<Grid>
							<Grid item md={5}>
								<form autoComplete="off" className={classes.formInputFlex}>
									<Grid item md={4}>
										<Box className={classes.avatarContainer} {...getRootProps()}>
											<input {...getInputProps()} />
											{preview ? (
												<Avatar className={classes.avatar} src={`${preview}`} />
											) : (
												<Avatar className={classes.avatar} src={`${empresa.imagen}`} />
											)}
										</Box>
									</Grid>
								
									<Grid item md={5}>
										<Grid container  justifyContent="space-evenly">
											<form autoComplete="off" className={classes.formInputFlex} >
												<Box width="425px">
													<Typography>
														<span>* </span>Nombre de empresa
													</Typography>
													<TextField
														fullWidth
														className={classes.input}
														type="text"
														size="small"
														error={error.error && !empresaDatos.nombre_empresa}
														name="nombre_empresa"
														variant="outlined"
														value={empresaDatos.nombre_empresa ? empresaDatos.nombre_empresa : ''}
														helperText={
															error.error && error.message !== 'El campo nombre es obligatorio' ? (
																error.message
															) : (
																''
															)
														}
														onChange={obtenerCampos}
													/>
												</Box>
												<Box width="425px">
													<Typography>
														<span>* </span>Nombre dueño
													</Typography>
													<TextField
														fullWidth
														className={classes.input}
														type="text"
														size="small"
														error={error.error && !empresaDatos.nombre_dueno}
														name="nombre_dueno"
														variant="outlined"
														value={empresaDatos.nombre_dueno ? empresaDatos.nombre_dueno : ''}
														helperText={
															error.error && error.message !== 'El campo nombre es obligatorio' ? (
																error.message
															) : (
																''
															)
														}
														onChange={obtenerCampos}
													/>
												</Box>
											</form>			
										</Grid>
										<Grid container  justifyContent="space-evenly">
											<form autoComplete="off" className={classes.formInputFlex} >
											<Box width="200px">
												<Typography>Teléfono</Typography>
												<TextField
													className={classes.input}
													size="small"
													name="telefono_dueno"
													variant="outlined"
													value={empresaDatos.telefono_dueno ? empresaDatos.telefono_dueno : ''}
													onChange={obtenerCampos}
													
												/>
											</Box>
											<Box width="210px">
												<Typography>Celular</Typography>
												<TextField
													className={classes.input}
													size="small"
													name="celular"
													variant="outlined"
													value={empresaDatos.celular ? empresaDatos.celular : ''}
													onChange={obtenerCampos}
												/>
											</Box>
											<Box width="400px">
												<Typography>E-mail</Typography>
												<TextField
													className={classes.input}
													size="small"
													name="correo_empresa"
													variant="outlined"
													value={empresaDatos.correo_empresa ? empresaDatos.correo_empresa : ''}
													onChange={obtenerCampos}
												/>
											</Box>
											</form>
											</Grid>
										</Grid>
									</form>					
								</Grid>
							</Grid>
					
				</Grid>
				
				<Box mt={2} >
					<Typography className={classes.subtitle}>
						<b>Domicilio empresa</b>
					</Typography>
					<Divider />
				</Box>
				<Grid container  justifyContent="space-evenly">
				<form autoComplete="off" className={classes.formInputFlex} >
					<Box>
						<Typography>Calle</Typography>
						<TextField
							size="small"
							name="calle"
							variant="outlined"
							value={empresaDatos.direccion.calle ? empresaDatos.direccion.calle : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
					<Box>
						<Typography>Colonia</Typography>
						<TextField
							size="small"
							name="colonia"
							variant="outlined"
							value={empresaDatos.direccion.colonia ? empresaDatos.direccion.colonia : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
					<Box width="100px">
						<Typography>Num. Ext</Typography>
						<TextField
							size="small"
							name="no_ext"
							variant="outlined"
							value={empresaDatos.direccion.no_ext ? empresaDatos.direccion.no_ext : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
					<Box width="100px">
						<Typography>Num. Int</Typography>
						<TextField
							size="small"
							name="no_int"
							variant="outlined"
							value={empresaDatos.direccion.no_int ? empresaDatos.direccion.no_int : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
					<Box width="100px">
						<Typography>C.P. </Typography>
						<TextField
							size="small"
							name="codigo_postal"
							variant="outlined"
							value={empresaDatos.direccion.codigo_postal ? empresaDatos.direccion.codigo_postal : ''}
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
							value={empresaDatos.direccion.municipio ? empresaDatos.direccion.municipio : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
					<Box width="100%">
						<Typography>Localidad</Typography>
						<TextField
							size="small"
							name="localidad"
							variant="outlined"
							value={empresaDatos.direccion.localidad ? empresaDatos.direccion.localidad : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
					<Box width="100%">
						<Typography>Estado</Typography>
						<TextField
							size="small"
							name="estado"
							variant="outlined"
							value={empresaDatos.direccion.estado ? empresaDatos.direccion.estado : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
					<Box width="100%">
						<Typography>Pais</Typography>
						<TextField
							size="small"
							name="pais"
							variant="outlined"
							value={empresaDatos.direccion.pais ? empresaDatos.direccion.pais : ''}
							onChange={obtenerCamposDireccion}
						/>
					</Box>
				</form>
				</Grid>
				<Grid>
				<DialogActions>
					<Button
						onClick={()=>actEmp()}
						color="primary"
						variant="contained"
						size="large"
						autoFocus
						endIcon={loading ? <CircularProgress color="inherit" size={25} /> : null}
					>
						Guardar
					</Button>
				</DialogActions>
				</Grid>
			</Dialog>
		</div>
	);
}
