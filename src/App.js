import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './config/routes';
import theme from './config/colors';

import client from './config/apollo';
import { ApolloProvider } from '@apollo/client';
import { AccesosProvider } from './context/Accesos/accesosCtx';


function App() {
	return (
		<Box height='100vh' >
			<ApolloProvider client={client}>
				<AccesosProvider>
					<div className="App" >
						<ThemeProvider theme={theme}>
							<CssBaseline />
							<Router>
								<Switch>{routes.map((route, index) => <RoutesWithSubRoutes key={index} {...route} />)}</Switch>
							</Router>
						</ThemeProvider>
					</div>
				</AccesosProvider>
			</ApolloProvider>
		</Box>
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
