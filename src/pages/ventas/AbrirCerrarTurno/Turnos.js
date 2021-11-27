import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types';
import { AppBar, Box, Button, CircularProgress, Dialog, DialogContent, Grid, makeStyles, Slide, StepButton, Tab, Tabs, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

import AbrirTurno from './AbrirTurno';
import CerrarTurno from './CerrarTurno';
import moment from 'moment';
import 'moment/locale/es';
import { VentasContext } from '../../../context/Ventas/ventasContext';
moment.locale('es');

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-reg-product-${index}`}
			aria-labelledby={`reg-product-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3} height="70vh">
					{children}
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `reg-product-tab-${index}`,
		'aria-controls': `tabpanel-reg-product-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(0)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(0)}px`
	},
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	iconSvg: {
		width: 50
	},
	dialogContent: {
		padding: 0
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Turnos() {
	const { abrirTurnosDialog, setAbrirTurnosDialog } = useContext(VentasContext);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleClickOpen = () => { 
		setAbrirTurnosDialog(!abrirTurnosDialog);
	};

	window.addEventListener('keydown', Mi_función); 

	function Mi_función(e){
		if(e.altKey && e.keyCode === 85){ 
			handleClickOpen();
		} 
	};

    return (
        <>
			<Button
                onClick={() => handleClickOpen()}
                style={{textTransform: 'none', height: '100%', width: '60%'}}
            >
                <Box display="flex" flexDirection="column" style={{height: '100%', width: '100%'}}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shift.svg'
                            alt="icono caja" 
                            style={{width: 20}}
                        />
                    </Box>
					<Box>
                        <Typography variant="body2" >
                            <b>Abrir/Cerrar turno</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>Alt + U</b>
                        </Typography>
                    </Box>
                </Box>
            </Button>	

            <Dialog
				maxWidth='lg'
				open={abrirTurnosDialog} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
            <AppBar position="static" color="default" elevation={0}>
					<Tabs
						value={value}
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="on"
						indicatorColor="primary"
						textColor="primary"
						aria-label="scrollable force tabs example"
					>
						
						{sesion?.turno_en_caja_activo === true ? (
							<Tab
								label="Cerrar Turno"
								icon={<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shift.svg' alt="icono almacen" className={classes.iconSvg} />}
								{...a11yProps(0)}
							/>
						) : (
							<Tab
								label="Abrir Turno"
								icon={<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shift.svg' alt="icono almacen" className={classes.iconSvg} />}
								{...a11yProps(0)}
							/>			
						)}
						<Grid container justify='flex-end'>
							<Box mt={2} textAlign="right">
								<Box textAlign="right">
									<Typography variant="caption">
										{moment().format('L')}
									</Typography>
								</Box>
								<Box textAlign="right">
									<Typography variant="caption">
										{moment().format('LT')} hrs.
									</Typography>
								</Box>
								<Box textAlign="right">
									<Typography variant="caption">
										Caja {!turnoEnCurso ? null : turnoEnCurso.numero_caja }
									</Typography>
								</Box>
							</Box>
							
						</Grid>
						<Box mt={3} ml={3}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="medium">
								<CloseIcon />
							</Button>
						</Box>
					</Tabs>
				</AppBar>
                <ContenidoTurnos handleClickOpen={handleClickOpen} value={value} /> 
			</Dialog>
        </>
    )
}


const ContenidoTurnos = ({ handleClickOpen, value}) => {

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [loading, setLoading] = useState(false);

	if (loading) 
	return (
		<Box
		display="flex"
		flexDirection="column"
		justifyContent="center"
		alignItems="center"
		height="80vh"
		>
			<CircularProgress />
		</Box>
	);

	return(
		<DialogContent style={{padding: 0}}>
			{sesion?.turno_en_caja_activo === true ? (
				<TabPanel style={{padding: 0}} value={value} index={0}>
					<CerrarTurno setLoading={setLoading} handleClickOpen={handleClickOpen} />
				</TabPanel>
			): (
				<TabPanel value={value} index={0}>
					<AbrirTurno setLoading={setLoading} handleClickOpen={handleClickOpen} />
				</TabPanel>
			)}
		</DialogContent>
	)
}
