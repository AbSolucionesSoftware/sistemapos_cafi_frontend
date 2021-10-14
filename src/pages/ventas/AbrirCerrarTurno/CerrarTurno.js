import React, { useState } from 'react'
import useStyles from '../styles';

import { Box,  DialogActions,  DialogContent,  FormControl, Grid, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TextField, Typography } from '@material-ui/core'
import { TableRow } from '@material-ui/core';

export default function AbrirTurno(handleClickOpen) {

    const classes = useStyles();
    const [ montoTurno, setMontoTurno ] = useState([]);
    const [ datosCerrarTurno, setDatosCerrarTurno ] = useState([]);

    const obtenerCamposMontos = (e) => { 
        setMontoTurno({...montoTurno, [e.target.name]: e.target.value})
    };

    const obtenerCampos = (e) => { 
        setDatosCerrarTurno({...datosCerrarTurno, [e.target.name]: e.target.value})
    };

    const input = {
        montos_en_caja: montoTurno,
        horario_en_turno: "",
        concepto: "",
        numero_caja: "",
        id_caja: "",
        comentarios: "",
        usuario_en_truno: "",
        empresa: "",
        sucursal: ""
    };

    return (
        <>
            <DialogContent style={{padding: 0}}>
                <TableContainer style={{padding: 0}}>
                    <Table stickyHeader size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    Concepto 
                                </TableCell>
                                <TableCell align="center">
                                    Total 
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            <TableRow hover>
                                <TableCell align="center" > 
                                    Efectivo
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_efectivo"
                                        type="number"
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell  align="center" > 
                                    Tarjeta Debito
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_tarjeta_debito"
                                        type="number"
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell  align="center" > 
                                    Tarjeta Credito
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_tarjeta_credito"
                                        type="number" 
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell  align="center" > 
                                    Creditos
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_creditos"
                                        type="number" 
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell  align="center" > 
                                    Puntos
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_puntos"
                                        type="number" 
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell  align="center" > 
                                    Transferencias
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_transferencia"
                                        type="number" 
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell  align="center" > 
                                    Cheques
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_cheques"
                                        type="number" 
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell  align="center" > 
                                    Vales Despensa
                                </TableCell>
                                <TableCell  align="center" > 
                                    <TextField
                                        name="monto_vales_despensa"
                                        type="number" 
                                        defaultValue={0}
                                        color="primary"
                                        style={{width: "70%"}}
                                        onChange={obtenerCamposMontos}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container >
                    <Grid item lg={6}>
                        <Box mt={1} textAlign="center">
                            <Typography >
                                <b>Monto total efectivo:</b>
                            </Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography>
                                <b>Monto en otro tipos:</b>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item lg={6} justify='flex-end'>
                        <Box mt={1} textAlign="center" >
                            <Typography>
                                $2,000
                            </Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography>
                                $5,000
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <div className={classes.formInputFlex}>
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
                                onChange={obtenerCampos}
                                id="form-producto-tipo"
                                name="horario_en_turno"
                            >
                                <MenuItem value="">
                                    <em>Selecciona uno</em>
                                </MenuItem>
                                <MenuItem value="Vespertino">Vespertino</MenuItem>
                                <MenuItem value="Matutino">Matutino</MenuItem>
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
                                rows={1}
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

            </DialogActions>
        </>
    )
}