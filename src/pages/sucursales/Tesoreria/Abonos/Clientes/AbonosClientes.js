import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, TextField, Grid } from '@material-ui/core';

import TablaAbonos from './Components/TablaAbonos';
import AbonoaRecibir from './Components/AbonoPercibir';

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

	const handleClickOpen = () => setOpen(!open);

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
					<Box width="50%" p={2}>
						<Typography>Busqueda por cliente o por cuenta</Typography>
						<TextField
							fullWidth
							size="small"
							/* error */
							name="nombre_comercial"
							id="form-producto-nombre-comercial"
							variant="outlined"
							/* value="" */
							/* helperText="Incorrect entry." */
							/* onChange={obtenerCampos} */
						/>
					</Box>
					
					<Box mt={5}>
						<Button
							size="large"
							variant="contained" 
							color="primary"
						>
							Buscar
						</Button>
					</Box>
					<Grid item lg={5}>
						<Box display="flex" justifyContent="center" mt={4}>
							<AbonoaRecibir />
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
