import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, TablePagination, Typography } from '@material-ui/core';

const columns = [
	{ id: 'cantidad', label: 'cantidad', minWidth: 200, align: 'center' },
	{ id: 'descripcion', label: 'descripcion', minWidth: 200 },
	{ id: 'precio', label: 'precio.', minWidth: 200, align: 'center'},
	{ id: 'total', label: 'Total', minWidth: 200, align: 'center'},
];

function createData(cantidad, descripcion, precio, total) {
	return { cantidad, descripcion, precio, total};
}

const rows = [
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
];

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '50vh'
	}
});

export default function DetallesFactura() {
	const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(4);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper className={classes.root}>
            <Box textAlign="center">
                <Typography variant="h6">
                    Detalles de Venta
                </Typography>
            </Box>
			<TableContainer className={classes.container}>
				<Table stickyHeader size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
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
											<TableCell key={column.id} align={column.align}>
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
		</Paper>
	);
}