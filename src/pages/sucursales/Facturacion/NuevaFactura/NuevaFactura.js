import React, { forwardRef, useState } from 'react';
import { AppBar, Box, Button, Dialog, makeStyles, Slide, Toolbar, Typography } from '@material-ui/core';
import factura from '../../../../icons/Facturacion/facturaNueva.svg'
import CloseIcon from '@material-ui/icons/Close';

import RegistroFactura from './RegistroFactura';
import DetallesFactura from './TablaDetallesFactura';
import ListaDocumentos from './TablaDocumento';
import { ClienteProvider } from '../../../../context/Catalogos/crearClienteCtx';

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
			<ClienteProvider>
				<Button fullWidth onClick={handleClickOpen}>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center" mb={2}>
							<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/facturaNueva.svg' alt="icono Factura" style={{width: 100}} />
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
								<Box  display="flex" alignItems="center">
									<Button
										variant="contained"
										size="large"
										color="default"
										style={{width: "100%", fontSize: 20}}
									>
										GENERAR FACTURA
									</Button>
								</Box>
								<Box m={1}>
									<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
										<CloseIcon style={{fontSize: 30}} />
									</Button>
								</Box>
							</Toolbar>
						</AppBar>
						<Box p={2}>
							<RegistroFactura />
						</Box>
						<Box pr={2} pl={2}>
							<ListaDocumentos />
						</Box>
						<Box pr={2} pl={2}>
							<DetallesFactura />
						</Box>
						<Box display="flex" justifyContent="flex-end">
							<Box p={3}>
								<Typography variant='h6'>
									<b>Subtotal:</b> $1000
								</Typography>
							</Box>
							<Box p={3} >
								<Typography variant='h6'>
									<b>Impuestos:</b> $1000
								</Typography>
							</Box>
							<Box p={3} pr={6}>
								<Typography variant='h6'>
									<b>Total:</b> $1000
								</Typography>
							</Box>
						</Box>
				</Dialog>
			</ClienteProvider>
        </div>
    )
}
