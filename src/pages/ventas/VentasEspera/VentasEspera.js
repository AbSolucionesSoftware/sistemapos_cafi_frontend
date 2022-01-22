import React, { useState } from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions,Dialog, DialogContent, Divider,Grid, Typography, Slide, Badge } from '@material-ui/core'
import ListaVentas from './ListaVentas';
import CloseIcon from '@material-ui/icons/Close';
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
export default function VentasEspera() {
	let listaEnEspera = JSON.parse(localStorage.getItem("ListaEnEspera"));

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.altKey && e.keyCode === 76){ 
            handleClickOpen();
        } 
    };

    return (
        <>
            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <Badge 
                            badgeContent={listaEnEspera ? listaEnEspera.length : 0 } 
                            color="primary" 
                            style={{fontSize: 45}}
                        >
                            <img 
                                src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/lista-de-espera.svg' 
                                alt="icono caja2" 
                                style={{width: 38}} 
                            />
                        </Badge>
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Ventas en Espera</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>Alt + L</b>
                        </Typography>
                    </Box>
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
                            flexGrow={1}
                        >
                            <Box>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/lista-de-espera.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3} >
                                <Typography variant="h6">
                                    Ventas en espera
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                <CloseIcon />
                            </Button>
                        </Box>
                        </Grid>
                        <Grid>
                            <ListaVentas />
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}