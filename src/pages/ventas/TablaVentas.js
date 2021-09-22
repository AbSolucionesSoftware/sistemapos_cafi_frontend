import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';


const columns = [
	{ id: 'cantidad', label: 'Cant', minWidth: 20, align: 'center' },
	{ id: 'descripcion', label: 'Descripcion', minWidth: 330 },
	{ id: 'existencia', label: 'Exist.', minWidth: 100, align: 'center'},
	{ id: 'descuento', label: '% Desc.', minWidth: 100, align: 'center'},
	{ id: 'unidadVenta', label: 'U. Venta', minWidth: 100, align: 'center'},
	{ id: 'unitario', label: 'Precio U.', minWidth: 100, align: 'center'},
	{ id: 'importe', label: 'Importe', minWidth: 100, align: 'center'},
];

function createData(cantidad, descripcion, existencia, descuento, unidadVenta, unitario, importe ) {
	return { cantidad, descripcion, existencia, descuento, unidadVenta, unitario, importe };
}

const rows = [
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
	createData(2, 'Jabon', 50, 10, 10, 60, 120),
];

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '52vh'
	}
});

export default function TablaVentas() {
	const classes = useStyles();

	return (
		
			<Paper className={classes.root}>
				<TableContainer className={classes.container}>
					<Table stickyHeader size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
										{column.label}
									</TableCell>
								))}
								<TableCell key={1} align='center' style={{ width: 35 }}>
									Eliminar
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell key={column.id} align={column.align}>
													{column.format && typeof value === 'number' ? (
														column.format(value)
													) : (
														value
													)}
												</TableCell>
											);
										})}
										<TableCell key={1} align='center' >
											<IconButton aria-label="delete" size='small'>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
	);
}