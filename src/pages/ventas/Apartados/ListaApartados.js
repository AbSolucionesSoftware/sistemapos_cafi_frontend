import React from 'react';

import { Box, Button, DialogActions, DialogContent, Divider, Grid,   IconButton, 
        Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
        TablePagination, TableRow, Typography 
    } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';

import tagIcon from '../../../icons/ventas/tag.svg'

import useStyles from '../styles';

const columns = [
	{ id: 'folio', label: 'Folio', minWidth: 20, align: 'center' },
    { id: 'nombre', label: 'Nombre', minWidth: 160, align: 'center' },
	{ id: 'producto', label: 'Producto', minWidth: 160, align: 'center'},
    { id: 'fechaInicio', label: 'Fecha Inicio', minWidth: 160, align: 'center'},
    { id: 'fechaVencimiento', label: 'Fecha Limite', minWidth: 160, align: 'center'},
    { id: 'enganche', label: 'Enganche', minWidth: 160, align: 'center'},
    { id: 'total', label: 'Total', minWidth: 160, align: 'center'}
];

function createData(folio, nombre, producto, fechaInicio, fechaVencimiento, enganche, total) {
	return { folio, nombre, producto, fechaInicio, fechaVencimiento, enganche, total};
}

const rows = [
	createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
];

export default function ListaApartados({handleClickOpen}) {
    
    const classes = useStyles();

    const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(8);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

    return (
        <div>
            <DialogContent>
                <Grid container item lg={12}>
                    <Box 
                        display="flex" 
                        textAlign="center" 
                        justifyContent="center" 
                        alignContent="center" 
                        alignSelf="center"
                        justifySelf="center"
                    >
                        <Box>
                            <img src={tagIcon} alt="icono apartados" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h6">
                                Productos Apartados
                            </Typography>
                        </Box>
                    </Box>
                    </Grid>
                    <Grid>

                        <Box display="flex" justifyContent="flex-end">
                            <Box>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    size="large"
                                >
                                    Continuar Compra
                                </Button>
                            </Box>
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
                                            <TableCell align='center' style={{ width: 35 }}>
                                                Eliminar
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                                                    <TableCell align='center' >
                                                        <IconButton aria-label="delete" size='small'>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[ 10, 25, 100 ]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} variant="outlined" color="secondary">
                    Cancelar
                </Button>
            </DialogActions>
        </div>
    )
}
