import React, {useState } from 'react';
import {  Box, Button, Dialog, Divider, Grid, makeStyles, TextField,  Typography } from '@material-ui/core';
import serie from '../../../../icons/Facturacion/numero-de-serie.svg'

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
	},
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));

export default function RegistroSeries() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () =>{setOpen(!open)};

    return (
        <div>
             <Button 
                onClick={handleClickOpen}
                color="primary" 
                variant="contained"
                size="large"
            >
                Registrar Series CDFI
            </Button>
            <Dialog
                maxWidth='lg'
                open={open}
                onClose={handleClickOpen}
                aria-labelledby="max-width-dialog-title"
            >
                <Grid item lg={12}>
                    <Box m={3} display="flex" justifyContent="center">
                        <Box display="flex" alignItems='center'>
                            <img src={serie} alt="icono Factura" style={{width: 70}} />
                        </Box>
                        <Box mr={3} ml={3}>
                            <Divider orientation='vertical' />
                        </Box>
                        <Box display="flex" alignItems='center'>
                            <Typography variant="h5">
                                <b> Registrar Serie</b>
                            </Typography>
                        </Box>
                    </Box>
                    <Box p={2}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Serie para CDFI:
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Folio Inicial:
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        </div>
                    </Box>
                    <Box p={2} display="flex" justifyContent="center" alignItems="center">
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                        >
                            Guardar
                        </Button>
                    </Box>
                </Grid>
                
            </Dialog>
        </div>
    )
}
