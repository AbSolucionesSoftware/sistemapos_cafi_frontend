import React from 'react';
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
import generoIcon from '../../../../icons/genero.svg';
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
	const [ open, setOpen ] = React.useState(false);
	const [ value, setValue ] = React.useState(0);

	const handleChange = (event, newValue) => setValue(newValue);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<img src={tallasIcon} alt="icono ropa" className={classes.iconSvg} />
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
						<Button autoFocus color="inherit" size="large" onClick={handleClickOpen} startIcon={<CloseIcon />}>
							Cerrar
						</Button>
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
										<img src={shirtIcon} alt="icono tallas" className={classes.iconSvgSecondary} />
									}
									{...a11yProps(0)}
								/>
								<Tab
									label="Numeros"
									icon={
										<img src={shoesIcon} alt="icono numeros" className={classes.iconSvgSecondary} />
									}
									{...a11yProps(1)}
								/>
								<Tab
									label="Genero"
									icon={
										<img src={generoIcon} alt="icono genero" className={classes.iconSvgSecondary} />
									}
									{...a11yProps(2)}
								/>
							</Tabs>
						</AppBar>
						<TabPanel value={value} index={0}>
							<Container maxWidth="sm">
								<RegistroTallas tipo="ropa" />
							</Container>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Container maxWidth="sm">
									<RegistroTallas tipo="calzado" />
							</Container>
						</TabPanel>
						<TabPanel value={value} index={2}>
							Todo lo de Genero
						</TabPanel>
					</Box>
				</div>
			</Dialog>
		</div>
	);
}
