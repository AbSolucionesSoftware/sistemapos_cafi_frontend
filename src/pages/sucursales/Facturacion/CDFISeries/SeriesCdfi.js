import React, { forwardRef, useState } from 'react';
import { AppBar, Box, Button, Dialog, Grid, makeStyles, Slide, Toolbar, Typography } from '@material-ui/core';
import serie from '../../../../icons/Facturacion/numero-de-serie.svg'
import CloseIcon from '@material-ui/icons/Close';
import RegistroSeries from './RegistroSeries';
import ListaSellosCDFI from './ListaSellos';
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

export default function SeriesCDFI() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () =>{setOpen(!open)};
    
    return (
        <div>
            <Button fullWidth onClick={handleClickOpen}>
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        <img src={serie} alt="icono Factura" style={{width: 100}} />
                    </Box>
                    Registrar Series CDFI
                </Box>
            </Button>
            <Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Series CDFI
                        </Typography>
                        <Box m={1}>
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
                                <b>Seleccion de Series CDFI</b>
                            </Typography>
                        </Box>
                        <Box>
                           <RegistroSeries />
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