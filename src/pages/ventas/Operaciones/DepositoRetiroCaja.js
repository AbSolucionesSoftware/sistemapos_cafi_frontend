import React, { useState } from 'react';

import { Box, Button,  Dialog, DialogActions, DialogContent, Divider, FormControl, Grid,  MenuItem, Select, Slide, TextField, Typography } from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close';

import useStyles from '../styles';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function DepositoRetiroCaja() {
    
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { 
		setOpen(!open);
	};


    return (
        <>
            <Button
                onClick={() =>{handleClickOpen();}}
                style={{textTransform: 'none', height: '100%', width: '70%'}}
            >
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register2.svg' 
                            alt="icono caja" 
                            style={{width: 20}}
                        />
                    </Box>
                    Deposito/Retiro Caja
                </Box>
            </Button>	

            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
                <DialogContent>
                    <Grid container item lg={12}>
                        <Box 
                            display="flex" 
                            textAlign="center" 
                        >
                            <Box
                                display="flex" 
                                justifyContent="center"
                                flexGrow={1} 
                            >
                                <Box>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register2.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                                </Box>
                                <Box m={2} >
                                    <Divider orientation="vertical" />
                                </Box>
                                <Box mt={1} >
                                    <Box>
                                        <Typography variant="h6">
                                            Deposito / Retiro Caja
                                        </Typography>
                                    </Box>
                                    <Box display="flex" textAlign="right">
                                        <Box textAlign="right">
                                            <Typography variant="caption">
                                                31/12/2021
                                            </Typography>
                                        </Box>
                                        <Box textAlign="right" ml={2}>
                                            <Typography variant="caption">
                                                08:00 hrs.
                                            </Typography>
                                        </Box>
                                        <Box textAlign="right" ml={2}>
                                            <Typography variant="caption">
                                                Caja 3
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box ml={10} mb={7} display="flex" alignItems="center">
                                    <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                    <CloseIcon />
                                </Button>
                            </Box>
                        </Box>
                        </Grid>
                        <Grid>
                            <div className={classes.formInputFlex}>
                                <Box width="100%">
                                    <Typography>
                                        Movimiento
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
                                            <MenuItem value="ENTRADA">Entrada</MenuItem>
                                            <MenuItem value="RETIRO">Retiro</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box width="100%">
                                    <Typography>
                                        Tipo:
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
                                            <MenuItem value="Cheque">Cheque</MenuItem>
                                            <MenuItem value="Efectivo">Efectivo</MenuItem>
                                            <MenuItem value="Transferencia">Transferencia</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </div>
                            <div className={classes.formInputFlex}>
                                <Box width="100%">
                                    <Typography>Monto:</Typography>
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
                                    <Typography>Moneda:</Typography>
                                    <Box display="flex">
                                        <TextField
                                            fullWidth
                                            value="Moneda Local"
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
                <DialogActions>
                    <Button 
                        onClick={handleClickOpen} 
                        variant="contained" 
                        color="primary" 
                        size="large"
                    >
                        Aceptar
                    </Button>
                </DialogActions>

            </Dialog>
        </>
    )
}
