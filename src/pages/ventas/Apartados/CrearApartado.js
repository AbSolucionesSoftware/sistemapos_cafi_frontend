import React from 'react'
import useStyles from '../styles';
import tagIcon from '../../../icons/ventas/tag.svg'

import { Box, Button, DialogActions, Divider, Grid, IconButton,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@material-ui/core'
import { Search } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';


const columns = [
	{ id: 'folio', label: 'Folio', minWidth: 20, align: 'center' },
	{ id: 'producto', label: 'Producto', minWidth: 160, align: 'center'},
    { id: 'enganche', label: 'Enganche', minWidth: 160, align: 'center'},
    { id: 'total', label: 'Total', minWidth: 160, align: 'center'}
];

function createData(folio, producto, enganche, total) {
	return { folio, producto, enganche, total};
}

const rows = [
	createData(123, "Refrigerador", 2501, 5000 ),
    createData(123, "Refrigerador", 2501, 5000 ),
    createData(123, "Refrigerador", 2501, 5000 ),
    createData(123, "Refrigerador", 2501, 5000 ),
    createData(123, "Refrigerador", 2501, 5000 ),
    createData(123, "Refrigerador", 2501, 5000 ),
    createData(123, "Refrigerador", 2501, 5000 ),
];

export default function CrearApartado({handleClickOpen}) {
    
    const classes = useStyles();

    const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

    return (
        <div>
            <Grid container>
                <Grid item lg={8}>
                    <Box
                        p={2}
                        display="flex" 
                        textAlign="center" 
                    >
                        <Box>
                            <img src={tagIcon} alt="icono apartados" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={2}>
                            <Typography variant="h6">
                                Generar nuevo apartado
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={4}>
                    <Box textAlign="right" p={3}>
                        <Box textAlign="right">
                            <Typography variant="caption">
                                31/12/2021 - 08:00 hrs.
                            </Typography>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="caption">
                                Caja 3
                            </Typography>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="caption">
                                <b>Atiende:</b> Luis Flores
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Grid item lg={12}>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            Cliente:
                        </Typography>
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
                    <Box width="100%">
                        <Typography>
                            Anticipo o enganche:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>
                            Fecha Vencimiento:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                type='number'
                                size="small"
                                variant="outlined"
                            />
                        </Box>
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
            <div className={classes.formInputFlex}>
                <Box display="flex" justifyContent="flex-end" width="100%">
                    <Box textAlign="right" mr={2}>
                        <Typography>
                            <b>SUBTOTAL:</b> $185.00
                        </Typography>
                        <Typography>
                            <b>IMPUESTOS:</b> $185.00
                        </Typography>
                        <Typography>
                            <b>TOTAL:</b> $185.00
                        </Typography>
                    </Box>
                </Box>
            </div>

            <DialogActions>
                <Button onClick={handleClickOpen} color="secondary" variant="outlined">
                    Cancelar
                </Button>
                <Button onClick={handleClickOpen} color="primary" variant="outlined" autoFocus>
                    Generar Apartado
                </Button>
            </DialogActions>
        </div>
    )
}
