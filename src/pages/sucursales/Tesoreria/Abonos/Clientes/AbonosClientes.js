import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, TextField, Grid, IconButton, InputAdornment } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import {AbonosCtx} from "../../../../../context/Tesoreria/abonosCtx";
import { ClienteCtx } from "../../../../../context/Catalogos/crearClienteCtx"; 
import TablaVentasCredito from './Components/TablaVentasCredito';
import ButtonLiquidar from './Components/Liquidar';
import ButtonAbonar from './Components/Abonar';
import { useQuery } from '@apollo/client';
import {  OBTENER_HISTORIAL_ABONOS_CLIENTE } from "../../../../../gql/Tesoreria/abonos";

//import DetallesCuenta from './Components/DetalleCuenta/DetallesCuenta';

const useStyles = makeStyles((theme) => ({
	appBar: {	
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	titleSelect:{
		marginLeft: theme.spacing(1),
		flex: 1,
		fontSize:18
	},
    icon: {
		width: 100
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	iconSize: {
		width: 32,
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbonosClientes() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const context = useContext(AbonosCtx);
	const {clientes} = useContext(ClienteCtx);
	const [filtro, setFiltro] = useState("");

	const [ventasCredito, setVentasCredito] = useState([]);
	const searchfilter = useRef(null);
	const handleClickOpen = () => setOpen(!open);
	

	const obtenerVentasCredito = useQuery(OBTENER_HISTORIAL_ABONOS_CLIENTE, {
		variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id, idCliente: context.selectedClient._id },
	  });

	const ChangeClientAutocomplate = (value) => {
		try {
			console.log(value)
		  let setVal  = (value !== null) ? value: ""; 
		  context.setSelectedClient(setVal);
		} catch (error) {
		  console.log(error);
		}
	  };

	useEffect(() => {
		

		if(obtenerVentasCredito.data){
			setVentasCredito(obtenerVentasCredito.data.historialVentasACredito)
		}
		
	}, [obtenerVentasCredito.data])
	

	return (
		<div>
			
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/salary.svg' alt="icono abono" className={classes.icon} />
					</Box>
					Abonos de Clientes
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        	Abonos de Clientes 
						</Typography>
						
                        <Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
				<Grid container>
					<Grid item lg={5} >
						<Box ml={2} mt={1}>
							<Typography className={classes.titleSelect} color="textPrimary" gutterBottom>
								<b>Seleccionar cliente </b>
							</Typography>
						</Box>
						<Box ml={3} style={{width:'80%'}} >

							<Autocomplete
								id="combo-box-producto-codigo"
								size="small"
								fullWidth
								options={clientes}
								getOptionLabel={(option) =>
								option.nombre_cliente ? option.nombre_cliente : "N/A"
								}
								renderInput={(params) => <TextField {...params} variant="outlined" />}
								onChange={(_, value) => ChangeClientAutocomplate(value)}
								getOptionSelected={(option, value) =>
								option.nombre_cliente === value.nombre_cliente
								}
								value={context.selectedClient ? context.selectedClient : null}
							/>
						</Box>
						
					</Grid>
					{
						(context.ventas.length > 0) ? 
						<Grid item lg={7}>
							<Box  mt={1} mr={2} display="flex" justifyContent="flex-end" alignContent="space-between">
								<ButtonAbonar />
								<ButtonLiquidar />
							</Box>
						</Grid>
						:
						<div/>
					}
					
				</Grid> 		
				<Box p={2}>
					<TablaVentasCredito rows={ventasCredito} />
				</Box>
			</Dialog>
			{/* <DetallesCuenta /> */}
		</div>
	);
}
