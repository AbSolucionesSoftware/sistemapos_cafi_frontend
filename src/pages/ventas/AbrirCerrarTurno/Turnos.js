import React, { useState } from 'react'
import PropTypes from 'prop-types';

import { AppBar, Box, Button, DialogActions, DialogContent, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

import AbrirTurno from './AbrirTurno';
import CerrarTurno from './CerrarTurno';

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

export default function Turnos({handleClickOpen}) {

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
		setValue(newValue);
	};

    return (
        <div style={{padding: 0}}>
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
						<Tab
							label="Cerrar Turno"
							icon={<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shift.svg' alt="icono almacen" className={classes.iconSvg} />}
							{...a11yProps(0)}
						/>
						<Tab
							label="Abrir Turno"
							icon={<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shift.svg' alt="icono almacen" className={classes.iconSvg} />}
							{...a11yProps(1)}
						/>
						<Grid container justify='flex-end'>
							<Box mt={2} textAlign="right">
								<Box textAlign="right">
									<Typography variant="caption">
										31/12/2021
									</Typography>
								</Box>
								<Box textAlign="right">
									<Typography variant="caption">
										08:00 hrs.
									</Typography>
								</Box>
								<Box textAlign="right">
									<Typography variant="caption">
										Caja 3
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

                <DialogContent style={{padding: 0}} >
                    <TabPanel value={value} index={0}>
                        <CerrarTurno />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AbrirTurno />
                    </TabPanel>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
						Aceptar
					</Button>
				</DialogActions>
        </div>
    )
}
