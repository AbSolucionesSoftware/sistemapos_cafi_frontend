import React, { useState } from 'react';
import { Box, Button,  Dialog, DialogActions, DialogContent, Slide, Typography } from '@material-ui/core'
import useStyles from '../styles';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentasCredito() {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    return (
        <>
            <Button 
                className={classes.borderBoton}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/add.svg' 
                            alt="icono credito" 
                            style={{width: 100}}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Venta Credito</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F3</b>
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
                    Ventas A credito
                </DialogContent>
                <DialogActions>

                </DialogActions>

            </Dialog>
            
        </>
    )
}
