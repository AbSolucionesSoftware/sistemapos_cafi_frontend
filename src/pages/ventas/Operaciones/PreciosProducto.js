import React from 'react';

import { Box, Button, DialogActions, DialogContent, Divider, Grid,   Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close';

import useStyles from '../styles';

const columns = [
	{ id: 'folio', label: 'Folio', minWidth: 20, align: 'center' },
    { id: 'numero', label: 'Numero', minWidth: 20, align: 'center' },
	{ id: 'precio', label: 'Precio', minWidth: 100, align: 'center'},
];

function createData(folio, numero, precio) {
	return { folio, numero, precio};
}

const rows = [
	createData(2, 1, 50),
	createData(2, 2, 50),
	createData(2, 3, 50),
	createData(2, 4, 50),
	createData(2, 5, 50),
	createData(2, 6, 50),
];

export default function PreciosProductos({handleClickOpen}) {
    
    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid container item lg={12}>
                    <Box 
                        display="flex" 
                        justifyContent="center" 
                    >
                        <Box mt={3}>
                            <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/money.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box>
                            <Box textAlign="right" mb={1}>
                                <Button variant="contained" color="secondary" onClick={handleClickOpen} size="medium">
                                    <CloseIcon />
                                </Button>
                            </Box>
                            <Box mt={2}>
                                <Typography variant="h6">
                                    Precios de Producto
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    </Grid>
                    <Grid>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                   Nombre:
                                </Typography>
                            </Box>
                            <Box width="100%">
                                <Typography>
                                   Jabon ZOTE
                                </Typography>
                            </Box>
                        </div>
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
            <DialogActions>
                <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                    Aceptar
                </Button>
            </DialogActions>
        </div>
    )
}