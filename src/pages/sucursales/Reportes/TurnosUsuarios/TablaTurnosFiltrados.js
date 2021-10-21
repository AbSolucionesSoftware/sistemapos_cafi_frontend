import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Dialog, DialogContent, Typography} from '@material-ui/core';

const columns = [
	{ id: 'fecha', label: 'Fecha', minWidth: 100 },
	{ id: 'hora', label: 'Hora', minWidth: 100 },
	{ id: 'usuario', label: 'Usuario', minWidth: 100 },
	{ id: 'hTurno', label: 'Horario Turno', minWidth: 100 },	
	{ id: 'concepto', label: 'Concepto', minWidth: 100 },
	{ id: 'caja', label: 'Caja', minWidth: 100 },
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

export default function TablaTurnosFiltrados({turnos}) {
	const classes = useStyles();

	return (
        <Box p={2}>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align="center" style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
							{turnos.map((row) => {
								return (
									<RowsRender
										key={row._id}
										turno={row}
									/>
								);
							})}
						</TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
	);
}

function RowsRender({turno}) {
	const [open, setOpen] = useState(false);

	const handleClickOpen =()=> setOpen(!open);

	return(
		<>
			<TableRow
				hover
				role="checkbox"
				onClick={handleClickOpen}
				tabIndex={-1}
				key={turno._id}
			>
				<TableCell align="center">20/20/2021</TableCell>
				<TableCell align="center">15:10:00</TableCell>
				<TableCell align="center">Luis</TableCell>
				<TableCell align="center">{turno.horario_en_turno}</TableCell>
				<TableCell align="center">{turno.concepto}</TableCell>
				<TableCell align="center">{turno.numero_caja}</TableCell>
			</TableRow>

			<Dialog
				maxWidth='md'
				open={open} 
				onClose={handleClickOpen} 
			>
				<DialogContent>
					<Box textAlign="center" p={2}>
						<Typography variant="h6">
							Hola mundo de los turnos
						</Typography>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	)
};