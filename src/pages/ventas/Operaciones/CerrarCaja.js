import React, { useState } from 'react'
import useStyles from '../styles';

import { Box, Button, Dialog, DialogActions, DialogContent,  FormControl, Grid, MenuItem, Select, Slide, TextField, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CerrarCaja() {

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
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register.svg' 
                            alt="icono caja" 
                            style={{width: 20}}
                        />
                    </Box>
                    Corte Caja
                </Box>
            </Button>	

            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
                <DialogContent>
                    <Grid container>
                        <Grid item lg={10}>
                            <Box
                                display="flex" 
                                alignItems="center"
                            >
                                <Box>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                                </Box>
                                <Box ml={2}>
                                    <Box textAlign="left">
                                        <Typography variant="h6">
                                            Corte de Caja
                                        </Typography>
                                    </Box>
                                    <Box display="flex">
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
                        </Grid>
                        <Grid item lg={2}>
                            <Box ml={4} display="flex" alignItems="center" justifyContent="flex-end">
                                <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                    <CloseIcon />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
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
                                <Typography>Monto Entregado:</Typography>
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
                <DialogActions>
                    <Button 
                        onClick={handleClickOpen} 
                        color="primary"
                        variant="contained"
                        size="large"
                        autoFocus
                    >
                        Aceptar
                    </Button>
                </DialogActions>

            </Dialog>
        </>
    )
}