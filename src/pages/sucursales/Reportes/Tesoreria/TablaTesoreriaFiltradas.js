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
import { Box} from '@material-ui/core';

const columns = [
	{ id: 'name', label: 'F. Movimiento', minWidth: 100 },
	{ id: 'code', label: 'Usuario', minWidth: 100 },
	{ id: 'code', label: 'Concepto', minWidth: 100 },	
	{ id: 'code', label: 'Total', minWidth: 100 },
	{ id: 'code', label: 'Caja', minWidth: 100 },
	{ id: 'code', label: 'Sucursal', minWidth: 100 },	

];

const useStyles  = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '100%'
	},
    appBar: {	
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	rootBusqueda: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
}));

export default function TablaTesoreriaFiltradas() {
	const classes = useStyles();

	return (
        <Box p={2}>
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
                            
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
	);
}