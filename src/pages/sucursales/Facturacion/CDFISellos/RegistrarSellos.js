import React, { forwardRef, useState } from 'react';
import { AppBar, Box, Button, Dialog, makeStyles, Slide, Toolbar, Typography } from '@material-ui/core';
import sello from '../../../../icons/Facturacion/validacion.svg'
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundColor: theme.palette.background.paper
	},
	icon: {
		fontSize: 100
	},
	iconSvg: {
		width: 100
	},
	iconSvgVenta: {
		width: 90
	}
}));

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegistroSellos() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () =>{setOpen(!open)};
    
    return (
        <div>
            <Button fullWidth onClick={handleClickOpen}>
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        <img src={sello} alt="icono Factura" style={{width: 100}} />
                    </Box>
                    Registrar Sellos CDFI
                </Box>
            </Button>
            <Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                                Agregar almacen
                        </Typography>
                        <Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon />
							</Button>
						</Box>
                    </Toolbar>
                </AppBar>
                <Box m={3} display="flex" justifyContent="flex-end">

                </Box>
                <Box mx={4}>

                </Box>
            </Dialog>
        </div>
    )
}