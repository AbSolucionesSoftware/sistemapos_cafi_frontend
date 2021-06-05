import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Button, AppBar } from '@material-ui/core';
import { Dialog, DialogActions, Tabs, Tab, Box } from '@material-ui/core';
import perfilIcon from '../../../../icons/perfil.svg';
import fiscalIcon from '../../../../icons/fiscal.svg';
import RegistrarInfoBasica from './RegistrarInfoBasica';
import RegistrarInfoCredito from './RegistroInfoCredito';
import { Add } from '@material-ui/icons';

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
			{value === index && <Box p={3} minHeight="70vh">{children}</Box>}
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
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	iconSvg: {
		width: 50
	}
}));

export default function CrearCliente({tipo}) {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);
	const [ value, setValue ] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const toggleModal = () => setOpen(!open);

	const saveData = () => {
		console.log("hello world");
	};

	return (
		<Fragment>
			<Button color="primary" variant="contained" size="large" onClick={toggleModal}>
				<Add/> Nuevo {tipo}
			</Button>
			<Dialog open={open} onClose={toggleModal} fullWidth maxWidth="md">
				<div className={classes.root}>
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
							<Tab label="Información básica" icon={<img src={perfilIcon} alt="icono perfil" className={classes.iconSvg} />} {...a11yProps(0)} />
							<Tab label="Datos Crediticios" icon={<img src={fiscalIcon} alt="icono factura" className={classes.iconSvg} />} {...a11yProps(1)} />
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={0}>
						<RegistrarInfoBasica tipo={tipo} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<RegistrarInfoCredito tipo={tipo}  />
					</TabPanel>
				</div>
				<DialogActions>
					<Button
						variant="outlined"
						color="secondary"
						onClick={toggleModal}
						size="large"
						startIcon={<CloseIcon />}
					>
						Cerrar
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={saveData}
						size="large"
						startIcon={<DoneIcon />}
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
