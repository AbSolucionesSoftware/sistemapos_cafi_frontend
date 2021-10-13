import React, { useContext, useState } from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent,  FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import { useMutation, useQuery } from '@apollo/client';
import { OBTENER_CAJAS } from '../../../gql/Cajas/cajas';
import { REGISTRAR_TURNOS } from '../../../gql/Ventas/abrir_cerrar_turno';
import { VentasContext } from '../../../context/Ventas/ventasContext';

export default function AbrirTurno({handleClickOpen}) {
    const [ CrearRegistroDeTurno ] = useMutation(REGISTRAR_TURNOS);
    const { setAlert } = useContext(VentasContext);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('cajaEnCurso'));
    const [ error, setError] = useState(false);
    const [ abrirTurno, setAbrirTurno ] = useState([]);
    const [numeroCaja, setNumeroCaja] = useState('');
    
    const classes = useStyles();
    let obtenerCajasSucursal = [];

    const {  data } = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

    const obtenerTurno = (e) => {
        setAbrirTurno({...abrirTurno, [e.target.name]: e.target.value});
    };

    if(data){
		obtenerCajasSucursal = data.obtenerCajasSucursal;
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
        turno_en_caja_activo: true, 
        _id: sesion._id,
    };


    let sesionTurno = {
        turno_en_caja_activo: true, 
        numero_caja: numeroCaja,
        id_caja: abrirTurno.caja_elegida,
        usuario_en_turno: sesion._id
    };

    const enviarDatos = async () => {
        try {
            if(!abrirTurno.turno_en_curso ||
                !abrirTurno.caja_elegida ||
                !abrirTurno.monto_abrir
            ){
                setError(true);
                return;
            }else{
                const input = {
                    horario_en_turno: abrirTurno.turno_en_curso,
                    concepto: "A",
                    numero_caja: numeroCaja.toString(),
                    comentarios: "A",
                    id_caja: abrirTurno.caja_elegida,
                    empresa: sesion.empresa._id,
                    sucursal: sesion.sucursal._id,
                    usuario_en_turno: sesion._id,
                    hora_entrada: {
                        hora: "A",
                        minutos: "A",
                        segundos: "A"
                    },
                    hora_salida: {
                        hora: "A",
                        minutos: "A",
                        segundos: "A"
                    },
                    fecha_entrada:{
                        year: "A",
                        mes: "A",
                        dia: "A",
                        no_semana_year: "A",
                        no_dia_year: "A"
                    },
                    fecha_salida:{
                        year: "A",
                        mes: "A",
                        dia: "A",
                        no_semana_year: "A",
                        no_dia_year: "A"
                    },
                    montos_en_caja: {
                        monto_efectivo: parseFloat(abrirTurno.monto_abrir),
                        monto_tarjeta_debito: 0,
                        monto_tarjeta_credito: 0,
                        monto_creditos: 0,
                        monto_puntos: 0,
                        monto_transferencia: 0,
                        monto_cheques: 0,
                        monto_vales_despensa: 0,
                    }
                };
                localStorage.setItem('turnoEnCurso', JSON.stringify(sesionTurno));
                localStorage.setItem('sesionCafi', JSON.stringify(arraySesion));
                await CrearRegistroDeTurno({
                    variables: {
                        activa: true,
                        input
                    }
                });
                setAlert({
                    message: `Turno abierto con exito`,
                    status: "success",
                    open: true,
                });
            }
        } catch (error) {
            setAlert({
                message: `Error: ${error.message}`,
                status: "error",
                open: true,
            });
        }
    };

    return (
        <div>
            <DialogContent>
                <Grid>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography> Empleado:</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="nombre_usuario"
                                    onChange={obtenerTurno}
                                    disabled={true}
                                    value={sesion ? sesion.nombre : ''}
                                    id="form-producto-codigo-barras"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>
                                <span className="obligatorio">* </span>Turno:
                            </Typography>
                            <FormControl
                                variant="outlined"
                                disabled={turnoEnCurso ? true : false}
                                fullWidth
                                size="small"
                            >
                                <Select
                                    id="form-producto-tipo"
                                    name="turno_en_curso"
                                    onChange={obtenerTurno}
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
                            <Typography>
                                <span className="obligatorio">* </span>Caja:
                            </Typography>
                            <FormControl
                                variant="outlined"
                                disabled={turnoEnCurso ? true : false}
                                fullWidth
                                size="small"
                            >
                                <Select
                                    id="form-producto-tipo"
                                    name="caja_elegida"
                                    onChange={obtenerTurno}
                                >
                                    <MenuItem value="">
                                        <em>Selecciona uno</em>
                                    </MenuItem>
                                    {
                                        obtenerCajasSucursal.map((caja) =>{
                                            return(
                                                <MenuItem key={caja.numero_caja} value={caja._id} onClick={() => setNumeroCaja(caja.numero_caja)} >Caja {caja.numero_caja}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        <Box width="100%">
                            <Typography> <span className="obligatorio">* </span>Monto para abrir:</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="monto_abrir"
                                    type="number"
                                    onChange={obtenerTurno}
                                    id="form-producto-codigo-barras"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </div>
                </Grid>
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
        </div>
    )
}