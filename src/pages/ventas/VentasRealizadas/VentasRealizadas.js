import React, { useState } from 'react'
import useStyles from '../styles';

import { Box, Button, Dialog, DialogActions, DialogContent, Divider,Grid, IconButton, InputBase,  Paper, Slide, Typography } from '@material-ui/core'
import { Search } from '@material-ui/icons';
import ListaVentasRealizadas from './ListaVentasRealizadas';
import CloseIcon from '@material-ui/icons/Close';
import { FcPaid } from 'react-icons/fc';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentasRealizadas() {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    return (
        <div>
           <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <FcPaid style={{ fontSize: 50 }}/>
                    </Box>
                    <Box>
                        Ventas Realizadas
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
                            <Box mt={3}>
                                <Typography variant="h6">
                                    Ventas Realizadas
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
                            <div className={classes.formInputFlex}>
                                <Box width="100%">
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar venta..."
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </div>
                            <ListaVentasRealizadas />
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}