import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {IconButton, TablePagination } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const columns = [
	{ id: 'numeroSerie', label: 'Numero de Serie', minWidth: 220, align: 'center' },
	{ id: 'serie', label: 'Serie', minWidth: 220 },
	{ id: 'fechaInicial', label: 'Fecha Inicial', minWidth: 220, align: 'center'},
];

function createData(numeroSerie, serie, fechaInicial, fechaVen) {
	return { numeroSerie, serie, fechaInicial, fechaVen};
}

const rows = [
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

export default function ListaSellosCDFI() {
	const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(8);

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
								<TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
							<TableCell align='center' style={{ width: 35 }}>
								Eliminar
							</TableCell>
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
									<TableCell align='center' >
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