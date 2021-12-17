import React, { useState } from 'react'
import useStyles from '../styles';
import PropTypes from 'prop-types';
import { AppBar, Box, Button, CircularProgress, Dialog,  DialogContent, Tab, Grid, Slide, Tabs, Typography } from '@material-ui/core'
import { FcCurrencyExchange } from 'react-icons/fc';
import NuevaCotizacion from './NuevaCotizacion';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import 'moment/locale/es';
import CotizacionesPendientes from './CotizacionesPendientes';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function Cotizacion({type}) {

    moment.locale('es');

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));
    const datosVentas = JSON.parse(localStorage.getItem('DatosVentas'));

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
		setValue(newValue);
	};

    const handleClickOpen = () => {
		setOpen(!open);
	};


    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.altKey && e.keyCode === 84){ 
            handleClickOpen();
        } 
    };

    return (
        <>
			{
				type === "GENERAR" ? (
					datosVentas ? (
						<Button
							variant="outlined"
							color="primary"
							startIcon={<FcCurrencyExchange style={{fontSize: 30}} />}
							onClick={() =>{handleClickOpen()}}
						>
							Generar Cotización
						</Button>	
					) : ""
			) : (
				<Button
					onClick={() =>{handleClickOpen();}}
					style={{textTransform: 'none', height: '100%', width: '60%'}}
				>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center">
							<FcCurrencyExchange style={{fontSize: 25}} />
						</Box>
						<Box>
							<Typography variant="body2" >
								<b>Cotizaciones</b>
							</Typography>
						</Box>
						<Box>
							<Typography variant="caption" style={{color: '#808080'}} >
								<b>Alt + T</b>
							</Typography>
						</Box>
					</Box>
				</Button>
				)
			}
        	<Dialog
				fullWidth
				open={open} 
				maxWidth={type==="GENERAR"?'md':'lg'}
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
						{type === "GENERAR" ? (
							<Tab
								label="Nueva Cotización"
								icon={ <FcCurrencyExchange style={{fontSize: 60}} />}
								{...a11yProps(0)}
							/>
						) : (
							<Tab
								label="Cotizaciones pendientes"
								icon={
									<img 
										src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/lista-de-espera.svg' 
										alt="icono caja2" 
										style={{width: 58}} 
									/>
								}
								{...a11yProps(1)}
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
										{sesion?.nombre}
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
				<VentanasCotizaciones 
					handleClickOpen={handleClickOpen} 
					value={value} 
					type={type} 
				/> 
			</Dialog>
		</>
	)
};


const VentanasCotizaciones = ({ handleClickOpen, value, type}) => {
	const [ loading, setLoading ] = useState(false);

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
		type === "GENERAR" ? (
			<TabPanel style={{padding: 0}} value={value} index={0}>
				<NuevaCotizacion handleClickOpen={handleClickOpen} />
			</TabPanel>
		) : (
			<TabPanel style={{padding: 0}} value={value} index={0}>
				<CotizacionesPendientes handleClickOpen={handleClickOpen} /> 
			</TabPanel>
		)
	)
};