import React, { useContext, useState } from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import CuentasEmpresaSucursales from './CuentasEmpresaSucursales/CuentasEmpresaSucursales';
import Egresos from './Egresos/Egresos';
import AbonosProveedores from './Abonos/Provedores/AbonosProovedores';
import AbonosClientes from './Abonos/Clientes/AbonosClientes';
// import Transferencias from './Transferencias/Transferencias';

import SnackBarMessages from '../../../components/SnackBarMessages';
import { TesoreriaCtx } from '../../../context/Tesoreria/tesoreriaCtx';

export default function Tesoreria() {

	const { alert, setAlert } = useContext(TesoreriaCtx);

	return (
		<Container>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
			<Grid container spacing={2} justify="center">
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<CuentasEmpresaSucursales />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Egresos />
					</Box>
				</Grid>
                <Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<AbonosProveedores />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<AbonosClientes />
					</Box>
				</Grid>
                {/* <Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Transferencias />
					</Box>
				</Grid> */}
			</Grid>
		</Container>
	);
}
