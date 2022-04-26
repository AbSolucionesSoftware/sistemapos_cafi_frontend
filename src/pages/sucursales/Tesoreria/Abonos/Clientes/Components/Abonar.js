import React, { useState, useContext} from 'react';

import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { Box, Button, Dialog, DialogContent, makeStyles,  DialogTitle, Slide, TextField, AppBar, Toolbar, Typography, Grid } from '@material-ui/core'
import {AbonosCtx} from "../../../../../../context/Tesoreria/abonosCtx";
import CardVentaAbono from "./AbonarSeleccion/CardVentaAbono";
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
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(6)}px ${theme.spacing(4)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function Abonar() {
    //listo
    
    const {openAbonar, setOpenAbonar, ventas, selectedClient }= useContext(AbonosCtx);
    const classes = useStyles();
    const handleClick = () => { 
        setOpenAbonar(!openAbonar);
    }

    return (
        <Box m={1}>
            <Button
                size="large"
                variant="contained" 
                color="primary"
                onClick={handleClick}
            >
                Abonar
            </Button>
            <Dialog fullScreen open={openAbonar} onClose={handleClick} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        	Detalle de cuenta
						</Typography>
						
                        <Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClick} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
                <div className={classes.formInputFlex}>
                <Box width="40%">
                        <Typography><b>Número de Cliente</b></Typography>
                        <Box mt={1}>
                            <Typography>
                                {selectedClient.numero_cliente}
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="55%">
                        <Typography><b>Nombre de Cliente</b></Typography>
                        <Box mt={1}>
                            <Typography>
                                {selectedClient.nombre_cliente}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box width="100%">
                        <Typography><b>Domicilio</b></Typography>
                        <Box mt={1}>
                            <Typography>
                                {selectedClient.direccion.calle}  {selectedClient.direccion.no_ext}
                            </Typography>
                        </Box>
                    </Box>
                </div>
                <Grid container >
                    {
                        ventas.map((venta) =>{
                            return(
                                <CardVentaAbono datos={venta} />   
                            )
                        })
                    } 
                </Grid>
			</Dialog>
            
        </Box>
    )
}
{/* <Dialog
                open={openAbonar}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <Box display="flex">
                        <Box display="flex" justifyContent="flex-start">
                            Abono a recibir por cuenta
                        </Box>
                        <Box ml={3} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="secondary" onClick={handleClick} size="large">
								<CloseIcon />
							</Button>
                        </Box>
                    </Box>
                    
                </DialogTitle>
                <DialogContent>
                    <Box width="100%">
                        <Typography>Cuenta No. 2501265</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            value="$150,000.00 Mx" 
                           
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>Cuenta No. 2501265</Typography>
                        <TextField
                            fullWidth
                            size="small"
                           
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            value="$150,000.00 Mx" 
                           
                        />
                    </Box>
                    <Box width="100%" p={1} mt={1}>
                        <Typography>Nombre de Cliente: SUTANO</Typography>
                    </Box>
                    <Box width="100%" p={1}>
                        <Typography>Total a abonar:  $15,100</Typography>
                    </Box>
                    <Box p={1}>
                        <Alert severity="info">Si desea editar el abono del cliente, <br/>
                        procure este sea mayor al establecido</Alert>
                    </Box>
                </DialogContent>
                <Box display="flex" justifyContent="center" alignContent="center" p={2}>
                    <Button
                        size="large"
                        variant="contained" 
                        color="primary"
                        style={{fontSize: 16}}
                        onClick={handleClick}
                    >
                        Registrar Abono
                    </Button>
                </Box>
            </Dialog> */}