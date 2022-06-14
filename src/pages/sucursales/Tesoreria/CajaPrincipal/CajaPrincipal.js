import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, DialogContent } from '@material-ui/core';
import RetiroDeposito from './RetiroDeposito';
import HistorialCuentas from './HistorialCuentas';
import ListaCuentas from './ListaCuentas';

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
	buttons: {
		'& > *': {
			margin: `0px ${theme.spacing(1)}px`
		}
	}

}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CajaPrincipal() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => setOpen(!open);
	const [cuenta, setCuenta ] = useState({});
	const [reload, setReload ] = useState(false);
	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/retiro-de-dinero.svg' alt="icono retiro" className={classes.icon} />
					</Box>
					Caja principal
				</Box>
			</Button>
		
			{/* <RetiroDeposito cuenta={cuenta} tipo={false} open={open} setOpen={setOpen} /> */}
			<Dialog 
				open={open} 
				TransitionComponent={Transition} 
				maxWidth="lg"
				fullWidth
			>
				<Box m={1} display="flex" >
					<Box width='100%' >
						<Typography variant='h5'>
							Caja principal
						</Typography>

					</Box>
					<Button variant="contained" display="flex" justifyContent="flex-end" color="secondary" onClick={handleClickOpen} size="large">
						<CloseIcon />
					</Button>
				</Box>
				
				<DialogContent>
					
					<Box display='flex' mt={2}>
					
						<Box  display='flex' width='80%'  >
							<Typography variant='h5'>
								Efectivo actual
							</Typography>
							<Box ml={2}>
								<Typography variant='h5' >
									$
								</Typography>
							</Box>
						</Box>
						<Box >
							<RetiroDeposito cuenta={cuenta} tipo={false}  setReload={setReload} /> 
						</Box>
					</Box>

					<Box>
						<HistorialCuentas cuenta={cuenta} tipo={false} reload ={reload} />
					</Box>
				</DialogContent>
			</Dialog>
	
		</div>
	);
}
{/* 
	
	<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/retiro-de-dinero.svg' alt="icono retiro" className={classes.icon} />
					</Box>
					Cuentas de Empresa
				</Box>
			</Button>

			<Dialog 
				open={open} 
				TransitionComponent={Transition} 
				maxWidth="lg"
				fullWidth
			>
				<Box m={1} display="flex" justifyContent="flex-end">
					<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
						<CloseIcon />
					</Button>
				</Box>
				<DialogContent>
					<Box textAlign="center">
						<Typography variant="h6">
							Cuentas de empresa
						</Typography>
					</Box>
					<Box>
						<ListaCuentas />
					</Box>
				</DialogContent>
			</Dialog> */}