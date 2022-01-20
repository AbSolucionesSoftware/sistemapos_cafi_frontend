import React, { Fragment, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {formatoMexico} from '../../../../../../config/reuserFunctions'
import DetallesCuenta from './DetalleCuenta/DetallesCuenta';
import LiquidarCuenta from './LiquidarCuenta';
import moment from 'moment';

import { Box, CircularProgress, Dialog, Slide, TableHead } from '@material-ui/core';
import 'moment/locale/es';
import { TesoreriaCtx } from '../../../../../../context/Tesoreria/tesoreriaCtx';

const columns = [
	{ id: 'fecha', label: 'Fecha Compra', minWidth: 100, align: 'center' },
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

export default function TablaAbonos({loading}) {

	const { cuentas} = useContext(TesoreriaCtx);

	const classes = useStyles();

	if (loading) 
		return (
			<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			height="50vh"
			>
				<CircularProgress />
			</Box>
		);

	return (
		<Fragment>
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
							{cuentas?.map((row, index) => {
								if(row.credito_pagado === false){
									return (
										<RowsCuentas 
											loading={loading}
											cuentaSelect={row}
											key={index}
										/>
									);
								};
							})} 
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
		</Fragment>
	);
};

function RowsCuentas ({cuentaSelect, loading}){

	const [open, setOpen] = useState(false);
    
	const handleClick = () => {
        setOpen(!open);
    };
	
	const TwoClickInRowTableBuy = (e) => {
		try {
			let timer;
			clearTimeout(timer);
			if (e.detail === 2) {
				handleClick();
			}
		} catch (error) {
		}
	};

	return(
		<Fragment>
			<TableRow
				hover
				tabIndex={-1}
				onClick={(e) => TwoClickInRowTableBuy(e)}
			>
				<TableCell align="center">{moment(cuentaSelect.fecha_registro).format('D MMMM YYYY')}</TableCell>
				<TableCell align="center">{cuentaSelect.proveedor.id_proveedor.nombre_cliente}</TableCell>
				<TableCell align="center">${formatoMexico(cuentaSelect.total - cuentaSelect.saldo_credito_pendiente)}</TableCell>
				<TableCell align="center">${formatoMexico(cuentaSelect.saldo_credito_pendiente)}</TableCell>
				<TableCell align="center">${formatoMexico(cuentaSelect.total)}</TableCell>
				<TableCell align="center">
					<LiquidarCuenta cuenta={cuentaSelect}/>
				</TableCell>
			</TableRow>

			<Dialog
				fullScreen
				open={open} 
				onClose={handleClick} 
				TransitionComponent={Transition}
			>
				<DetallesCuenta
					cuenta={cuentaSelect}
					loading={loading}
					handleClick={handleClick}
				/>
			</Dialog>
		</Fragment>
	);
};
