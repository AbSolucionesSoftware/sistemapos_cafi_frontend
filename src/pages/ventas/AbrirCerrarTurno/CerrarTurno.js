import React, { useContext, useState } from 'react'
import useStyles from '../styles';

import { Box,  Button,  DialogActions,  DialogContent,  FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import { REGISTRAR_TURNOS } from '../../../gql/Ventas/abrir_cerrar_turno';

import moment from 'moment';
import 'moment/locale/es';
import { VentasContext } from '../../../context/Ventas/ventasContext';
import { useMutation } from '@apollo/client';
moment.locale('es');

export default function AbrirTurno({handleClickOpen, setLoading}) {
    const [ CrearRegistroDeTurno ] = useMutation(REGISTRAR_TURNOS);
    const { setAlert } = useContext(VentasContext);
    const [ error, setError] = useState(false);

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));

    const classes = useStyles();
    const [ montoTurno, setMontoTurno ] = useState([]);
    const [ cerrarTurno, setCerrarTurno ] = useState([]);

    const obtenerCamposMontos = (e) => { 
        setMontoTurno({...montoTurno, [e.target.name]: e.target.value})
    };

    const obtenerCampos = (e) => { 
        setCerrarTurno({...cerrarTurno, [e.target.name]: e.target.value})
    };
    
    const input = {
        horario_en_turno: cerrarTurno.horario_en_turno,
        concepto: "CERRAR TURNO",
        token_turno_user: turnoEnCurso ? turnoEnCurso.token_turno_user : "",
        numero_caja: turnoEnCurso ? turnoEnCurso?.numero_caja.toString() : "",
        comentarios: cerrarTurno.comentarios,
        id_caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
        id_usuario: sesion._id,
        usuario_en_turno: {
            nombre: sesion.nombre,
            telefono: sesion.telefono,
            numero_usuario: sesion.numero_usuario.toString(),
            email: sesion.email,
        },
        hora_entrada: {
            hora:  "",
            minutos: "",
            segundos:  "",
            completa: ""
        },
        hora_salida: {
            hora: moment().format('hh'),
            minutos: moment().format('mm'),
            segundos: moment().format('ss'),
            completa: moment().format('HH:mm:ss')
        },
        fecha_entrada:{
            year: "",
            mes: "",
            dia: "",
            no_semana_year: "",
            no_dia_year: "",
            completa: ""
        },
        fecha_salida:{
            year: moment().format('YYYY'),
            mes: moment().format('MM'),
            dia: moment().format('DD'),
            no_semana_year: moment().week().toString(),
            no_dia_year: moment().dayOfYear().toString(),
            completa: moment().format("YYYY-MM-DD")
        },
        fecha_movimiento: moment().locale('es-mx').format(),
        montos_en_caja: {
            monto_efectivo: parseFloat(montoTurno.monto_efectivo ? montoTurno.monto_efectivo : 0),
            monto_tarjeta: parseFloat(montoTurno.monto_tarjeta_credito ? montoTurno.monto_tarjeta_credito : 0),
            monto_creditos: parseFloat(montoTurno.monto_creditos ? montoTurno.monto_creditos : 0 ),
            monto_monedero: parseFloat(montoTurno.monto_puntos ? montoTurno.monto_puntos : 0),
            monto_transferencia: parseFloat(montoTurno.monto_transferencia ? montoTurno.monto_transferencia : 0),
            monto_cheques: parseFloat(montoTurno.monto_cheques ? montoTurno.monto_cheques : 0),
            monto_vales_despensa: parseFloat(montoTurno.monto_vales_despensa ? montoTurno.monto_vales_despensa : 0)
        }
    };

    let arraySesion = {
        accesos: sesion.accesos,
        email: sesion.email,
        empresa: sesion.empresa,
        estado: sesion.estado,
        exp: sesion.exp,
        iat: sesion.iat,
        imagen: sesion.imagen,
        nombre: sesion.nombre,
        numero_usuario: sesion.numero_usuario,
        sucursal: sesion.sucursal,
        telefono: sesion.telefono,
        turno_en_caja_activo: false, 
        _id: sesion._id,
    };

    const enviarDatos  = async () => {
        setLoading(true);
        try {
            if(!cerrarTurno.horario_en_turno){
                setError(true);
                setLoading(false);
                setAlert({
                    message: `Por favor elija que turno esta cerrando`,
                    status: "error",
                    open: true,
                });
                return;
            }else{
                await CrearRegistroDeTurno({
                    variables: {
                        activa: false,
                        input
                    }
                });
                setAlert({
                    message: `Turno cerrado con exito`,
                    status: "success",
                    open: true,
                });
                localStorage.setItem('sesionCafi', JSON.stringify(arraySesion));
                localStorage.removeItem('turnoEnCurso');
                setLoading(false);
                handleClickOpen();
            }
        } catch (error) {
            setAlert({
                message: `Error: ${error.message}`,
                status: "error",
                open: true,
            });
            setLoading(false);
            handleClickOpen();
        }
    };


    return (
        <>
            <DialogContent style={{padding: 0}}>
            <div className={classes.formInputFlex}>
                <Box width="100%" textAlign="center">
                    <Typography variant="h6">Montos a Depositar</Typography>
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography> Monto Efectivo:</Typography>
                    <Box display="flex">
                        <TextField
                            name="monto_efectivo"
                            inputProps={{min: 0}}
                            type="number"
                            defaultValue={0}
                            color="primary"
                            style={{width: "70%"}}
                            onChange={obtenerCamposMontos}
                        />
                    </Box>
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography> Tarjeta:</Typography>
                    <Box display="flex">
                        <TextField
                            name="monto_tarjeta_debito"
                            inputProps={{min: 0}}
                            type="number"
                            defaultValue={0}
                            color="primary"
                            style={{width: "70%"}}
                            onChange={obtenerCamposMontos}
                        />
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography> Creditos:</Typography>
                    <Box display="flex">
                        <TextField
                            name="monto_creditos"
                            inputProps={{min: 0}}
                            type="number" 
                            defaultValue={0}
                            color="primary"
                            style={{width: "70%"}}
                            onChange={obtenerCamposMontos}
                        />
                    </Box>
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Monedero:</Typography>
                    <Box display="flex">
                        <TextField
                            name="monto_puntos"
                            inputProps={{min: 0}}
                            type="number" 
                            defaultValue={0}
                            color="primary"
                            style={{width: "70%"}}
                            onChange={obtenerCamposMontos}
                        />
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>Transferencias:</Typography>
                    <Box display="flex">
                        <TextField
                            name="monto_transferencia"
                            inputProps={{min: 0}}
                            type="number" 
                            defaultValue={0}
                            color="primary"
                            style={{width: "70%"}}
                            onChange={obtenerCamposMontos}
                        />
                    </Box>
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Cheques:</Typography>
                    <Box display="flex">
                        <TextField
                            name="monto_cheques"
                            inputProps={{min: 0}}
                            type="number" 
                            defaultValue={0}
                            color="primary"
                            style={{width: "70%"}}
                            onChange={obtenerCamposMontos}
                        />
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>Vales de despensa:</Typography>
                    <Box display="flex">
                        <TextField
                            name="monto_vales_despensa"
                            inputProps={{min: 0}}
                            type="number" 
                            defaultValue={0}
                            color="primary"
                            style={{width: "70%"}}
                            onChange={obtenerCamposMontos}
                        />
                    </Box>
                </Box>
            </div>
                <Grid container >
                    <Grid item lg={6}>
                        <Box mt={1} textAlign="center">
                            <Typography >
                                <b>Monto total efectivo:  </b>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item lg={6} justify='flex-end'>
                        <Box mt={1} textAlign="center" >
                            <Typography>
                                 ${montoTurno.monto_efectivo} Mx.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            <span className="obligatorio">* </span> Turno:
                        </Typography>
                        <FormControl
                            variant="outlined"
                            fullWidth
                            size="small"
                        >
                            <Select
                                onChange={obtenerCampos}
                                id="form-producto-tipo"
                                name="horario_en_turno"
                            >
                                <MenuItem value="">
                                    <em>Selecciona uno</em>
                                </MenuItem>
                                <MenuItem value="VESPERTINO">Vespertino</MenuItem>
                                <MenuItem value="MATUTINO">Matutino</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>Comentarios:</Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                multiline
                                onChange={obtenerCampos}
                                rows={2}
                                size="small"
                                name="comentarios"
                                id="form-producto-codigo-barras"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions>
                <Box display="flex" alignItems='flex-end'>
                    <Button 
                        onClick={enviarDatos} 
                        variant="contained" 
                        color="primary" 
                        size="large"
                    >
                        Aceptar
                    </Button>
                </Box>
            </DialogActions>
        </>
    )
}