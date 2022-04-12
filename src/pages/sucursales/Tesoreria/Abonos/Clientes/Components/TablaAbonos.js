import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import DetallesCuenta from './DetalleCuenta/DetallesCuenta';
import LiquidarCuenta from './LiquidarCuenta';

function createData(folio, fecha, cantidadProductos, totalVenta, totalAbonado, faltaPagar) {
	return { folio, fecha, cantidadProductos, totalVenta, totalAbonado, faltaPagar };
}

const rows = [
	createData('2343243', 45555, 5, 2589.65, 1000, 1589.65),
	
];

const headCells = [
	{ id: 'folio', numeric: false, disablePadding: true, label: 'Folio' },
	{ id: 'fecha', numeric: true, disablePadding: false, label: 'Fecha' },
	{ id: 'cantidadProductos', numeric: true, disablePadding: false, label: 'Cantidad de productos' },
	{ id: 'totalVenta', numeric: true, disablePadding: false, label: 'Total venta' },
	{ id: 'totalAbonado', numeric: true, disablePadding: false, label: 'Pagado' },
	{ id: 'faltaPagar', numeric: true, disablePadding: false, label: 'Falta por pagar' },
	
];

function EnhancedTableHead(props) {
	const { onSelectAllClick, numSelected, rowCount } = props;

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ 'aria-label': 'select all desserts' }}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	// onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	// order: PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
	// orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1
	}
}));

export default function TablaAbonos() {
	const classes = useStyles();
	const [ selected, setSelected ] = useState([]);
	const [ page ] = useState(0);
	const [ rowsPerPage ] = useState(10);

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

/* 	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	}; */

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						stickyHeader
						size="small" 
						aria-label="a dense table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							onSelectAllClick={handleSelectAllClick}
							rowCount={rows.length}
						/>
						<TableBody>
							{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								const isItemSelected = isSelected(row.name);
								const labelId = `enhanced-table-checkbox-${index}`;
								return (
									<TableRow
										hover
										key={index}
										onClick={(event) => handleClick(event, row.name)}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										selected={isItemSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isItemSelected}
												inputProps={{ 'aria-labelledby': labelId }}
											/>
										</TableCell>
										<TableCell component="th" id={labelId} scope="row" padding="none">
											{row.folio}
										</TableCell>
										<TableCell align="right">{row.fecha}</TableCell>
										<TableCell align="right">{row.cantidadProductos}</TableCell>
										<TableCell align="right">{row.totalVenta}</TableCell>
										<TableCell align="right">
											{/* <DetallesCuenta /> */}
											{row.totalAbonado}
										</TableCell>
										<TableCell align="right">
											{row.faltaPagar}
										</TableCell>
									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				{/* <TablePagination
                    rowsPerPageOptions={[]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/> */}
			</Paper>
		</div>
	);
}
