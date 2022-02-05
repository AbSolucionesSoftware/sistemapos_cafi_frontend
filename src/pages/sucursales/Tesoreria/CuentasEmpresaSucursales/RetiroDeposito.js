import { Box, Button, Dialog, DialogActions,
        DialogContent, IconButton, makeStyles, 
        MenuItem, Select, Slide, TextField, Typography 
} from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import moment from 'moment';

import CompareArrowsIcon from '@material-ui/icons/CompareArrows';

import SnackBarMessages from '../../../../components/SnackBarMessages';
import { CREAR_MOVIMIENTO_CUENTA } from '../../../../gql/Empresa/sucursales';
import { useMutation } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
    formComboBox:{
        height: '50%'
    },
    input: {
        "& input[type=number]": {
          "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
    }
}));


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function RetiroDeposito({cuenta, refetch, tipo}) {

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));
    const [ CrearMovimientoCuenta ] = useMutation(CREAR_MOVIMIENTO_CUENTA);

    const classes = useStyles();
    const [alert, setAlert] = useState({ message: "", status: "", open: false });
    const [datosMovimiento, setDatosMovimiento] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen =()=>{
        setOpen(!open);
    };

    const onChangeDatos = (e) => {
        setDatosMovimiento({...datosMovimiento, [e.target.name]: e.target.value })
    };

    const input ={
        tipo_movimiento: datosMovimiento.tipo_movimiento === 'RETIRO' ? 'CUENTA-RETIRO' : 'CUENTA-DEPOSITO',
        id_usuario: sesion._id,
        rol_movimiento: tipo === true ? "CUENTA-EMPRESA" : "CUENTA",
        numero_caja: turnoEnCurso ? parseInt(turnoEnCurso.numero_caja) : 0,
        id_Caja: turnoEnCurso ? turnoEnCurso.id_caja : null,
        numero_usuario_creador: sesion.numero_usuario.toString(),
        nombre_usuario_creador: sesion.nombre,
        horario_turno: turnoEnCurso ? turnoEnCurso.horario_turno : null,
        concepto: datosMovimiento.concepto,
        hora_moviento: {
            hora: moment().format('hh'),
            minutos: moment().format('mm'),
            segundos: moment().format('ss'),
            completa: moment().format('HH:mm:ss')
        },
        fecha_movimiento: {
            year: moment().format('YYYY'),
            mes: moment().format('MM'),
            dia: moment().format('DD'),
            no_semana_year: moment().week().toString(),
            no_dia_year: moment().dayOfYear().toString(),
            completa: moment().locale('es-mx').format()
        },
        montos_en_caja: {
            monto_efectivo: {
                monto: parseFloat(datosMovimiento.cantidad),
                metodo_pago: "01"
            },
            monto_tarjeta_debito: {
                monto: 0,
                metodo_pago: "28"
            },
            monto_tarjeta_credito: {
                monto: 0,
                metodo_pago: "04"
            },
            monto_creditos: {
                monto: 0,
                metodo_pago: "99"
            },
            monto_monedero: {
                monto: 0,
                metodo_pago: "05"
            },
            monto_transferencia: {
                monto: 0,
                metodo_pago: "03"
            },
            monto_cheques: {
                monto: 0,
                metodo_pago: "02"
            },
            monto_vales_despensa: {
                monto: 0,
                metodo_pago: "08"
            },
        },
        comentarios: datosMovimiento.comentarios,
    };

    const enviarDatos = async () => { 
        try {
            if (!datosMovimiento.concepto || !datosMovimiento.tipo_movimiento || !datosMovimiento.cantidad ) {
                setAlert({
                    message: 'Por favor complete los datos',
                    status: "error",
                    open: true,
                });
                return null;
            }
            const movimiento = await CrearMovimientoCuenta({
                variables: {
                    input,
                    empresa: sesion.empresa._id,
                    sucursal: cuenta._id,
                    tipo: tipo
                }
            });
            refetch();
            setDatosMovimiento([]); 
            handleClickOpen();
            setAlert({
                message: movimiento.data.crearMovimientoCuenta.message,
                status: "success",
                open: true,
            });
        } catch (error) {
            setAlert({
                message: error.message,
                status: "error",
                open: true,
              });
        }
    }

    return (
        <Fragment>
            <Box>
                <IconButton
                    color='primary'
                    onClick={handleClickOpen}
                    size="small"
                >
                    <CompareArrowsIcon style={{fontSize: 35}} />
                </IconButton>
            </Box>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
            <Dialog
                open={open} 
				TransitionComponent={Transition} 
				maxWidth="sm"
				fullWidth
            >
                <DialogContent>
                    <Box textAlign={'center'} p={1}>
                        <Typography variant='h5'>
                            Movimiento en Cuenta
                        </Typography>
                    </Box>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Usuario</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name="usuario"
                                variant="outlined"
                                disabled={true}
                                value={sesion?.nombre}
                            />
                        </Box>
                        <Box width="100%" >
                            <Typography>Fecha y hora</Typography>
                            <TextField
                                fullWidth
                                disabled={true}
                                size="small"
                                value={moment().format('D MMMM YYYY, h:mm:ss')}
                                name="fecha_movimiento"
                                variant="outlined"

                            />
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Movimiento a Realizar</Typography>
                            <Select
                                className={classes.formComboBox}    
                                size="small"
                                variant="outlined"
                                name="tipo_movimiento"
                                onChange={onChangeDatos}
                                fullWidth
                            >
                                <MenuItem value=''>Ninguno</MenuItem>
                                <MenuItem value='DEPOSITO'>Deposito</MenuItem>
                                <MenuItem value='RETIRO'>Retiro</MenuItem>
                            </Select>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Cantidad</Typography>
                            <TextField
                                className={classes.input}
                                fullWidth
                                onChange={onChangeDatos}
                                size="small"
                                type='number'
                                name="cantidad"
                                variant="outlined"
                            />
                        </Box>
                        <Box width="100%">
                            <Typography>Concepto</Typography>
                            <TextField
                                fullWidth
                                onChange={onChangeDatos}
                                size="small"
                                name="concepto"
                                variant="outlined"
                            />
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Comentarios</Typography>
                            <TextField
                                className={classes.input}
                                fullWidth
                                onChange={onChangeDatos}
                                size="small"
                                multiline
                                rows={2}
                                type='number'
                                name="monto_movimiento"
                                variant="outlined"
                            />
                        </Box>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant='outlined'
                        onClick={enviarDatos}
                        size="large"
                    >
                        Realizar
                    </Button>
                    <Button
                        color="secondary"
                        variant='outlined'
                        onClick={handleClickOpen}
                        size="large"
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
