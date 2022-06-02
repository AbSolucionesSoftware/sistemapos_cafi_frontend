import React, { Fragment,useState, useContext, useEffect} from 'react';

import CloseIcon from '@material-ui/icons/Close';
import { Box, Button, Dialog, DialogContent, makeStyles,  
    DialogTitle, Slide, TextField, FormControl, MenuItem, 
    Select,Typography, IconButton } from '@material-ui/core';
import BackdropComponent from '../../../../../../components/Layouts/BackDrop';    
import {AbonosCtx} from "../../../../../../context/Tesoreria/abonosCtx";
import {  CREAR_ABONO_CLIENTE } from "../../../../../../gql/Tesoreria/abonos";
import { formatoMexico } from "../../../../../../config/reuserFunctions";
import { formaPago } from '../../../../Facturacion/catalogos';
import { withRouter } from "react-router";
import { useMutation } from '@apollo/client';
import moment from 'moment';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
const useStyles = makeStyles((theme) => ({
    appBar: {	
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		width: 100
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(6)}px ${theme.spacing(4)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  function Abonar(props) {
    //listo
    const classes = useStyles();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const [open, setOpen] = useState(false);
    const [abono, setAbono] = useState(''); 
    const {abonos} = useContext(AbonosCtx);
    const [metodoPago, setMetodoPago] = useState({});
    const [nameMetodo, setNameMetodo] = useState('');
    const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
    const [ crearAbonoVentaCredito ] = useMutation(CREAR_ABONO_CLIENTE);
    
    const handleClick = () =>{
        setOpen(false);
    }
    const hacerAbono = async() => { 
        try {
            props.setLoading(true);
         
            let ObjectMetodoPago = {};
            formaPago.forEach((val) => {
                if (metodoPago === val.Value) { 
                    ObjectMetodoPago = val;
                }
            });

           
            const input = {
                tipo_movimiento: "ABONO_CLIENTE",
                rol_movimiento: "CAJA",
                numero_caja: parseInt(turnoEnCurso.numero_caja),
                id_Caja: turnoEnCurso.id_caja,
                fecha_movimiento: {
                    year: moment().format('YYYY'),
                    mes: moment().format('MM'),
                    dia: moment().format('DD'),
                    no_semana_year: moment().week().toString(),
                    no_dia_year: moment().dayOfYear().toString(),
                    completa: moment().locale('es-mx').format()
                },
                monto_total: props.total_ventas,
               
                horario_turno: turnoEnCurso.horario_en_turno,
                hora_moviento: {
                    hora: moment().format('hh'),
                    minutos: moment().format('mm'),
                    segundos: moment().format('ss'),
                    completa: moment().format('HH:mm:ss')
                },
                metodo_de_pago:{
                    clave: ObjectMetodoPago.Value,
                    metodo:  ObjectMetodoPago.Name,
                },
            
                id_usuario: sesion._id,
                numero_usuario_creador: sesion.numero_usuario,
                nombre_usuario_creador: sesion.nombre,
                id_cliente: props.cliente._id,
                credito_disponible: props.cliente.credito_disponible,
                numero_cliente: props.cliente.numero_cliente,
                nombre_cliente: props.cliente.nombre_cliente ,
                telefono_cliente: props.cliente.telefono_cliente  ,
                email_cliente: props.cliente.email_cliente,
            

                ventas: [{ monto_total_abonado: parseFloat(abono), 
                    id_venta:abonos[props.index].id_venta,
                    saldo_credito_pendiente:abonos[props.index].saldo_credito_pendiente}],
                liquidar: false
            }
            if(metodoPago && abono !== '' && abono > 0){
                await crearAbonoVentaCredito({
                    variables: {
                        empresa: sesion.empresa._id,
                        sucursal: sesion.sucursal._id,
                        input
                    },
                }); 

                props.recargar();
                setOpen(false);
                props.setLoading(false);
                props.setAlert({ 
                    message: 'Abono registrado con éxito.', 
                    status: 'success', 
                    open: true 
                });
            }
        } catch (error) {
            console.log(error);
            if (error.networkError) {
                console.log(error.networkError.result);
            } else if (error.graphQLErrors) {
                console.log(error.graphQLErrors);
            }
        }
    }

    const enviarCantidad = (e) =>{
        try {
            let cantidad = e.target.value;
            if(cantidad >= 0 && cantidad <= props.venta.saldo_credito_pendiente){
                setAbono(cantidad);
            }
           

        } catch (error) {
            console.log(error)
        }
    }
    const openDialog = () =>{
     
        try {
            if(turnoEnCurso){
                setOpen(true);
            }else{
                props.history.push('/ventas/venta-general');
               
               
            }
           
        } catch (error) {
            
        }
    }
    useEffect(() => {
    
        if(metodoPago){
          
            setNameMetodo(metodoPago.name)
          
        }
    }, [metodoPago])
     
    return (
        <Box m={1}>
            <Box display="flex">
                <IconButton aria-label="detalle" onClick={() =>{ openDialog();}} disabled={props.estatus_credito === "PAGADA"} >
                    <ControlPointIcon />
                </IconButton>
                </Box>
            <Fragment>
           
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle id="alert-dialog-slide-title">
                <Box display="flex">
                 
                    <Box width='100%' display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={() => setOpen(false)} size="large">
                            <CloseIcon />
                        </Button>
                    </Box>
                </Box>
                
            </DialogTitle>
                <BackdropComponent loading={props.loading} setLoading={props.setLoading} />
            
                <DialogContent>
                    <Box  display="flex"sx={{ justifyContent: 'space-between' }}>
                        <Box width="40%" >
                            <Typography><b>Cantidad a abonar:</b></Typography>
                            <TextField
                                fullWidth
                                className={classes.input}
                                onChange={(e) => enviarCantidad(e)}
                                value={abono}
                                size="small"
                                name="abono_recibir"
                                variant="outlined"
                                type='number'
                            />
                        </Box >
                   
                        <Box width="58%"  >
                            <Typography><b>Método de pago:</b></Typography>
                            <FormControl 
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <Select
                                    width="100%"
                                    name="metodo_pago"
                                    variant='outlined'
                                    value={metodoPago ? metodoPago : ''}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Selecciona uno</em>
                                    </MenuItem>
                                    {formaPago.map((metodo, index) => {
                                        return(
                                            <MenuItem key={index} value={ metodo.Value}>{metodo.Name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    <Box mt={5} width= "100%" display='flex' alignItems="flex-end" flexDirection='column'>
                        <Box width="55%" display='flex'  >
                            <Box flexGrow={1}>
                                <Typography variant='h6'>
                                    <b>Total cuenta</b>
                                </Typography>
                            </Box>
                            <Typography style={{color: '#9B9B9B'}} variant='h6'>
                                <b>${formatoMexico(props.venta.total)}</b>
                            </Typography>
                        </Box>
                        <Box width="55%" display='flex'>
                            <Box flexGrow={1}>
                                <Typography  variant='h6'>
                                    <b>Total abonado</b>
                                </Typography>
                            </Box>
                            <Typography style={{color: 'green'}} variant='h6'>
                                <b>${formatoMexico(props.venta.total - props.venta.saldo_credito_pendiente)}</b>
                            </Typography>
                        </Box>
                        <Box width="55%" display='flex'>
                            <Box flexGrow={1} >
                                <Typography  variant='h6'>
                                    <b>Total restante</b>
                                </Typography>
                            </Box>
                            <Typography  variant='h6'>
                                <b>${formatoMexico(props.venta.saldo_credito_pendiente)}</b>
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <Box display="flex" justifyContent="flex-end" alignContent="center" p={2} mt={2}>
                    <Button
                        size="large"
                        variant="contained" 
                        color="primary"
                        style={{fontSize: 15}}
                        onClick={hacerAbono}
                    >
                        Registrar Abono
                    </Button>
                </Box>
            </Dialog>
            </Fragment> 
        </Box> 
    )
}

export default withRouter(Abonar);



{/* <Dialog
                open={openAbonar}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <Box display="flex">
                        <Box display="flex" justifyContent="flex-start">
                            Abono a recibir por cuenta
                        </Box>
                        <Box ml={3} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="secondary" onClick={handleClick} size="large">
								<CloseIcon />
							</Button>
                        </Box>
                    </Box>
                    
                </DialogTitle>
                <DialogContent>
                    <Box width="100%">
                        <Typography>Cuenta No. 2501265</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            value="$150,000.00 Mx" 
                           
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>Cuenta No. 2501265</Typography>
                        <TextField
                            fullWidth
                            size="small"
                           
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            value="$150,000.00 Mx" 
                           
                        />
                    </Box>
                    <Box width="100%" p={1} mt={1}>
                        <Typography>Nombre de Cliente: SUTANO</Typography>
                    </Box>
                    <Box width="100%" p={1}>
                        <Typography>Total a abonar:  $15,100</Typography>
                    </Box>
                    <Box p={1}>
                        <Alert severity="info">Si desea editar el abono del cliente, <br/>
                        procure este sea mayor al establecido</Alert>
                    </Box>
                </DialogContent>
                <Box display="flex" justifyContent="center" alignContent="center" p={2}>
                    <Button
                        size="large"
                        variant="contained" 
                        color="primary"
                        style={{fontSize: 16}}
                        onClick={handleClick}
                    >
                        Registrar Abono
                    </Button>
                </Box>
            </Dialog> */}