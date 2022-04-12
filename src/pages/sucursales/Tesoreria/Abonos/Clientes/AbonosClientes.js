import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, TextField, Grid, IconButton, InputAdornment } from '@material-ui/core';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import TablaAbonos from './Components/TablaAbonos';
import ButtonLiquidar from './Components/Liquidar';
import ButtonAbonar from './Components/Abonar';

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
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbonosClientes() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [filtro, setFiltro] = useState("");
	const searchfilter = useRef(null);
	const handleClickOpen = () => setOpen(!open);
	
	const obtenerBusqueda = (e, value) => {
		e.preventDefault();
		//refetch({ filtro: value, fecha: '' });
		setFiltro(value);
	};
	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/salary.svg' alt="icono abono" className={classes.icon} />
					</Box>
					Abonos de Clientes
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        	Abonos de Clientes 
						</Typography>
						
                        <Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
				<Grid container>
					<Grid item lg={5} >
						<Box p={2}>
							<Box minWidth="70%">
							<form onSubmit={(e) => obtenerBusqueda(e, e.target[0].value)}>
								<TextField
									inputRef={searchfilter}
									fullWidth
									size="small"
									variant="outlined"
									placeholder="Buscar cliente..."
									InputProps={{
									endAdornment: (
										<InputAdornment position="end">
										<IconButton type="submit" color="primary" size="medium">
											<SearchOutlined />
										</IconButton>
										</InputAdornment>
									),
									}}
								/>
							</form>
						</Box>
					</Box>			
					</Grid>
					<Grid item lg={7}>
						<Box  mt={1} mr={2} display="flex" justifyContent="flex-end" alignContent="space-between">
							<ButtonLiquidar />
							<ButtonAbonar />
						</Box>
					</Grid>
				</Grid> 		
				<Box p={2}>
					<TablaAbonos />
				</Box>
			</Dialog>
		</div>
	);
}
