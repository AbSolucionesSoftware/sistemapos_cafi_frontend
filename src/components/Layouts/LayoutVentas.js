import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import NavegacionVentas from '../Navegaciones/NavegacionVentas';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
    toolbar: {
		height: theme.spacing(11)
	},
}));

export default function LayoutVentas(props) {
    const { routes } = props
	const classes = useStyles();
    const sesion = localStorage.getItem("sesionCafi");

    if(sesion === "false") props.history.push('/');

	return (
		<div className={classes.root}>
			<NavegacionVentas />
			<main className={classes.content}>
				<Toolbar className={classes.toolbar} />
				<LoadRoutes routes={routes} />
			</main>
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