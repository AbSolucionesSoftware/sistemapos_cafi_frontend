import React, { Fragment, useState } from 'react'

import { Box, Grid, makeStyles, Typography, Button, AppBar, Toolbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import TablaCompras from './TablaCompras';
import TablaAbonos from './TablaDeAbonos';
import AbonoaRecibir from '../AbonoPercibir';
import moment from 'moment';
import { formatoMexico } from '../../../../../../../config/reuserFunctions';

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
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
}));


export default function DetallesCuenta({handleClick, cuentaElegida}) {
    
    const classes = useStyles();

    return (
        <Fragment>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Detalles de cuenta
                    </Typography>
                    <Box m={1}>
                        <Button variant="contained" color="secondary" onClick={handleClick} size="large">
                            <CloseIcon style={{fontSize: 30}} />
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <div className={classes.formInputFlex}>
                <Box width="100%" p={1}>
                    <Box width="100%" display="flex" p={.5}>
                        <Typography><b>Nombre de proveedor: </b> </Typography>
                        <Typography style={{paddingLeft: 5}}>{cuentaElegida.proveedor.id_proveedor.nombre_cliente}</Typography>
                    </Box>
                    <Box width="100%" display="flex"  p={.5}>
                        <Typography><b>Clave proveedor: </b> </Typography>
                        <Typography style={{paddingLeft: 5}}>{cuentaElegida.proveedor.id_proveedor.clave_cliente}</Typography>
                    </Box>
                </Box>
                <Box width="100%" p={1}>
                    <Box width="100%" display="flex" p={.5}>
                        <Typography><b>Nombre de usuario: </b> </Typography>
                        <Typography style={{paddingLeft: 5}}>{cuentaElegida.usuario.nombre}</Typography>
                    </Box>
                    <Box width="100%" display="flex"  p={.5}>
                        <Typography><b>Numero usuario: </b> </Typography>
                        <Typography style={{paddingLeft: 5}}>{cuentaElegida.usuario.numero_usuario}</Typography>
                    </Box>
                </Box>
                <Box width="100%" p={1}>
                    <Box width="100%" display="flex" p={.5}>
                        <Typography><b>Fecha compra: </b> </Typography>
                        <Typography style={{paddingLeft: 5}}>{moment(cuentaElegida.fecha_registro).format('D MMMM YYYY')}</Typography>
                    </Box>
                    <Box width="100%" display="flex"  p={.5}>
                        <Typography><b>Fecha vencimiento: </b> </Typography>
                        <Typography style={{paddingLeft: 5}}>{moment(cuentaElegida.fecha_vencimiento_credito).format('D MMMM YYYY')}</Typography>
                    </Box>
                </Box>
                <Box width="60%" p={1} display='flex' alignItems={'center'} >
                    <AbonoaRecibir cuenta={cuentaElegida} />
                </Box>
            </div>
            <Grid container>
                <Grid item lg={6} xs={12}>
                    <Box p={2}>
                        <Typography variant="h6">
                            Lista de abonos
                        </Typography>
                    </Box>
                    <Box p={2}>
                        <TablaAbonos />
                    </Box>
                    <Box p={1} mr={3} display="flex" justifyContent="flex-end">
                        <Typography variant='h6'>Total abonado: <b style={{color: "#9B9B9B"}}>${formatoMexico(cuentaElegida.total - cuentaElegida.saldo_credito_pendiente)}</b></Typography>
                    </Box> 
                    <Box p={1} mr={3} display="flex" justifyContent="flex-end">
                        <Typography variant='h6'>Restante: <b  style={{color: "green"}}>${formatoMexico(cuentaElegida.saldo_credito_pendiente)}</b></Typography>
                    </Box>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <Box p={2} >
                        <Typography variant="h6">
                            Lista de compra
                        </Typography>
                    </Box>
                    <Box p={2}>
                        <TablaCompras productos={cuentaElegida.productos}/>
                    </Box>
                    <Box p={1} mr={3} display="flex" justifyContent="flex-end">
                        <Typography variant='h6'>Total a liquidar: <b  style={{color: "red"}}>${formatoMexico(cuentaElegida.total)}</b></Typography>
                    </Box>
                </Grid>
            </Grid>
        </Fragment>

    )
}
