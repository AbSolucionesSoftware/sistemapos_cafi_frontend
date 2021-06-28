import React, { forwardRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Slide, Button, Box, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FcPlus } from 'react-icons/fc';
import ContainerRegistroAlmacen from './ContainerRegistroAlmacen';
import ListaAlmacen from './ListaAlmacen';
import { AlmacenProvider } from '../../../../context/Almacenes/crearAlmacen';



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
	}
}));

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegistroAlmacen() {
    const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

    return (
        <div>
			<AlmacenProvider>
				<Button fullWidth onClick={handleClickOpen}>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center">
							<FcPlus className={classes.icon} />
						</Box>
						Agregar almacen
					</Box>
				</Button>
				<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
									Agregar almacen
							</Typography>
							<Box mx={3}>
								<Button autoFocus color="inherit" size="large" onClick={handleClose}>
									Cerrar
								</Button>
							</Box>
							<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
								
							</IconButton>
						</Toolbar>
					</AppBar>
					<Box m={3} display="flex" justifyContent="flex-end">
						<ContainerRegistroAlmacen accion="registrar" />
					</Box>
					<Box mx={4}>
						<ListaAlmacen />
					</Box>
				</Dialog>
			</AlmacenProvider>
        </div>
    )
}
