import React, { useContext, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import { Box, Chip, IconButton, Tooltip, Zoom } from '@material-ui/core';
import { Cached, Close, Edit } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';

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
	container: {
		maxHeight: '65vh'
	},
	tableRow: {
		'&.Mui-selected, &.Mui-selected:hover': {
			backgroundColor: fade(theme.palette.primary.main, 0.1)
		}
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
		border: '1px solid rgba(0,0,0, .3)',
		height: 30,
		width: 30,
		borderRadius: '15%'
	}
}));

const compareFunction = (a, b) => {
	if (a.color.nombre && b.color.nombre) {
		return a.color.nombre.localeCompare(b.color.nombre);
	}
};

export default function TablaPresentaciones({ datos, setOnUpdate, onUpdate }) {
	const classes = useStyles();
	const { presentaciones } = useContext(RegProductoContext);

	let mostrar_presentaciones = [ ...presentaciones ].sort((a, b) => compareFunction(a, b));

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer className={classes.container}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="small"
						aria-label="enhanced table"
						stickyHeader
					>
						<TableHead>
							<TableRow>
								<TableCell>Existencia</TableCell>
								<TableCell>Código de barras</TableCell>
								<TableCell width={200}>Nombre</TableCell>
								<TableCell padding="checkbox">Medida</TableCell>
								<TableCell padding="checkbox">Color</TableCell>
								<TableCell>Precio</TableCell>
								<TableCell padding="checkbox">Cantidad</TableCell>
								<TableCell padding="checkbox">Editar</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{mostrar_presentaciones.map((producto, index) => {
								return (
									<RenderPresentacionesRows
										key={index}
										producto={producto}
										index={index}
										datos={datos}
										setOnUpdate={setOnUpdate}
										onUpdate={onUpdate}
									/>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
}

const RenderPresentacionesRows = ({ producto, index, datos, setOnUpdate, onUpdate }) => {
	const { presentaciones, setPresentaciones, preciosP } = useContext(RegProductoContext);
	const [ disabledInput, setDisabledInput ] = useState(true);
	const classes = useStyles();
	const textfield = useRef(null);

	const handleEditCancel = () => {
		if (!producto.cantidad) {
			presentaciones[index].cantidad = 0;
			setPresentaciones([ ...presentaciones ]);
		}
		if (!producto.precio) {
			presentaciones[index].precio = preciosP[0].precio_neto;
			setPresentaciones([ ...presentaciones ]);
		}
		setDisabledInput(true);
	};

	const obtenerDatos = (event) => {
		if (event.target.name === 'cantidad') {
			if (!event.target.value) {
				presentaciones[index].cantidad = '';
				presentaciones[index].existencia = false;
				setPresentaciones([ ...presentaciones ]);
				return;
			}
			presentaciones[index].cantidad = parseFloat(event.target.value);
			presentaciones[index].existencia = true;
			setPresentaciones([ ...presentaciones ]);
		} else if (event.target.name === 'precio') {
			if (!event.target.value) {
				presentaciones[index].precio = '';
				setPresentaciones([ ...presentaciones ]);
				return;
			}
			presentaciones[index].precio = parseFloat(event.target.value);
		} else {
		}
		setPresentaciones([ ...presentaciones ]);
	};

	const GenCodigoBarras = () => {
		const max = 999999999999;
		const min = 100000000000;
		const codigo_barras = Math.floor(Math.random() * (max - min + 1) + min).toString();
		presentaciones[index].codigo_barras = codigo_barras;
		setPresentaciones([ ...presentaciones ]);
	};

	const actionButton = () => {
		if (!disabledInput) {
			handleEditCancel();
			/* quitar del array	 */
			onUpdate.splice(onUpdate.length -1, 1);
			setOnUpdate([...onUpdate]);
		} else {
			setDisabledInput(!disabledInput);
			/*  agregar al array */
			setOnUpdate([...onUpdate, index]);
		}
	};

	return (
		<TableRow hover selected={!disabledInput} className={classes.tableRow}>
			<TableCell align="center">
				<Checkbox checked={producto.existencia} color="primary" />
			</TableCell>
			<TableCell width={220}>
				<Box display="flex">
					<Input
						inputRef={textfield}
						onChange={(e) => obtenerDatos(e)}
						disabled={disabledInput}
						value={producto.codigo_barras}
						type="number"
						name="precio"
						disabled={datos.medidas_registradas && !producto.nuevo}
					/>
					{!datos.medidas_registradas && producto.nuevo ? (
						<IconButton color="primary" size="small" onClick={() => GenCodigoBarras()}>
							<Cached />
						</IconButton>
					) : null}
				</Box>
			</TableCell>
			<TableCell width={200}>{producto.nombre_comercial}</TableCell>
			<TableCell padding="checkbox">
				{producto.medida._id ? <Chip label={producto.medida.talla} color="primary" /> : ''}
			</TableCell>
			<TableCell padding="checkbox">
				{producto.color._id ? (
					<Tooltip title={producto.color.nombre} placement="top" arrow TransitionComponent={Zoom}>
						<div
							className={classes.colorContainer}
							style={{
								backgroundColor: producto.color.hex
							}}
						/>
					</Tooltip>
				) : null}
			</TableCell>
			<TableCell width={110}>
				<Input
					inputRef={textfield}
					onChange={(e) => obtenerDatos(e)}
					disabled={disabledInput}
					value={producto.precio}
					type="tel"
					name="precio"
				/>
			</TableCell>
			<TableCell padding="checkbox">
				<Input
					inputRef={textfield}
					onChange={(e) => obtenerDatos(e)}
					disabled={disabledInput}
					value={producto.cantidad}
					type="tel"
					name="cantidad"
				/>
			</TableCell>
			<TableCell padding="checkbox">
				<IconButton size="small" onClick={() => actionButton()}>
					{!disabledInput ? <Close /> : <Edit />}
				</IconButton>
			</TableCell>
		</TableRow>
	);
};
