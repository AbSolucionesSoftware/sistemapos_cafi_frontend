import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './config/routes';
import theme from './config/colors';

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<Switch>{routes.map((route, index) => <RoutesWithSubRoutes key={index} {...route} />)}</Switch>
				</Router>
			</ThemeProvider>
		</div>
	);
}

function RoutesWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			exact={route.exact}
			render={(props) => <route.component routes={route.routes} {...props} />}
		/>
	);
}

export default App;
