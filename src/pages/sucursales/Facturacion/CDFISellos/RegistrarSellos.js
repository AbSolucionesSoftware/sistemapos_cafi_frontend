import React, {useState } from 'react';
import {  Box, Button, Dialog, Divider, Grid, IconButton, makeStyles, TextField,  Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';

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

export default function RegistroSellos() {

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
                Registrar Sellos CDFI
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
                            <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/validacion.svg' alt="icono Factura" style={{width: 70}} />
                        </Box>
                        <Box mr={3} ml={3}>
                            <Divider orientation='vertical' />
                        </Box>
                        <Box display="flex" alignItems='center'>
                            <Typography variant="h5">
                                <b> Registrar Sello Digital</b>
                            </Typography>
                        </Box>
                    </Box>
                    <Box p={2}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Archivo *.cer correspondiente al Certificado de Sello Digital:
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                    />
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                </Box>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Fecha Solicitud:
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        type="date"
                                        size="small"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Fecha de Vencimiento:
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        type="date"
                                        size="small"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Archivo *.key correspondiente a la <b>Llave Privada de Sello Digital</b>:
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                    />
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                </Box>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Contrasena de la Lalave Privada de Sello Digital:
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                    />
                                    <IconButton>
                                        <Search />
                                    </IconButton>
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