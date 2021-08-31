import React from 'react'
import useStyles from '../styles';

import { Box, DialogContent,  FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'

export default function AbrirTurno(handleClickOpen) {

    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid>
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
                                    id="form-producto-tipo"
                                    name="tipo_producto"
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
                            <Typography>Empleado:</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="codigo_barras"
                                    id="form-producto-codigo-barras"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>Monto para abrir:</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="codigo_barras"
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
                                    name="codigo_barras"
                                    id="form-producto-codigo-barras"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </div>
                </Grid>
            </DialogContent>
        </div>
    )
}