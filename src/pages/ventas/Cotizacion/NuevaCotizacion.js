import React, { useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, 
    FormControl, MenuItem, 
    Select, TextField, Typography 
} from '@material-ui/core'
import useStyles from '../styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import moment from 'moment';
import 'moment/locale/es';

export default function NuevaCotizacion({ handleClickOpen }) {
    
    const datosVentas = JSON.parse(localStorage.getItem('DatosVentas'));
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const classes = useStyles();
    
    return (
        <>
            <DialogContent style={{padding: 0}} >
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            Usuario:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                variant="outlined"
                                value={sesion ? sesion.nombre : ""}
                            />
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>
                            Fecha:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                variant="outlined"
                                value={moment().format('L')}
                            />
                        </Box>
                    </Box>
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            Cliente:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                variant="outlined"
                                value={datosVentas ? datosVentas.cliente?.nombre_cliente : "Publico General"}
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
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            No. Cliente:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                variant="outlined"
                                value={datosVentas ? datosVentas.cliente?.numero_cliente : ""}
                            />
                        </Box>
                    </Box>
                    <Box width="100%">
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
                                <MenuItem value="CREDITO">Credito</MenuItem>
                                <MenuItem value="CONTADO">Contado</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <Box display="flex" flexDirection="row-reverse" p={1}>
                    <AgregarDescuentos />
                </Box>
                <Box mr={2} mt={2}>
                    <Box display="flex" flexDirection="row-reverse" width="100%">
                        <Typography>
                            <b>Sub total:</b> ${datosVentas ? datosVentas.subTotal : 0}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" width="100%">
                        <Typography>
                            <b>Impuestos:</b> ${datosVentas ? datosVentas.impuestos : 0}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" width="100%">
                        <Typography>
                            <b>I.V.A.:</b> ${datosVentas ? datosVentas.iva : 0}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" width="100%">
                        <Typography>
                            <b>Descuento:</b> <b style={{color: "green"}}>$0</b>
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="row-reverse" p={1}>
                    <Typography variant="h4">
                        Total: <b style={{color: "green"}}>$15000</b>
                    </Typography>
                    <Box mt={.5} mr={1}>
                        <MonetizationOnIcon style={{fontSize: 37, color: "green"}} />
                    </Box>
                </Box>
            </DialogContent>
        </>
    )
};

const AgregarDescuentos = () => {

    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(!open);
    };
    
    return(
        <>
            <Button
                color="primary"
                variant="outlined"
                size="large"
                onClick={handleClickOpen}
            >
                Agregar Descuento
            </Button>
            
            <Dialog
                fullWidth
				open={open} 
				maxWidth='xs'
				onClose={handleClickOpen} 
            >
                <DialogContent>
                    <Box display={'flex'} alignItems={'center'} p={1}>
                        <Typography variant="h6" >
                            Agregar descuento total a la compra.
                        </Typography>
                    </Box>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography variant="h6" >
                                Porciento descuento
                            </Typography>
                            <Box display="flex">
                                <Box display="flex" justifyContent="center" alignItems="center" p={1}>
                                    <img 
                                        src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/price-tag.png' 
                                        alt="icono admin" 
                                        style={{width: 30}}                                   
                                    />
                                </Box>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    className={classes.input}
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography variant="h6" >
                                Total de Compra:
                            </Typography>
                            <Box>
                                <Typography variant="h4">
                                    <b style={{color: "#9B9B9B"}}>$15000</b>
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography variant="h6" >
                                Total con descuento:
                            </Typography>
                            <Box display="flex" alignItems={"center"}>
                                <MoneyOffIcon style={{fontSize: 38, color: "green"}} />
                                <Typography variant="h4">
                                    <b style={{color: "green"}}>15000</b>
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                    
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        size="large"
                        variant='outlined'
                    >
                        Aplicar
                    </Button>
                    <Button
                        color="secondary"
                        size="large"
                        variant='outlined'
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
