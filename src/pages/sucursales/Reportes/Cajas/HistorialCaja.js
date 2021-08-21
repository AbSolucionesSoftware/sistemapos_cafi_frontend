import React, {  useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, useTheme, Paper,  Slide, Box, Button, Toolbar, CircularProgress,
 Typography, FormControl, MenuItem, InputLabel, TextField, Input, Select} from '@material-ui/core';
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useQuery, useMutation } from '@apollo/client';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import {formatoHora, formatoFecha} from '../../../../config/reuserFunctions'


import { OBTENER_HISTORIAL_CAJA, CREAR_HISTORIAL_CAJA } from '../../../../gql/Cajas/cajas';


const useStyles = makeStyles((theme) => ({
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,

	},
	input:{
		width:'100%',
       
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
		minHeight: '100%',
        height:'100%',
        width:900, 
        minWidth:1000,
      
	}, 
    buttonBuscar:{
        marginTop:15
    },
    table: {
     minWidth: 650,
     minHeight:100,
     maxHeight:600
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        maxWidth: 200,
    },
    formPicker: {
        margin: theme.spacing(2),
        minWidth: 250,
        maxWidth: 250,
        marginTop:0,
        marginBottom:15
    },
    datePicker: {
        minWidth: 250,
        maxWidth: 250,
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 200;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};
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

const tipos = [
    'DEPOSITO',
    'RETIRO',
    'TRANSFERENCIA'
];
const origens = [
    'ADMIN',
    'CAJA'
];

function getStyles(almacen, almacenName, theme) {
  return {
    fontWeight:
      almacenName.indexOf(almacen) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function HistorialCaja(props) {
    const classes = useStyles();
    const theme = useTheme();
	const [ loading, setLoading ] = React.useState(false);
    const [ open, setOpen ] = React.useState(false);
	 const [ action, setAction ] = React.useState({depositar:false, retirar:false, transferir:false});
	const [cantidadMovimiento, setCantidadMovimiento] = React.useState(0);
    const [ cajaDestino, setCajaDestino] = React.useState('');
    const [ filterInput, setFilterInput] = React.useState({tipo_movimiento: '', nombre_usuario_creador:'', origen_movimiento:'',createdAt:null});
    const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);
    //const [ error, setError ] = useState({error: false, message: ''});
    const [ errorCantidad, setErrorCantidad ] = useState(false);
    const [ errorCajaDestino, setErrorCajaDestino ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	let obtenerHistorialCaja = [];
   
    /* Queries */
	const {  data, error, refetch } = useQuery(OBTENER_HISTORIAL_CAJA,{
		variables: {
            input: filterInput,
            id_Caja: props.cajaSelected._id,
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

	  /* Mutation */
    const [ crearHistorialCaja ] = useMutation(CREAR_HISTORIAL_CAJA);
   

    useEffect(
		() => {
            setLoading(true);
            refetch();
            setLoading(false);
		},
		[   data, refetch ]
	); 
	
	if(data){
		obtenerHistorialCaja = data.obtenerHistorialCaja;
	}

	const nuevoHistorial = async () => {
		try {
            let tipo_movimiento =  (action.depositar) ? "DEPOSITO" : (action.retirar)  ? "RETIRO" : "TRANSFERENCIA";
            let cajaDes = (action.transferir) ?  cajaDestino._id : undefined;
            
            if(cantidadMovimiento > 0 && cantidadMovimiento !== '' ){
                setErrorCantidad(false)
               
            }else{
                setErrorCantidad(true)
                return;
            }
            if(action.transferir){
                if(cajaDestino !== ''){
                    setErrorCajaDestino(false);
                    
                   
                }else{
                    console.log('ENTRA')
                    setErrorCajaDestino(true)
                    return;
                }
            }
           
            
            setLoading(true);
            
			const respCrearHistorial= 
                await crearHistorialCaja({
					variables: {
						input:{ 
                            id_User:  sesion._id,
                            origen_movimiento: "ADMIN",
                            id_Caja: props.cajaSelected._id,
                            cantidad_movimiento: parseFloat(cantidadMovimiento),
                            tipo_movimiento : tipo_movimiento,
                            id_caja_destino: cajaDes
                            },
						empresa: sesion.empresa._id,
						sucursal: sesion.sucursal._id
					}
				});
               
            refetch();
            props.fetchCajas();
            setAction({depositar:false, retirar:false, transferir:false});
            setCantidadMovimiento(0);
            setErrorCantidad(false);
            setErrorCajaDestino(false);
            setCajaDestino('')
			setAlert({ message: 'Listo.', status: 'success', open: true });
			setLoading(false);
		
			
		} catch (error) {
			console.log("nuevoHistorial",error);
			setAlert({ message: error.message, status: 'error', open: true });
			setLoading(false);
		}
	};
    const handleDateChange = (date) => {
        //console.log("%cUrielinho!", "color: green; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
         setFilterInput({...filterInput,createdAt:date});
    };
    const handleChangeOrigen = (event) => {
         setFilterInput({...filterInput,origen_movimiento:event.target.value})
      
    };
     const handleChange = (event) => {
         setFilterInput({...filterInput,tipo_movimiento:event.target.value})
     
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
		
        <Dialog  fullWidth fullHeight  maxWidth="l" maxHeight="xl" open={props.open} onClose={()=>{props.handleClose(); handleCloseAction();}}   TransitionComponent={Transition} >
         <BackdropComponent loading={loading} setLoading={setLoading} />
            <Toolbar >
                <Typography variant="h5" className={classes.title}>
                    Caja {props.cajaSelected.numero_caja}
                </Typography>
                <Button autoFocus color="inherit"size="large" onClick={()=>{props.handleClose();handleCloseAction();} } startIcon={<CloseIcon />}>
                    Cerrar
                </Button>
            </Toolbar>
        
        <Box ml={3} m={2}>
            <Typography variant="h6" >
                Historial 
            </Typography>
        </Box>
        <Box ml={3} m={2} flexDirection={'row'}>
       
            <FormControl className={classes.formControl}>
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                labelId="tipo-label"
                id="tipo-name"
                value={filterInput.tipo_movimiento}
                onChange={handleChange}
                input={<Input />}
                MenuProps={MenuProps}
                >
                {tipos.map((tipo) => (
                    <MenuItem key={tipo} value={tipo} style={getStyles(tipo, filterInput.tipo_movimiento, theme)}>
                    {tipo}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <FormControl  style={{marginTop:0}}>
                <Box width="250px" ml={5} mr={2}  >
                    <Typography   >
                        Usuario que lo realizó
                    </Typography>
                    <TextField
                        fullWidth
                        className={classes.input}
                        type="text"
                        size="small"
                        name="usuarioRealizo"
                        variant="outlined"
                        value={filterInput.nombre_usuario_creador}
                        
                        onChange={(e) =>  setFilterInput({...filterInput, nombre_usuario_creador: e.target.value})}
                    />
                </Box>
            </FormControl>
        
            <FormControl className={classes.formControl}>
                
                <InputLabel id="tipo-label">Origen</InputLabel>
                <Select
                labelId="tipo-label"
                id="tipo-name"
                value={filterInput.origen_movimiento}
                onChange={handleChangeOrigen}
                input={<Input />}
                MenuProps={MenuProps}
                >
                {origens.map((ori) => (
                    <MenuItem key={ori} value={ori} style={getStyles(ori, filterInput.origen_movimiento, theme)}>
                    {ori}
                    </MenuItem>
                ))}
                </Select>
                
            </FormControl>
            <FormControl >
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
            
                    <Box flexDirection={'row'}>
                    <FormControl className={classes.formPicker} >
                    <Box width="200px" ml={2} >
                    
                        <KeyboardDatePicker
                        margin="normal"
                         style={{marginTop:8}}
                        id="date-picker-dialog"
                        label="Fecha de movimiento"
                        format="MM/dd/yyyy"
                        value={filterInput.createdAt}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                    </Box>
                    </FormControl >
                    {/* <FormControl > 
                    <Box width="200px" ml={2} >
                    <KeyboardTimePicker
                        style={{marginTop:8}}
                        margin="normal"
                        id="time-picker"
                        label="Hora movimiento"
                        value={filterInput.createdAt}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                    </Box>
                    </FormControl>   */}
                    </Box> 
                </MuiPickersUtilsProvider>
            </FormControl >
            <FormControl className={classes.buttonBuscar}>
      
            <Button
                style={{width:"200px"}}
                onClick={()=> refetch()}
                color="primary"
                variant="contained"
                autoFocus
                endIcon={loading ? <CircularProgress color="inherit" size={25} /> : null}
            >
                Buscar
            </Button>
           
            </FormControl>
        </Box>
        	
            <Paper className={classes.root} m={2}>
                <TableContainer >
                    <Table className={classes.table} options = {{filtering:true}} stickyHeader aria-label="sticky table">
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
