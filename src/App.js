import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './config/routes';
import theme from './config/colors';

import client from './config/apollo';
import { ApolloProvider } from '@apollo/client';

function App() {
	return (
		
		<ApolloProvider client={client}>
			<div className="App">
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Router>
						<Switch>{routes.map((route, index) => <RoutesWithSubRoutes key={index} {...route} />)}</Switch>
					</Router>
				</ThemeProvider>
			</div>
		</ApolloProvider>
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
