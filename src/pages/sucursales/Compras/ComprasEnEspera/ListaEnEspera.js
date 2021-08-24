import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Dialog, Typography, Grid, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import AbrirCompra from '../AbrirCompra/AbrirCompra';
import DatosDeCompra from '../ComprasRealizadas/DatosDeCompra';

const columns = [
	{ id: 'name', label: 'Name', minWidth: 170 },
	{ id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
	{
		id: 'population',
		label: 'Population',
		minWidth: 170,
		align: 'right',
		format: (value) => value.toLocaleString('en-US')
	},
	{
		id: 'size',
		label: 'Size\u00a0(km\u00b2)',
		minWidth: 170,
		align: 'right',
		format: (value) => value.toLocaleString('en-US')
	},
	{
		id: 'density',
		label: 'Density',
		minWidth: 170,
		align: 'right',
		format: (value) => value.toFixed(2)
	}
];

function createData(name, code, population, size) {
	const density = population / size;
	return { name, code, population, size, density };
}

const rows = [
	createData('India', 'IN', 1324171354, 3287263),
	createData('China', 'CN', 1403500365, 9596961),
	createData('Italy', 'IT', 60483973, 301340),
	createData('United States', 'US', 327167434, 9833520),
	createData('Canada', 'CA', 37602103, 9984670),
	createData('Australia', 'AU', 25475400, 7692024),
	createData('Germany', 'DE', 83019200, 357578),
	createData('Ireland', 'IE', 4857000, 70273),
	createData('Mexico', 'MX', 126577691, 1972550),
	createData('Japan', 'JP', 126317000, 377973),
	createData('France', 'FR', 67022000, 640679),
	createData('United Kingdom', 'GB', 67545757, 242495),
	createData('Russia', 'RU', 146793744, 17098246),
	createData('Nigeria', 'NG', 200962417, 923768),
	createData('Brazil', 'BR', 210147125, 8515767)
];

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '60vh'
	}
});

export default function ListaEnEspera({props}) {
	const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [compraSeleccionada, setCompraSeleccionada] = useState([]);
	const [open, setOpen] = useState(false);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(14);

	const handleOpen = () => {
		setOpen(!open)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
									{columns.map((column) => {
										const value = row[column.id];
										return (
											<TableCell 
												key={column.id} 
												align={column.align}
												onClick={() => {
													handleOpen();
													setCompraSeleccionada(row)
												}}
											>
												{column.format && typeof value === 'number' ? (
													column.format(value)
												) : (
													value
												)}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 10, 25, 100 ]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>

			<Dialog open={open} onClose={handleOpen} fullWidth maxWidth="lg">
				<Grid item lg={12}>
					<Box display="flex"  alignItems="center" p={2} textAlign="center">
						<Box flexGrow={1}>
							<Typography variant="h6">
								Datos de compra
							</Typography>
						</Box>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Box>
				</Grid>
				<Grid container>
					<Grid item lg={12}>
						<Box p={3} textAlign="center">
							<Typography variant="h6">
								{compraSeleccionada.name}
							</Typography>
						</Box>
						<Box p={2}>
							<DatosDeCompra datosCompra={compraSeleccionada}/>
						</Box>
					</Grid>
				</Grid>
				<Grid item lg={12}>
					<Box display="flex" flexDirection="row-reverse" p={2} textAlign="center">
						<AbrirCompra status={"enEspera"}/>
					</Box>
				</Grid>
			</Dialog>

		
		</Paper>
	);
}
