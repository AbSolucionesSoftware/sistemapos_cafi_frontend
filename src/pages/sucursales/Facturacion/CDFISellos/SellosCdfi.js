import React, { forwardRef, useState } from 'react';
import { AppBar, Box, Button, Dialog, Grid,  makeStyles, Slide, Toolbar, Typography } from '@material-ui/core';
import sello from '../../../../icons/Facturacion/validacion.svg'
import CloseIcon from '@material-ui/icons/Close';
import ListaSellosCDFI from './ListaSellos';
import RegistroSellos from './RegistrarSellos';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		width: 100
	}
}));

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function SellosCDFI() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () =>{setOpen(!open)};
    
    return (
        <div>
            <Button onClick={handleClickOpen}>
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/validacion.svg' alt="icono Factura" style={{width: 100}} />
                    </Box>
                    Registrar Sellos CDFI
                </Box>
            </Button>
            <Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                            Sellos CDFI
						</Typography>
						<Box mx={3}>
                        </Box>
                        <Box >
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
                <Grid item lg={12}>
                    <Box m={3} display="flex" justifyContent="center">
                        <Box ml={1} flexGrow={1}>
                            <Typography variant="h5" >
                                <b>Seleccion de sellos Digitales</b>
                            </Typography>
                        </Box>
                        <Box>
                           <RegistroSellos />
                        </Box>
                    </Box>
                    <Box m={3}>
                        <ListaSellosCDFI />
                    </Box>
                </Grid>
                
            </Dialog>
        </div>
    )
}