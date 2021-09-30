import React, {  useContext,useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Grid, TextField, Button, Dialog } from '@material-ui/core';
import { Slide, Typography, Toolbar, AppBar, Divider, DialogActions  } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import ErrorPage from '../../../../components/ErrorPage';
import { FcDocument } from 'react-icons/fc';
import { useMutation, useQuery } from '@apollo/client';

import { EmpresaContext } from '../../../../context/Catalogos/empresaContext';
import {  ACTUALIZAR_EMPRESA, OBTENER_DATOS_EMPRESA } from '../../../../gql/Empresa/empresa';
import { cleanTypenames } from '../../../../config/reuserFunctions';

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
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function InformacionFiscal() {
	const classes = useStyles();
	const [ loadingPage, setLoadingPage ] = React.useState(false);
	const [ open, setOpen ] = React.useState(false);
	const [ errorPage, setErrorPage ] = React.useState(false);
	const [ errorForm, setErrorForm ] = React.useState( useState({error: false, message: ''}));
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [bloqueo ] = useState(sesion.accesos.mi_empresa.informacion_fiscal.editar === false ? true : false);
	const { empresa, update, setEmpresa, setUpdate } = useContext(EmpresaContext);
	const [ actualizarEmpresa ] = useMutation(ACTUALIZAR_EMPRESA);
	const [ empresaFiscal, setEmpresaFiscal ] = useState({
		nombre_fiscal:'',
		rfc:'', 
		curp:'',
		info_adicio:'',
		regimen_fiscal:'',
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
			cuenta:'',
			sucursal:'',
			clave_banco:''
		}
	});
	/* Queries */
	const { loading, data,refetch, error } = useQuery(OBTENER_DATOS_EMPRESA, {
		variables: { id: sesion.empresa._id }
	});

	useEffect(() => {
		try {
			refetch();
		} catch (errorCatch) {
			// console.log("SESSIONREFECTUPDATE",errorCatch)
		}
	},[update,refetch]);

	useEffect(() => {
		try {
			setErrorPage(error)
		} catch (errorCatch) {
			// console.log("SESSIONREFECT",errorCatch)
		}
	},[error]);

	useEffect(() => {
		try {
			if(data !== undefined){
				setEmpresa(data.obtenerEmpresa)
			}
		} catch (errorCatch) {
			// console.log("SESSIONREFECT",errorCatch)
		}
	},[data, setEmpresa]);

	useEffect(() => {
		try {
			setErrorPage(error)
		} catch (errorCatch) {
			// console.log("SESSIONREFECT",errorCatch)
		}
	},[error]);

	useEffect(() => {
		try {
			setLoadingPage(loading)
		} catch (errorCatch) {
			// console.log("SESSIONREFECTUPDATE",errorCatch)
		}
	},[loading]);

	useEffect(() => {
		try {
			setEmpresaFiscal({
				nombre_fiscal: empresa.nombre_fiscal,
				rfc: empresa.rfc,
				curp:empresa.curp,
			
				info_adicio:empresa.info_adicio,
				regimen_fiscal:empresa.regimen_fiscal,
				direccionFiscal: {
					calle: empresa.direccionFiscal.calle,
					no_ext: empresa.direccionFiscal.no_ext,
					no_int: empresa.direccionFiscal.no_int,
					codigo_postal: empresa.direccionFiscal.codigo_postal,
					colonia: empresa.direccionFiscal.colonia,
					municipio: empresa.direccionFiscal.municipio,
					localidad: empresa.direccionFiscal.localidad,
					estado: empresa.direccionFiscal.estado,
					pais: empresa.direccionFiscal.pais
				},
				datosBancarios:{
					cuenta: empresa.datosBancarios.cuenta,
					sucursal: empresa.datosBancarios.sucursal,
					clave_banco: empresa.datosBancarios.clave_banco
				}
				
			}) 
			
		} catch (errorCatch) {
		}
	}, [empresa])

	const actEmp = async () =>{
		try {
			setLoadingPage(true);
			const input = cleanTypenames(empresaFiscal);
			await actualizarEmpresa({
				variables: {
					id: sesion.empresa._id,
					input
				}
			})
			setUpdate(true);
			setLoadingPage(false);
			setAlert({ message: 'Se han actualizado correctamente los datos.', status: 'success', open: true });
			setErrorForm(false);
		} catch (errorCatch) {
			setLoadingPage(false);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
		}
	}

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const obtenerCampos = (e) => {
		setEmpresaFiscal({
			...empresaFiscal,
			[e.target.name]: e.target.value
		});
	};
	const obtenerCamposDireccion = (e) => {
		setEmpresaFiscal({
			...empresaFiscal,
			direccionFiscal: { ...empresaFiscal.direccionFiscal, [e.target.name]: e.target.value }
		});
	};
	const obtenerCamposBancarios = (e) => {
		setEmpresaFiscal({
			...empresaFiscal,
			datosBancarios: { ...empresaFiscal.datosBancarios, [e.target.name]: e.target.value }
		});
	};

	
	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<FcDocument className={classes.icon} />
					</Box>
					Información fiscal
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<SnackBarMessages alert={alert} setAlert={setAlert} />
				<BackdropComponent loading={loadingPage} setLoading={setLoadingPage} />
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Información fiscal
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClose} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
				{
				(errorPage) ?
					<ErrorPage error={errorPage} />
				:
					<div>
					<Grid container width="100%" >			
						<Box>
							<form autoComplete="off" className={classes.formInputFlex}>
								<Box width="425px">
									<Typography>
										<span>* </span>Nombre fiscal
									</Typography>
									<TextField
										fullWidth
										disabled={bloqueo}
										className={classes.input}
										type="text"
										size="small"
										error={errorForm.error && !empresaFiscal.nombre_fiscal}
										name="nombre_fiscal"
										variant="outlined"
										value={empresaFiscal.nombre_fiscal ? empresaFiscal.nombre_fiscal : ''}
										helperText={
											errorForm.error && errorForm.message !== 'El campo nombre es obligatorio' ? (
												errorForm.message
											) : (
												''
											)
										}
										onChange={obtenerCampos}
									/>
								</Box>
								<Box width="200px">
									<Typography>RFC</Typography>
									<TextField
										className={classes.input}
										disabled={bloqueo}
										size="small"
										name="rfc"
										variant="outlined"
										value={empresaFiscal.rfc ? empresaFiscal.rfc : ''}
										onChange={obtenerCampos}
										
									/>
								</Box>
								<Box width="358px">
									<Typography>Régimen fiscal</Typography>
									<TextField
										className={classes.input}
										disabled={bloqueo}
										size="small"
										name="regimen_fiscal"
										variant="outlined"
										value={empresaFiscal.regimen_fiscal ? empresaFiscal.regimen_fiscal : ''}
										onChange={obtenerCampos}
					
									/>
								</Box>
								
								<Box width="225px">
									<Typography>CURP</Typography>
									<TextField
										className={classes.input}
										disabled={bloqueo}
										size="small"
										name="curp"
										variant="outlined"
										value={empresaFiscal.curp ? empresaFiscal.curp : ''}
										onChange={obtenerCampos}
									/>
								</Box>
							</form>
								
						</Box>
					</Grid>
					<form autoComplete="off" className={classes.formInputFlex}>
								
								<Box width="400px">
									<Typography>Info. Adicional</Typography>
									<TextField
										className={classes.input}
										disabled={bloqueo}
										size="small"
										name="info_adicio"
										variant="outlined"
										value={empresaFiscal.info_adicio ? empresaFiscal.info_adicio : ''}
										onChange={obtenerCampos}
										multiline
										rows={4}
									/>
								</Box>
							</form>
					<Box mt={2} >
						<Typography className={classes.subtitle}>
							<b>Domicilio fiscal</b>
						</Typography>
						<Divider />
					</Box>
					<Grid container justifyContent="center">
					<form autoComplete="off" className={classes.formInputFlex} >
						<Box>
							<Typography>Calle</Typography>
							<TextField
								size="small"
								name="calle"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.calle ? empresaFiscal.direccionFiscal.calle : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box>
							<Typography>Colonia</Typography>
							<TextField
								size="small"
								name="colonia"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.colonia ? empresaFiscal.direccionFiscal.colonia : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="105px">
							<Typography>Num. Ext</Typography>
							<TextField
								size="small"
								name="no_ext"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.no_ext ? empresaFiscal.direccionFiscal.no_ext : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="105px">
							<Typography>Num. Int</Typography>
							<TextField
								size="small"
								name="no_int"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.no_int ? empresaFiscal.direccionFiscal.no_int : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="105px">
							<Typography>C.P.</Typography>
							<TextField
								size="small"
								name="codigo_postal"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.codigo_postal ? empresaFiscal.direccionFiscal.codigo_postal : ''}
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
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.municipio ? empresaFiscal.direccionFiscal.municipio : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>Localidad</Typography>
							<TextField
								size="small"
								name="localidad"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.localidad ? empresaFiscal.direccionFiscal.localidad : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>Estado</Typography>
							<TextField
								size="small"
								name="estado"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.estado ? empresaFiscal.direccionFiscal.estado : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
						<Box width="100%">
							<Typography>Pais</Typography>
							<TextField
								size="small"
								name="pais"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.direccionFiscal.pais ? empresaFiscal.direccionFiscal.pais : ''}
								onChange={obtenerCamposDireccion}
							/>
						</Box>
					</form>
					</Grid>
					<Box mt={2} >
						<Typography className={classes.subtitle}>
							<b>Datos bancarios</b>
						</Typography>
						<Divider />
					</Box>
					<form autoComplete="off" className={classes.formInputFlex}>
						<Box width="20%">
							<Typography>Cuenta</Typography>
							<TextField
								fullWidth
								size="small"
								name="cuenta"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.datosBancarios.cuenta ? empresaFiscal.datosBancarios.cuenta : ''}
								onChange={obtenerCamposBancarios}
							/>
						</Box>
						<Box width="20%">
							<Typography>Sucursal</Typography>
							<TextField
								fullWidth
								size="small"
								name="sucursal"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.datosBancarios.sucursal ? empresaFiscal.datosBancarios.sucursal : ''}
								onChange={obtenerCamposBancarios}
							/>
						</Box>
						<Box width="20%">
							<Typography>Clave de banco</Typography>
							<TextField
								fullWidth
								size="small"
								name="clave_banco"
								variant="outlined"
								disabled={bloqueo}
								value={empresaFiscal.datosBancarios.clave_banco ? empresaFiscal.datosBancarios.clave_banco : ''}
								onChange={obtenerCamposBancarios}
							/>
						</Box>
					</form>
					{sesion.accesos.mi_empresa.informacion_fiscal.editar === false ? (null):(
						<DialogActions>
							<Button onClick={handleClose} color="primary">
								Cancelar
							</Button> 
							<Button
								onClick={()=>actEmp()}
								color="primary"
								variant="contained"
								autoFocus
								
							>
								Guardar
							</Button>
						</DialogActions>
					)}
					</div>
					}
			</Dialog>
		</div>
	);
}
