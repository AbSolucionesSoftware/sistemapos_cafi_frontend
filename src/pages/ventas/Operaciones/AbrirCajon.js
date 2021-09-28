import React, { useState } from 'react';

import { Box, Button, DialogActions, Dialog, DialogContent, Divider, Grid, Typography, Slide } from '@material-ui/core'

import useStyles from '../styles';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbrirCajon() {

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
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cajon.svg' 
                            alt="icono ventas" 
                            style={{width: 50}}
                        />
                    </Box>
                    <Box>
                        Cajon
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
                        textAlign="center" 
                        justifyContent="center" 
                        alignContent="center" 
                        alignSelf="center"
                        justifySelf="center"
                    >
                        <Box>
                            <img 
                                src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cajon.svg' 
                                alt="icono caja"
                                style={{width: 40}}
                        />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h5">
                                Cajon Abierto
                            </Typography>
                        </Box>
                    </Box>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClickOpen} 
                    variant="contained" 
                    color="primary"
                >
                    Aceptar
                </Button>
            </DialogActions>
            </Dialog>
        </div>
    )
}
