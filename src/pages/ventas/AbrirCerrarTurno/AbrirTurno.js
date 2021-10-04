import React, { useState } from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent,  FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import { useQuery } from '@apollo/client';
import { OBTENER_CAJAS } from '../../../gql/Cajas/cajas';

export default function AbrirTurno({handleClickOpen}) {
    const classes = useStyles();
    const [ abrirTurno, setAbrirTurno ] = useState([]);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    let obtenerCajasSucursal = [];

    const {  data, refetch } = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

    const obtenerTurno = (e) => {
        setAbrirTurno({...abrirTurno, [e.target.name]: e.target.value})
    }

    if(data){
		obtenerCajasSucursal = data.obtenerCajasSucursal;
	}

    console.log(abrirTurno);

    const enviarDatos = () => {
        localStorage.setItem('turnoEnCurso', JSON.stringify(abrirTurno));
        handleClickOpen();
    }

    return (
        <div>
            <DialogContent>
                <Grid>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Empleado:</Typography>
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
                                Turno:
                            </Typography>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <Select
                                    id="form-producto-tipo"
                                    name="horario_turno"
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
                                Caja:
                            </Typography>
                            <FormControl
                                variant="outlined"
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
                            <Typography>Monto para abrir:</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="monto_abrir"
                                    type="number"
                                    value={abrirTurno.monto_abrir ? abrirTurno.monto_abrir : ""}
                                    onChange={obtenerTurno}
                                    id="form-producto-codigo-barras"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Comentarios:</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                    name="comentarios"
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
                    <Button onClick={enviarDatos} variant="contained" color="primary" size="large">
                        Aceptar
                    </Button>
                </Box>
            </DialogActions>
        </div>
    )
}