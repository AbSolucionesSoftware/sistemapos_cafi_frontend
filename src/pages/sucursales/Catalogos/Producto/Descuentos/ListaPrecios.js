import React, { useState} from 'react';
import { 
    Paper, 
    makeStyles, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
	TablePagination
} from '@material-ui/core/';


const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	}
}));

export default function TablaPreciosDescuentos({precios, setPrecioProducto}) {
    const classes = useStyles();
    const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));


    const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleClick = (e, row) => {
		setPrecioProducto(row.precio)
	}

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
								<TableCell  align='center' width='150' >Precio</TableCell>
								<TableCell  align='center' width='150' >Cantidad</TableCell>
								<TableCell  align='center' width='150'>Tipo</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{precios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row)}
										role="checkbox"
										tabIndex={-1}
										key={row._id}
									>
										<TableCell align="center">{row.precio}</TableCell>
										<TableCell align="center">{row.cantidad > 1 ? 'Cajas' : 'Pieza'}</TableCell>
										<TableCell align="center">{row.cantidad}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={precios.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
    )
}
