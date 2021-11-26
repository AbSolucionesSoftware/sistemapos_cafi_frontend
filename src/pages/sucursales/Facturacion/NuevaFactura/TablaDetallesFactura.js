import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Typography } from '@material-ui/core';

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
];

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		height: '35vh'
	}
});

export default function DetallesFactura() {
	const classes = useStyles();

	return (
		<Paper className={classes.root} variant="outlined">
            <Box textAlign="center">
                <Typography variant="h6">
                    Concepto
                </Typography>
            </Box>
			<TableContainer className={classes.container}>
				<Table stickyHeader size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={index} align={column.align} style={{ width: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={index}>
									{columns.map((column, indx) => {
										const value = row[column.id];
										return (
											<TableCell key={indx} align={column.align}>
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
		</Paper>
	);
}