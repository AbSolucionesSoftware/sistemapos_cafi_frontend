import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import { Edit } from "@material-ui/icons";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { Box, Checkbox, Divider, FormControl, MenuItem, Select, Typography } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModificarProductoFactura({ venta, producto, index }) {
  const [open, setOpen] = useState(false);
  const { datos_generales } = producto.id_producto;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton size="small" onClick={handleClickOpen}>
        <Edit />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{datos_generales.nombre_comercial}</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Box>
              <Typography>
                <b>Impuestos</b>
              </Typography>
            </Box>
            <Divider />
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">Activo</TableCell>
                    <TableCell style={{ width: 50 }}>Base</TableCell>
                    <TableCell style={{ width: 50 }}>Impuesto</TableCell>
                    <TableCell style={{ width: 100 }}>Tasa o Cuota</TableCell>
                    <TableCell style={{ width: 100 }}>
                      Valor Tasa o Cuota
                    </TableCell>
                    <TableCell style={{ width: 100 }}>Importe</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow tabIndex={-1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        /* checked={precios.iva_activo} */
                        /* onChange={obtenerIva} */
                        name="iva_activo"
                      />
                    </TableCell>
                    <TableCell style={{ width: 50 }}>IVA</TableCell>
                    <TableCell style={{ width: 50 }}>IEPS</TableCell>
                    <TableCell style={{ width: 100 }}>
                      <FormControl
                      fullWidth
                        size="small"
                      >
                        <Select
                          /* value={age} */
                          /* onChange={handleChange} */
                        >
                          <MenuItem value="Tasa">Tasa</MenuItem>
                          <MenuItem value="Cuota">Cuota</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell style={{ width: 100 }}>
                      Valor Tasa o Cuota
                    </TableCell>
                    <TableCell style={{ width: 100 }}>Importe</TableCell>
                  </TableRow>
                  <TableRow tabIndex={-1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        /* checked={precios.iva_activo} */
                        /* onChange={obtenerIva} */
                        name="iva_activo"
                      />
                    </TableCell>
                    <TableCell style={{ width: 50 }}>Base</TableCell>
                    <TableCell style={{ width: 50 }}>Impuesto</TableCell>
                    <TableCell style={{ width: 100 }}>Tasa o Cuota</TableCell>
                    <TableCell style={{ width: 100 }}>
                      Valor Tasa o Cuota
                    </TableCell>
                    <TableCell style={{ width: 100 }}>Importe</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <Typography>
              <b>Venta</b>
            </Typography>
          </Box>
          <Divider />
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 50 }}>IVA</TableCell>
                  <TableCell style={{ width: 50 }}>IEPS</TableCell>
                  <TableCell style={{ width: 100 }}>Subtotal</TableCell>
                  <TableCell style={{ width: 100 }}>Impuestos</TableCell>
                  <TableCell style={{ width: 100 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow tabIndex={-1}>
                  <TableCell>% IVA</TableCell>
                  <TableCell>% IEPS</TableCell>
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
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleClose} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
