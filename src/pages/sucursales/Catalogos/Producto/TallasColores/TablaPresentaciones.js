import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import { Chip, Tooltip, Zoom } from '@material-ui/core';

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
	},
	colorContainer: {
		height: 30,
		width: 30,
		borderRadius: '15%'
	}
}));

export default function TablaPresentaciones() {
	const classes = useStyles();
	const { presentaciones } = useContext(RegProductoContext);
	const [ page, setPage ] = useState(0);
	const rowsPerPage = 10;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	useEffect(
		() => {
			if (presentaciones.length <= rowsPerPage) setPage(0);
		},
		[ presentaciones.length ]
	);

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, presentaciones.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="medium"
						aria-label="enhanced table"
					>
						<TableHead>
							<TableRow>
								<TableCell>Existencia</TableCell>
								<TableCell>Código de barras</TableCell>
								<TableCell>Nombre</TableCell>
								<TableCell>Medida</TableCell>
								<TableCell>Color</TableCell>
								<TableCell>Precio</TableCell>
								<TableCell>Cantidad</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{presentaciones
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((producto, index) => {
									return <RenderPresentacionesRows key={index} producto={producto} index={index} />;
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={presentaciones.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
				/>
			</Paper>
		</div>
	);
}

const RenderPresentacionesRows = ({ producto, index }) => {
	const { presentaciones, setPresentaciones } = useContext(RegProductoContext);
	const [ disabledInput, setDisabledInput ] = useState(true);
	const [ cantidad, setCantidad ] = useState(0);
	const classes = useStyles();
	const textfield = useRef(null);

	const handleClick = (value) => {
		presentaciones[index].existencia = value;
		setPresentaciones([...presentaciones])
	};

	const handleOnBlurInput = () => {
		if (!producto.cantidad) {
			presentaciones[index].cantidad = 0;
			setPresentaciones([...presentaciones])
		}
		setDisabledInput(true);
	};

	const obtenerCantidad = (value) => {
		if (!value) {
			presentaciones[index].cantidad = '';
			setPresentaciones([...presentaciones])
			return;
		}
		/* setCantidad(parseFloat(value)); */
		presentaciones[index].cantidad = parseFloat(value);
		setPresentaciones([...presentaciones])
	};

	const handleDoubleClick = () => {
		setDisabledInput(!disabledInput);
		setTimeout(() => {
			textfield.current.focus();
		}, 100);
		
	}

	return (
		<TableRow hover role="checkbox" /* aria-checked={isItemSelected} */ /* tabIndex={-1} */ /* selected={isItemSelected} */>
			<TableCell padding="checkbox" >
				<Checkbox checked={producto.existencia} onChange={() => handleClick(!producto.existencia)} />
			</TableCell>
			<TableCell scope="row">
				{producto.codigo_barras}
			</TableCell>
			<TableCell>{producto.nombre_comercial}</TableCell>
			<TableCell>
				{producto.medida ? (<Chip label={producto.medida} color="primary" />) : ''}
			</TableCell>
			<TableCell>
				<Tooltip title={producto.color.nombre} placement="top" arrow TransitionComponent={Zoom}>
					<div
						className={classes.colorContainer}
						style={{
							backgroundColor: producto.color.hex
						}}
					/>
				</Tooltip>
			</TableCell>
			<TableCell>{producto.precio}</TableCell>
			<TableCell>
				<Input
					inputRef={textfield}
					onDoubleClick={() => producto.existencia ? handleDoubleClick() : null}
					onChange={(e) => obtenerCantidad(e.target.value)}
					onBlur={handleOnBlurInput}
					disabled={disabledInput}
					value={producto.cantidad}
					type="text"
				/>
			</TableCell>
		</TableRow>
	);
};
