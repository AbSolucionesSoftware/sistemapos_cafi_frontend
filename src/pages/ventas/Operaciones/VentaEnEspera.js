import React, { useState } from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid, Slide, Typography } from '@material-ui/core'
import { FcExpired } from 'react-icons/fc';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentaEnEspera() {

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    return (
        <div>
            <Button
                onClick={() =>{handleClickOpen();}}
                style={{textTransform: 'none'}}
            >
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <FcExpired style={{fontSize: 30}} />
                    </Box>
                    En espera
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
                                <FcExpired style={{fontSize: 80}} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h5">
                                    Venta pasada a espera
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
                        size="large"
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
