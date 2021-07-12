import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Divider} from '@material-ui/core/';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import RegistroProvedor from './RegistroProvedor';
import DatosProducto from './DatosProducto';

import { FcPlus } from 'react-icons/fc';
import { Box } from '@material-ui/core';
import ListaCompras from './ListaCompras';
import { Grid } from '@material-ui/core';

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
        alignItems: "center",
        justifyItems: "center"
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbrirCompra({status}) {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(!open);
	};

	return (
		<div>
			
				{status === "enEspera" ? (
					<Button fullWidth onClick={handleClickOpen} color="primary" variant="contained" size="large">
						continuar compra
					</Button>
				): (
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
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Nueva compra de mercancia
						</Typography>
						
						<RegistroProvedor/>

						<Box mx={3}>
							<Button 
								autoFocus 
								color="inherit"
								variant="outlined" 
								size="large" 
								onClick={handleClickOpen}
								startIcon={<AddIcon fontSize="large" />}
							>
								Realizar compra
							</Button>
						</Box>
						<IconButton edge="start" color="inherit" onClick={handleClickOpen} aria-label="close">
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<DatosProducto />	

				<Box p={1} mx={4}>
					<Divider />
				</Box>

				<Box mt={1} mx={4}>
					<ListaCompras />
				</Box>

				<Grid container>
					<Grid item lg={12}>
						<Box mt={1} mx={4} display="flex" justifyContent="flex-end">
							<div className={classes.formInputFlex}>
								<Typography>
									Total compra: $100,000 Mx
								</Typography>
							</div>
						</Box>
					</Grid>
				</Grid>
			</Dialog>

		</div>
	);
}
