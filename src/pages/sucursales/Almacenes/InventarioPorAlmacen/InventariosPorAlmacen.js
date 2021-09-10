import React, { forwardRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Slide, Button, Box, Dialog, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { FcPlus } from 'react-icons/fc';
// import inventarioAlmacen from '../../../../icons/warehouse.svg';
import CloseIcon from '@material-ui/icons/Close';
import ListaAlmacenes from './ListaAlmacenes'

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
	imagen: {
		width: 100
	}
}));

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function InventariosPorAlmacen() {
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
            <Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/conceptosAlmacen.svg' alt="icono almacen" className={classes.imagen}/>
					</Box>
					Inventario por almacen
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                                Almacenes
						</Typography>
						<Box mx={3}>
							<Box m={1}>
								<Button variant="contained" color="secondary" onClick={handleClose} size="large">
									<CloseIcon style={{ fontSize: 30}}/>
								</Button>
							</Box>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							
						</IconButton>
					</Toolbar>
				</AppBar>
				<Box mx={3} p={2}>
					<div className={classes.formInputFlex}>
						<Box width="50%">
							<Typography>Buscar Almacén</Typography>
							<Box display="flex">
								<TextField
									fullWidth
									size="small"
									/* error */
									name="codigo_barras"
									id="form-producto-codigo-barras"
									variant="outlined"
									/* helperText="Incorrect entry." */
								/>
								<Button variant="contained" color="primary">
									Buscar
								</Button>
							</Box>
						</Box>
					</div>
				</Box>
				<Box mx={5}>
					<ListaAlmacenes/>
				</Box>
			</Dialog>
        </div>
    )
}
