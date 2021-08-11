import React, { forwardRef, useState } from 'react';
import { AppBar, Box, Button, Dialog, Grid, makeStyles, Slide, Toolbar, Typography } from '@material-ui/core';
import factura from '../../../../icons/Facturacion/facturaNueva.svg'
import CloseIcon from '@material-ui/icons/Close';

import RegistroFactura from './RegistroFactura';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		fontSize: 100
	},
	root: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	}
}));

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function NuevaFactura() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () =>{setOpen(!open)};
    
    return (
        <div>
            <Button fullWidth onClick={handleClickOpen}>
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        <img src={factura} alt="icono Factura" style={{width: 100}} />
                    </Box>
                    Generar Factura
                </Box>
            </Button>
            <Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								Generar nueva factura
							</Typography>
							<Box m={1}>
								<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
									<CloseIcon style={{fontSize: 30}} />
								</Button>
							</Box>
						</Toolbar>
					</AppBar>
                    <Grid item lg={12}>
                        <Box>
                            <RegistroFactura />
                        </Box>
                    </Grid>
               
                <Box mx={4}>

                </Box>

            </Dialog>
        </div>
    )
}
