import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import {FcSurvey } from 'react-icons/fc';

import ListaDepositosRetiros from './ListaDepositosRetiros';
import ListaEgresos from './ListaEgresos';
import ListaTransferencias from './ListaTransferencias';

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
	root: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundColor: theme.palette.background.paper
	},
	rootBusqueda: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReportesTesoreria() {
	const classes = useStyles();

	const [ventana, setVentana] = useState('');
	const [ open, setOpen ] = useState(false);

	const handleClickOpen = () => setOpen(!open);

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center" >
                        <FcSurvey style={{fontSize: 100}}/>
					</Box>
					Reportes Tesoreria
				</Box>
			</Button>
			<Menu
				 id="customized-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={ ()=>{
						handleClickOpen()
						setVentana('retiros y depositos')
					}}>
				<ListItemIcon>
					<FcSurvey style={{fontSize: 35}} />
				</ListItemIcon>
					Historial Retiros y Depositos
				</MenuItem>
				<MenuItem onClick={ ()=>{
						handleClickOpen()
						setVentana('egresos')
					}}>
					<ListItemIcon>
						<FcSurvey style={{fontSize: 35}} />
					</ListItemIcon>
					Historial Egresos
				</MenuItem>
				<MenuItem onClick={ ()=>{
						handleClickOpen()
						setVentana('transferencias')
					}}>
					<ListItemIcon>
						<FcSurvey style={{fontSize: 35}} />
					</ListItemIcon>
					Historial Transferencias
				</MenuItem>
			</Menu>
			
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Histotorial de {ventana}
						</Typography>
                        <Button variant="outlined" size="large" color="inherit"  onClick={handleClickOpen} aria-label="close">
							<CloseIcon />
							Cerrar
						</Button>
					</Toolbar>
				</AppBar>
				
				<Box>
					{
						ventana === 'egresos' ? (
							<ListaEgresos />
						) : ventana === 'transferencias' ?(
							<ListaTransferencias />			
						) :(
							<ListaDepositosRetiros />
						)
					}
				</Box>
				
			</Dialog>
		</div>
	);
}
