import React, { useState } from 'react';
import { Box, Button,  Dialog, DialogActions, DialogContent, Slide } from '@material-ui/core'
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
                            style={{width: 110}}
                        />
                    </Box>
                    <Box>
                        Venta Credito
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
