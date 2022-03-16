import React, {  useContext,useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, IconButton,Grid, Box, Paper,Button, DialogActions, AppBar, Toolbar,Dialog,DialogTitle, DialogContent, Slide, ButtonGroup} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel} from '@material-ui/core';
import CardCaja from './CardCaja';
import HistorialCaja from './HistorialCaja';
import SnackBarMessages from '../../../components/SnackBarMessages';
import BackdropComponent from '../../../components/Layouts/BackDrop';
import ErrorPage from '../../../components/ErrorPage';
import { useQuery, useMutation } from '@apollo/client';
import { FcDocument } from 'react-icons/fc';
import AddIcon from '@material-ui/icons/Add';
import { FcPlus } from 'react-icons/fc';
import CloseIcon from '@material-ui/icons/Close';
import depositoIcon from '../../../icons/depositar.svg'
import retiroIcon from '../../../icons/retiro-de-dinero.svg'
import transferIcon from '../../../icons/transferencia-bancaria.svg'
import ActionCaja from './ActionCaja';

import { OBTENER_CAJAS, CREAR_CAJA } from '../../../gql/Cajas/cajas';


const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	
	},
	
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,

	},
	cantidadTitle:{
		justifyContent:"flex-end"
	},
	
	input:{
		width:'100%'	
	},
	dialog:{width:'100%'},
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
	icon: {
		fontSize: 40,
		width: 40

	},
	container: {
		position:'absolute',
		backgroundColor:'red'
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
	{ id: 1, label: 'Tipo movimiento', minWidth: 100 },
	{ id: 2, label: 'Quién realizó', minWidth: 100 },
	{ id: 3, label: 'Encargado caja', minWidth: 150 },
	{ id: 4, label: 'Cantidad', minWidth: 150 },
	{ id: 5, label: 'Hora', minWidth: 150 },
	{ id: 5, label: 'Fecha', minWidth: 150 },
	{ id: 5, label: 'Observaciones', minWidth: 150 }
	
];
export default function Cajas() {
    const classes = useStyles();
	const [ loading, setLoading ] = React.useState(false);
    const [ open, setOpen ] = React.useState(false);
	 const [ action, setAction ] = React.useState({depositar:false, retirar:false, transferir:false});
	const [ cajaSelected, setCajaSelected ] = React.useState({name:''});
	
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
    //const [ error, setError ] = useState({error: false, message: ''});
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    let obtenerCajasSucursal = []; 
	let obteneHistorialCaja = [];
	
	
  
    /* Queries */
	const {  data, error, refetch } = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	
	  /* Mutation */
    const [ crearCaja ] = useMutation(CREAR_CAJA);
   
    useEffect(
		() => {
			setLoading(true);
			refetch();
			setLoading(false);
		},
		[ refetch ]
	); 
	
	if(data){
		obtenerCajasSucursal = data.obtenerCajasSucursal;
	}
	
	const nuevaCaja = async () => {
		try {
            setLoading(true);
				await crearCaja({
					variables: {
						input:{usuario_creador:  sesion._id},
						empresa: sesion.empresa._id,
						sucursal: sesion.sucursal._id
		
					}
				});
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
		
			
		} catch (error) {
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};
	
	
	const handleClickOpen = () => {
		setOpen(true);
	};

	
	const handleClose = () => {
		setOpen(false);
	};
	
	
    
  
    return (
		
		<Fragment>
		
		<Container >
			
			<SnackBarMessages alert={alert} setAlert={setAlert} />	
			<BackdropComponent loading={loading} setLoading={setLoading} />
			
			<Box>
				<Toolbar>
					<Box mx={3} >
						<Button autoFocus color="primary" size="large"variant="contained" onClick={nuevaCaja}>
							<AddIcon />
							Agregar Caja
						</Button>
					</Box>
					
				</Toolbar>		
			</Box>
			<Box></Box>
			<Grid container spacing={1} justifyContent="center" >
               {  obtenerCajasSucursal?.map((caja, index) => {
                    
                    return(
                        <Button  onClick={()=>{handleClickOpen(); setCajaSelected(caja)}}>
                            <CardCaja name={caja.numero_caja} activa ={caja.activa} cantidad_efectivo_actual= {caja.cantidad_efectivo_actual} />
                        </Button>
                    )	
                }) } 
            </Grid> 
			
		</Container>
		<HistorialCaja open={open} fetchCajas={refetch} handleClickOpen={handleClickOpen} cajaSelected={cajaSelected} handleClose={handleClose} obtenerCajasSucursal={obtenerCajasSucursal} />
		</Fragment>	
    )
}
 