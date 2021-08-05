import React, {  useContext,useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DialogActions, Toolbar,Dialog,DialogTitle, Paper, DialogContent, Slide, ButtonGroup, Box, Grid,Button, Typography} from '@material-ui/core';
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel} from '@material-ui/core';
import SnackBarMessages from '../../../components/SnackBarMessages';
import BackdropComponent from '../../../components/Layouts/BackDrop';
import ErrorPage from '../../../components/ErrorPage';
import { useQuery, useMutation } from '@apollo/client';
import { FcDocument } from 'react-icons/fc';
import CloseIcon from '@material-ui/icons/Close';
import depositoIcon from '../../../icons/depositar.svg'
import retiroIcon from '../../../icons/retiro-de-dinero.svg'
import transferIcon from '../../../icons/transferencia-bancaria.svg'
import {formatoHora, formatoFecha} from '../../../config/reuserFunctions'
import ActionCaja from './ActionCaja';

import { OBTENER_HISTORIAL_CAJA, CREAR_HISTORIAL_CAJA } from '../../../gql/Cajas/cajas';


const useStyles = makeStyles((theme) => ({
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,

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
		minHeight: 650,
        minWidth:800
	}, 
    table: {
     minWidth: 650,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
	{ id: 1, label: 'Tipo', minWidth: 100, align:'center' },
    { id: 2, label: 'Cantidad', minWidth: 100, align:'center' },
	{ id: 3, label: 'Usuario que lo realizó', minWidth: 150, align:'center' },
	{ id: 4, label: 'Origen movimiento', minWidth: 80, align:'center' },
    { id: 5, label: 'Caja destino', minWidth: 80, align:'center' },
	{ id: 6, label: 'Fecha', minWidth: 80, align:'center' },
	{ id: 7, label: 'Hora', minWidth: 80, align:'center' },
	
	//{ id: 5, label: 'Observaciones', minWidth: 150 }
	
];
export default function HistorialCaja(props) {
    const classes = useStyles();
	const [ loading, setLoading ] = React.useState(false);
    const [ open, setOpen ] = React.useState(false);
	 const [ action, setAction ] = React.useState({depositar:false, retirar:false, transferir:false});
	const [cantidadMovimiento, setCantidadMovimiento] = React.useState(0);
    const [ cajaDestino, setCajaDestino] = React.useState('')
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
    //const [ error, setError ] = useState({error: false, message: ''});
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	let obtenerHistorialCaja = [];

    /* Queries */
	const {  data, error, refetch } = useQuery(OBTENER_HISTORIAL_CAJA,{
		variables: {
            id_Caja: props.cajaSelected._id,
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	
	  /* Mutation */
    const [ crearHistorialCaja ] = useMutation(CREAR_HISTORIAL_CAJA);
   
    useEffect(
		() => {
            console.log(props.cajaSelected._id,sesion.empresa._id,  sesion.sucursal._id)
            if(props.open){
                setLoading(true);
                refetch();
                setLoading(false);
                console.log("DATA",data)
            }
              
		},
		[  props.open ]
	); 
	
	if(data){
      
		obtenerHistorialCaja = data.obtenerHistorialCaja;
	}
	
	const nuevoHistorial = async () => {
		try {
            let tipo_movimiento =  (action.depositar) ? "DEPOSITO" : (action.retirar)  ? "RETIRO" : "TRANSFERENCIA";
          
            setLoading(true);
            console.log("nuevoHistorial",crearHistorialCaja)
				await crearHistorialCaja({
					variables: {
						input:{ 
                            id_User:  sesion._id,
                            origen_movimiento: "ADMIN",
                            id_Caja: props.cajaSelected._id,
                            cantidad_movimiento: parseFloat(cantidadMovimiento),
                            tipo_movimiento : tipo_movimiento,
                            id_caja_destino: (cajaDestino._id != undefined) ? cajaDestino._id : ''
                            },
						empresa: sesion.empresa._id,
						sucursal: sesion.sucursal._id
		
					}
				});
			
            refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
		
			
		} catch (error) {
			console.log("nuevoHistorial",error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};
    
    const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

    const handleClickAction = (name)=>{
		setAction({...open,[name]:true});
	};

    const handleCloseAction = () => {
		setAction({depositar:false, retirar:false, transferir:false});
	};
    return (
		
        <Dialog  fullWidth fullHeight  maxWidth="l" maxHeight="xl" open={props.open} onClose={props.handleClose}   TransitionComponent={Transition} >
            <SnackBarMessages alert={alert} setAlert={setAlert} />	
			<BackdropComponent loading={loading} setLoading={setLoading} />
            <Toolbar >
                <Typography variant="h5" className={classes.title}>
                    Caja {props.cajaSelected.numero_caja}
                </Typography>
                <Button autoFocus color="inherit"size="large" onClick={()=>{props.handleClose(); props.handleCloseAction();
                } } startIcon={<CloseIcon />}>
                    Cerrar
                </Button>
            </Toolbar>
            
            <Grid container spacing={3}  >
            
            <Grid item lg={2} >
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Button fullWidth onClick={()=>handleClickAction("depositar")}>
                        <Box display="flex" flexDirection="column">
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <img src={depositoIcon} alt="icono depostio" className={classes.icon} />
                                </Box>
                            
                                Depositar

                        </Box>
                    </Button>
                </Box>
            </Grid>
            <Grid item lg={2} >
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Button fullWidth onClick={() => handleClickAction('retirar')}>
                        <Box display="flex" flexDirection="column">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img src={retiroIcon} alt="icono depostio" className={classes.icon} />
                            </Box>
                        
                            Retirar
                        </Box>
                    </Button>
                </Box>
            </Grid>
            <Grid item lg={2} >
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Button fullWidth onClick={ () => handleClickAction('transferir')}>
                        <Box display="flex" flexDirection="column">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img src={transferIcon} alt="icono depostio" className={classes.icon} />
                            </Box>
                            
                            Transferir
                        </Box>
                    </Button>
                </Box>
            </Grid>
        </Grid>
        <Box>
        <Box>
            <ActionCaja  action={action} cajas={props.obtenerCajasSucursal} handleClose={handleCloseAction} nuevoHistorial={nuevoHistorial} cajaDestino={cajaDestino} setCajaDestino={setCajaDestino}  setCantidadMovimiento={setCantidadMovimiento} cantidadMovimiento={cantidadMovimiento} />
        </Box>
            
        </Box>
        <Box ml={3} m={2}>
            <Typography variant="h6" >
                Historial 
            </Typography>
        </Box>	
            <Paper className={classes.root} m={2}>
                <TableContainer >
                    <Table className={classes.table} stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell  key={column.id} align={column.align}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {obtenerHistorialCaja
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                  
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                       
                                        key={row.name}
                                        >
                                            <TableCell align="center">{row.tipo_movimiento}</TableCell>
                                            <TableCell align="center">{row.cantidad_movimiento}</TableCell>
                                            <TableCell align="center">{row.id_User.nombre}</TableCell>
                                            <TableCell align="center">{row.origen_movimiento}</TableCell>
                                            <TableCell align="center">{(row.id_caja_destino !== null)? "Caja" + " " +row.id_caja_destino.numero_caja: ''}</TableCell>

                                            <TableCell align="center">{formatoFecha(row.createdAt)}</TableCell>
                                            <TableCell align="center">{formatoHora(row.createdAt)}</TableCell>

                                        </TableRow>
                                    );
                                    })}
                                
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={obtenerHistorialCaja.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            
        </Dialog>
		
    )
}
