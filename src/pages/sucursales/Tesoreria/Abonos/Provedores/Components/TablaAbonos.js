import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import DetallesCuenta from './DetalleCuenta/DetallesCuenta';
import LiquidarCuenta from './LiquidarCuenta';

import { Dialog, Slide, TableHead } from '@material-ui/core';

const columns = [
	{ id: 'fecha', label: 'Fecha', minWidth: 100, align: 'center' },
	{ id: 'provedor', label: 'Provedor', minWidth: 100, align: 'center' },
	{ id: 'abonado', label: 'Abonado', minWidth: 100, align: 'center' },
    { id: 'restante', label: 'Restante', minWidth: 100, align: 'center' },
    { id: 'total', label: 'Total', minWidth: 100, align: 'center' }
];

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

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function TablaAbonos() {

	const classes = useStyles();
	const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    }

	const TwoClickInRowTableBuy = (e, producto) => {
		try {
			let timer;
			clearTimeout(timer);
			if (e.detail === 2) {
				handleClick();
			}
		} catch (error) {
		  	console.log(error);
		}
	  };
	
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
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
										{column.label}
									</TableCell>
								))}
								<TableCell align={'center'} style={{ minWidth: 100 }}>
									Liquidar
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{/* {rows.map((row, index) => {
								return ( */}
									<RowsCuentas 
										TwoClickInRowTableBuy={TwoClickInRowTableBuy}
									/>
								{/* );
							})} */}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			<Dialog
				fullScreen
				open={open} 
				onClose={handleClick} 
				TransitionComponent={Transition}
			>
				<DetallesCuenta 
					handleClick={handleClick}
				/>
			</Dialog>
		</div>
	);
};

function RowsCuentas ({
	TwoClickInRowTableBuy
}){
	
	return(
		<TableRow
			hover
			// key={index}
			tabIndex={-1}
			onClick={(e) => TwoClickInRowTableBuy(e, 'producto')}
		>
			<TableCell align="center">a</TableCell>
			<TableCell align="center">a</TableCell>
			<TableCell align="center">a</TableCell>
			<TableCell align="center">a</TableCell>
			<TableCell align="center">a</TableCell>
			<TableCell align="center">
				<LiquidarCuenta />
			</TableCell>
		</TableRow>
	);
};
