import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import NavegacionVentas from '../Navegaciones/NavegacionVentas';
import { Grid, Toolbar } from '@material-ui/core';
import { VentasProvider } from '../../context/Ventas/ventasContext';

const drawerWidth = '30%';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	content: {
		flexGrow: 1,
		// padding: theme.spacing(1)
	},
    toolbar: {
		height: theme.spacing(8)
	},
	// drawerPaper: {
	// 	width: drawerWidth,
	// },
}));

export default function LayoutVentas(props) {
    const { routes } = props
	const classes = useStyles();
    const sesion = localStorage.getItem("sesionCafi");

    if(!sesion) props.history.push('/');

	return (
		<div className={classes.root}>
			<VentasProvider>
				<Grid style={{ width: `calc(100% - ${drawerWidth})`}}>
					<Toolbar className={classes.toolbar} />
					<LoadRoutes routes={routes} />
				</Grid>
				<NavegacionVentas />
			</VentasProvider>
		</div>
	);
}


function LoadRoutes({ routes }) {
	return (
		<Switch>
			{routes.map((route, index) => (
				<Route key={index} path={route.path} exact={route.exact} component={route.component} />
			))}
		</Switch>
	);
}