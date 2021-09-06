import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, Dialog, DialogActions, DialogTitle, DialogContent, ButtonBase } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import DatosProducto from './productos/DatosProducto';

import { FcPlus } from 'react-icons/fc';
import { Box } from '@material-ui/core';
import ListaCompras from './TablaCompras';
import { Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';

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
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		paddingTop: 3,
		alignItems: 'center',
		justifyItems: 'center'
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbrirCompra({ status }) {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(!open);
	};

	return (
		<div>
			{status === 'enEspera' ? (
				<Button fullWidth onClick={handleClickOpen} color="primary" variant="contained" size="large">
					continuar compra
				</Button>
			) : (
				<Button fullWidth onClick={handleClickOpen}>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center">
							<FcPlus className={classes.icon} />
						</Box>
						Abrir una compra
					</Box>
				</Button>
			)}
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<DialogTitle style={{ padding: 0 }}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								Nueva compra
							</Typography>
							<Box m={1}>
								<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
									<CloseIcon style={{ fontSize: 30 }} />
								</Button>
							</Box>
						</Toolbar>
					</AppBar>
				</DialogTitle>
				<DialogContent>
					<Box height="200px" mb={7}>
						<DatosProducto />
					</Box>
					<ListaCompras />
				</DialogContent>

				<DialogActions  >
					<Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1} mx={2}>
						<Box>
							<Grid container spacing={2} alignItems="center">
								<Grid item>
									<Typography style={{ fontSize: 18 }}>
										Subtotal: <b>$100,000 Mx</b>
									</Typography>
								</Grid>
								<Grid item>
									<Typography style={{ fontSize: 18 }}>
										Impuestos: <b>$100,000 Mx</b>
									</Typography>
								</Grid>
								<Grid item>
									<Typography style={{ fontSize: 18 }}>
										<b>Total: $100,000 Mx</b>
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Box>
					<Button color="inherit" size="large" onClick={() => handleClickOpen()}>
						Cancelar
					</Button>
					<Button
						autoFocus
						color="primary"
						variant="contained"
						size="large"
						onClick={() => handleClickOpen()}
					>
						Realizar compra
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
