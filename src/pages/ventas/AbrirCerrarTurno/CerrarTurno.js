import React from 'react'
import useStyles from '../styles';

import { Box,  DialogContent,  FormControl, Grid, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TextField, Typography } from '@material-ui/core'
import { TableRow } from '@material-ui/core';

const columns = [
	{ id: 'concepto', label: 'Concepto', minWidth: 20, align: 'center' },
    { id: 'total', label: 'Monto Total', minWidth: 20, align: 'center' },
];

function createData(concepto, total) {
	return { concepto, total};
}

const rows = [
	createData("Efectivo", 500),
	createData("Tarjeta Debito", 500),
    createData("Tarjeta Credito", 500),
    createData("Creditos", 500),
    createData("Puntos", 500),
    createData("Tranferencia", 500),
    createData("Cheques", 500),
    createData("Vales Despensa", 500),
];

export default function AbrirTurno(handleClickOpen) {

    const classes = useStyles();

    return (
        <DialogContent style={{padding: 0}}>
            <TableContainer style={{padding: 0}}>
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
                        {rows.map((row) => {
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
            <Grid container >
                <Grid item lg={6}>
                    <Box mt={1} textAlign="center">
                        <Typography >
                            <b>Monto total efectivo:</b>
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography>
                            <b>Monto en otro tipos:</b>
                        </Typography>
                    </Box>
                </Grid>
                <Grid item lg={6} justify='flex-end'>
                    <Box mt={1} textAlign="center" >
                        <Typography>
                            $2,000
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography>
                            $5,000
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>
                        Turno:
                    </Typography>
                    <FormControl
                        variant="outlined"
                        fullWidth
                        size="small"
                    >
                        <Select
                            id="form-producto-tipo"
                            name="tipo_producto"
                        >
                            <MenuItem value="">
                                <em>Selecciona uno</em>
                            </MenuItem>
                            <MenuItem value="Vespertino">Vespertino</MenuItem>
                            <MenuItem value="Matutino">Matutino</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box width="100%">
                    <Typography>Monto Entregado:</Typography>
                    <Box display="flex">
                        <TextField
                            fullWidth
                            multiline
                            rows={1}
                            size="small"
                            name="codigo_barras"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Comentarios:</Typography>
                    <Box display="flex">
                        <TextField
                            fullWidth
                            multiline
                            rows={1}
                            size="small"
                            name="codigo_barras"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </div>
        </DialogContent>
    )
}