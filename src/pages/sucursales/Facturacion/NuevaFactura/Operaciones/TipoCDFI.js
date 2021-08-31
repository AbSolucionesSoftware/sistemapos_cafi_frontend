import React from 'react';
import { Box, DialogContent, Grid, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';

import factura from '../../../../../icons/Facturacion/facturaNueva.svg';
import { Search } from '@material-ui/icons';

const columns = [
	{ id: 'clave', label: 'Clave', minWidth: 30, align: 'center' },
	{ id: 'descripcion', label: 'Descripcion', minWidth: 180 },
	{ id: 'fisica', label: 'Fisica', minWidth: 30, align: 'center'},
	{ id: 'moral', label: 'Moral', minWidth: 30, align: 'center'},
];

function createData(clave, descripcion, fisica, moral) {
	return { clave, descripcion, fisica, moral};
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
	createData(2, 'Jabon', 50, 10),
	createData(2, 'Jabon', 50, 10),
];

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`
		}
	},
    root: {
		width: '100%'
	},
	container: {
		maxHeight: '40vh'
	}
}));

export default function TipoCDFI({handleClickOpen}) {

    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid item lg={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        <img src={factura} alt="icono Factura" style={{width: 70}} />
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="h6">
                            Tipo de uso CDFI, SAT
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                    />
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                </Box>
                            </Box>
                        </div>
                    </Box>
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
                    </Paper>
                </Grid>
            </DialogContent>
        </div>
    )
}
