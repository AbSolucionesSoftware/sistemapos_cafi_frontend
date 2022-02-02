import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Slide from '@material-ui/core/Slide';
import { DialogContentText } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductosSinClaveSat({productos, open, handleClose}) {

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>{"Productos sin CLAVE del catalogo SAT"}</DialogTitle>
        <DialogContent>
        <DialogContentText>
            Hay productos sin clave de catalogo de productos del sat, sin esta clave no puede realizar facturas
        </DialogContentText>
        <Paper variant="outlined">
        <TableContainer style={{maxHeight: '40vh'}}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Código de barras</TableCell>
                <TableCell>Clave alterna</TableCell>
                <TableCell>Producto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((row, index) => {
                const { datos_generales } = row.producto
                return (
                  <TableRow
                    key={index}
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell>
                      <Typography>{datos_generales.codigo_barras}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{datos_generales.clave_alterna}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{datos_generales.nombre_comercial}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant='contained'>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
