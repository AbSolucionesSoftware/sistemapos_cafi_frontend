import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import tallasIcon from '../../../../icons/tallas.svg';
import shirtIcon from '../../../../icons/shirt.svg';
import shoesIcon from '../../../../icons/shoes.svg';
import { Box, Container, Tab, Tabs } from '@material-ui/core';
import RegistroTallas from './RegistroTallas';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={2} my={1} minHeight="50vh">
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
		id: `scrollable-force-tab-${index}`,
		'aria-controls': `scrollable-force-tabpanel-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundColor: theme.palette.background.paper
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	iconSvg: {
		width: 100
	},
	icon: {
		fontSize: 100
	},
	iconSvgSecondary: {
		width: 50
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Tallas() {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);
	const [ value, setValue ] = useState(0);

	const handleChange = (event, newValue) => setValue(newValue);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/tallas.svg' alt="icono ropa" className={classes.iconSvg} />
					</Box>
					Tallas y numeros
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Ropa
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
				<div className={classes.root}>
					<Box>
						<AppBar position="static" color="default" elevation={0}>
							<Tabs
								value={value}
								onChange={handleChange}
								indicatorColor="primary"
								textColor="primary"
								centered
							>
								<Tab
									label="Tallas"
									icon={
										<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/shirt.svg' alt="icono tallas" className={classes.iconSvgSecondary} />
									}
									{...a11yProps(0)}
								/>
								<Tab
									label="Numeros"
									icon={
										<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/shoes.svg' alt="icono numeros" className={classes.iconSvgSecondary} />
									}
									{...a11yProps(1)}
								/>
							</Tabs>
						</AppBar>
						<div>
							<TabPanel value={value} index={0}>
								<Container maxWidth="xs">
									<RegistroTallas tipo="ROPA" />
								</Container>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<Container maxWidth="xs">
									<RegistroTallas tipo="CALZADO" />
								</Container>
							</TabPanel>
						</div>
					</Box>
				</div>
			</Dialog>
		</div>
	);
}
