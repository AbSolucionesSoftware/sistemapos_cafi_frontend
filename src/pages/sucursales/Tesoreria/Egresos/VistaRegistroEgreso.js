import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types';

import { AppBar, Box, Button, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import addIcon from '../../../../icons/ventas/add.svg'
import { FcDonate } from 'react-icons/fc';
import CloseIcon from '@material-ui/icons/Close';

import FormRegistroEgresos from './FormRegistroEgresos';


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
				<Box p={3} minHeight="70vh">
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
	},
	iconSize: {
		fontSize: 40,
        color: theme.palette.info.main
	},
	buttons: {
		'& > *': {
			margin: `0px ${theme.spacing(1)}px`
		}
	}

}));

export default function VistaRegistroEgreso({handleClickOpen}) {
    
    const classes = useStyles();
    const [ value, setValue ] = useState(0);

    const handleChange = (event, newValue) => {
		setValue(newValue);
	};

    return (
        <Fragment>
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
						<Tab
							label="Egreso a Credito"
							icon={<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/add.svg' alt="icono perfil" className={classes.iconSvg} />}
							{...a11yProps(0)}
						/>
						<Tab
							label="Egreso a Contado"
							icon={<FcDonate className={classes.iconSize} />}
							{...a11yProps(1)}
						/>
						<Grid container justify="flex-end">
							<Box mt={4} display="flex" >
								<Typography variant="h6">Usuario: Funalo</Typography> 
							</Box>
						</Grid>
						<Grid>
							<Box mt={3} ml={5} display="flex" justifyContent="flex-end">
								<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
									<CloseIcon />
								</Button>
							</Box>
						</Grid>
					</Tabs>
										
				</AppBar>
				<TabPanel value={value} index={0}>
					<FormRegistroEgresos tipo='credito'/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<FormRegistroEgresos tipo='contado' />
				</TabPanel>
			</div>
        </Fragment>

    )
}