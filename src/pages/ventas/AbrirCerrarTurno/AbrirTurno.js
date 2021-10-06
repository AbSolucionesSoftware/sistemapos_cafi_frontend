import React, { useContext, useState } from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent,  FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import { useMutation, useQuery } from '@apollo/client';
import { OBTENER_CAJAS, ACTUALIZAR_CAJA } from '../../../gql/Cajas/cajas';
import { VentasContext } from '../../../context/Ventas/ventasContext';

export default function AbrirTurno({handleClickOpen}) {
    const [ ActualizarCaja ] = useMutation(ACTUALIZAR_CAJA);
    const { setAlert } = useContext(VentasContext);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('cajaEnCurso'));
    const [ error, setError] = useState(false);
    const [ abrirTurno, setAbrirTurno ] = useState([]);
    
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
                    activa: true,
                    usuario_en_caja: sesion._id,
                    turno_en_caja_activo: true
                };
                const cajaActualizada = await ActualizarCaja({
                    variables: {
                        input,
                        id: abrirTurno.caja_elegida
                    }
                });
                localStorage.setItem('turnoEnCurso', JSON.stringify(cajaActualizada.data.actualizarCaja));
                localStorage.setItem('sesionCafi', JSON.stringify(arraySesion));
                setAlert({
                    message: `Turno abierto con exito`,
                    status: "success",
                    open: true,
                });
                handleClickOpen();
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
                                                <MenuItem key={caja.numero_caja} value={caja._id} >Caja {caja.numero_caja}</MenuItem>
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
                        disabled={turnoEnCurso ? true : false}
                    >
                        Aceptar
                    </Button>
                </Box>
            </DialogActions>
        </div>
    )
}