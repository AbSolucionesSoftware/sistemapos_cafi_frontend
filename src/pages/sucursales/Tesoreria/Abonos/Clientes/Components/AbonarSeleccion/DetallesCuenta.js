import React, { useState, useContext } from 'react'

import { Box, Grid, makeStyles, Typography, Button, Dialog, Slide, AppBar, Toolbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import TablaCompras from './TablaCompras';
import TablaAbonos from './TablaDeAbonos';
import {AbonosCtx} from "../../../../../../../context/Tesoreria/abonosCtx";

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
			margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetallesCuenta() {
    

    const {openAbonar, setOpenAbonar, ventas} = useContext(AbonosCtx);
    const classes = useStyles();

    const handleClick =()=>{
        setOpenAbonar(!openAbonar);
    }

    return (
        <div>
          {/*   <Button
                size="medium"
                variant="contained" 
                color="primary"
                onClick={handleClick}
            >
                Detalles
            </Button> */}
            <Dialog fullScreen open={openAbonar} onClose={handleClick} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        	Ventas selecionadas para abonar
						</Typography>
						
                        <Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClick} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>Nombre de Cliente:</Typography>
                        <Box mt={1}>
                            <Typography>
                                Hola mundo
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>Fecha:</Typography>
                        <Box mt={1}>
                            <Typography>
                                Hola mundo
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>Factura:</Typography>
                        <Box mt={1}>
                            <Typography>
                                Hola mundo
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>Empresa:</Typography>
                        <Box mt={1}>
                            <Typography>
                                Hola mundo
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>Domicilio:</Typography>
                        <Box mt={1}>
                            <Typography>
                                Hola mundo
                            </Typography>
                        </Box>
                    </Box>
                 
                   
                </div>
                <Grid container>
                    <Grid item lg={6} xs={12}>
                        <Box p={1}>
                            <Typography variant="h6">
                                Lista de abonos
                            </Typography>
                        </Box>
                        <Box p={1}>
                            <TablaAbonos />
                        </Box>
                        <Box p={1} mr={3} display="flex" justifyContent="flex-end">
                            <Typography>Total a abonado: $ 150,000.00</Typography>
                        </Box>
                        <Box p={1} mr={3} display="flex" justifyContent="flex-end">
                            <Typography>Restante: $ 150,000.00</Typography>
                        </Box>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <Box p={1} >
                            <Typography variant="h6">
                               Lista de compra
                            </Typography>
                        </Box>
                        <Box p={1}>
                            <TablaCompras />
                        </Box>
                        <Box p={1} mr={3} display="flex" justifyContent="flex-end">
                            <Typography>Total a liquidar: $ 150,000.00</Typography>
                        </Box>
                    </Grid>
                </Grid>
			</Dialog>
          
        </div>

    )
}
