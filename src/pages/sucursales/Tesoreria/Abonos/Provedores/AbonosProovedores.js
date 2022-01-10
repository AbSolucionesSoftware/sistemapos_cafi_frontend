import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Search } from '@material-ui/icons';
import { Box, IconButton, InputBase, Paper } from '@material-ui/core';
import { OBTENER_COMPRAS_REALIZADAS } from "../../../../../gql/Compras/compras";


import TablaAbonos from './Components/TablaAbonos';
import { useQuery } from '@apollo/client';

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
	rootSearch: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbonosProveedores() {
	const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

	const classes = useStyles();
	const [ open, setOpen ] = useState(false);
	const [values, setValues] = useState('');

	let comprasCredito = [];

	const { loading, data, error, refetch } = useQuery(
		OBTENER_COMPRAS_REALIZADAS,
		{
		  variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			fecha: ""
		  },
		  fetchPolicy: "network-only",
		}
	);

	if(data){
		comprasCredito = data.obtenerComprasRealizadas;
	}; 

	const handleClickOpen = () => setOpen(!open);

	const pressEnter = (e) => {
		if (e.key === 'Enter') setValues(e.target.defaultValue);
	};


	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/salary.svg' alt="icono abono" className={classes.icon} />
					</Box>
					Abonos de provedores
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        	Abonos a Provedores
						</Typography>
                        <Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
				<Box display='flex' p={2}>
					<Box minWidth="70%">
						<Paper elevation={2} className={classes.rootSearch}>
							<InputBase
								fullWidth
								placeholder="Buscar compra o provedor..."
								onChange={(e) => setValues(e.target.value)}
								onKeyPress={pressEnter}
								value={values}
							/>
							<IconButton onClick={() => setValues(values)}>
								<Search />
							</IconButton>
						</Paper>
					</Box>
				</Box>
				<Box p={2}>
					<TablaAbonos comprasCredito={comprasCredito} />
				</Box>
			</Dialog>
		</div>
	);
}
