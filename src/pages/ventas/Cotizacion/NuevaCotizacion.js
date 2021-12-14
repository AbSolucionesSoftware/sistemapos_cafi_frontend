import React from 'react';
import { Box, Button, DialogContent, 
        FormControl, MenuItem, Select, TextField, Typography 
    } from '@material-ui/core'
import useStyles from '../styles';
import ListaCotizacion from './ListaProductos';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import 'moment/locale/es';

export default function NuevaCotizacion({ handleClickOpen }) {

    const classes = useStyles();
    
    return (
        <>
            <DialogContent style={{padding: 0}} >
                <Box display="flex" >
                    <Box p={.5}>
                        <Button 
                            color="primary"
                            size="large"
                            variant='contained'
                        >
                            Enviar
                        </Button>
                    </Box>
                    <Box p={.5}>
                        <Button 
                            color="primary"
                            size="large"
                            variant='contained'
                        >
                            Vista Previa
                        </Button>
                    </Box>
                    <Box p={.5}>
                        <Button 
                            color="primary"
                            size="large"
                            variant='contained'
                        >
                            Descuento
                        </Button>
                    </Box>
                    <Box p={.5}>
                        <Button 
                            color="primary"
                            size="large"
                            variant='contained'
                        >
                            Guardar
                        </Button>
                    </Box>
                    <Box p={.5}>
                        <Button 
                            color="primary"
                            size="large"
                            variant='contained'
                        >
                            Vender
                        </Button>
                    </Box>
                </Box>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            Cliente:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>
                            Fecha Vencimiento:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                type='date'
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <Box width="50%">
                        <Typography>
                            Tipo de Venta:
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
                                <MenuItem value="Credito">Credito</MenuItem>
                                <MenuItem value="Contado">Contado</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <ListaCotizacion />
                <div className={classes.formInputFlex}>
                    <Box display="flex" justifyContent="flex-end" width="100%">
                        <Box p={1}>
                            <Typography>
                                <b>Sub total:</b> $185.00
                            </Typography>
                        </Box>
                        <Box p={1}>
                            <Typography>
                                <b>Impuestos:</b> $185.00
                            </Typography>
                        </Box>
                        <Box p={1}>
                            <Typography>
                                <b>I.V.A.:</b> $185.00
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="row-reverse" p={1}>
                            <Typography variant="h4">
                                Total: <b style={{color: "green"}}>$15000</b>
                            </Typography>
                            <Box mt={.5} mr={1}>
                                <MonetizationOnIcon style={{fontSize: 37, color: "green"}} />
                            </Box>
                        </Box>
                    </Box>
                </div>
            </DialogContent>
        </>
    )
}
