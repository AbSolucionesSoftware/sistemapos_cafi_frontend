import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { useState } from "react";
import { Close } from "@material-ui/icons";
import { useContext } from "react";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarProductoFactura({ venta, producto, index }) {
  const [open, setOpen] = useState(false);
  const { setVentaFactura } = useContext(FacturacionCtx);
  const { datos_generales } = producto.id_producto;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    venta.productos.splice(index, 1);
    /* RECALCULAR */
    
    setVentaFactura(venta);
    handleClose();
  }

  return (
    <div>
      <IconButton size="small" onClick={handleClickOpen}>
        <Close />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
            if (reason !== "backdropClick") {
                handleClose();
            }
          }}
      >
        <DialogTitle>¿Está seguro de eliminar este producto?</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 100 }}>Producto</TableCell>
                  <TableCell style={{ width: 50 }}>Cantidad</TableCell>
                  <TableCell style={{ width: 100 }}>Subtotal</TableCell>
                  <TableCell style={{ width: 100 }}>Impuestos</TableCell>
                  <TableCell style={{ width: 100 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow tabIndex={-1}>
                  <TableCell>{datos_generales.nombre_comercial}</TableCell>
                  <TableCell>{producto.cantidad_venta}</TableCell>
                  <TableCell>
                    ${formatoMexico(producto.subtotal_total_producto)}
                  </TableCell>
                  <TableCell>
                    ${formatoMexico(producto.impuestos_total_producto)}
                  </TableCell>
                  <TableCell>
                    ${formatoMexico(producto.total_total_producto)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={() => handleClose()} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete()}
            color="secondary"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
