import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box } from "@material-ui/core";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { formaPago } from "../../Facturacion/catalogos";

const columns = [
  { label: "Artículo", minWidth: 160 },
  { label: "Fecha venta", minWidth: 170 },
  { label: "M. pago", minWidth: 90 },
  { label: "F. pago", minWidth: 100 },
  { label: "Cantidad", minWidth: 90 },
  { label: "Descuento", minWidth: 100 },
  { label: "Subtotal", minWidth: 90 },
  { label: "Impuestos", minWidth: 90 },
  { label: "Total", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: "70vh",
  },
}));

export default function TablaVentasFiltradas({ data }) {
  const classes = useStyles();
  return (
    <Box my={2}>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    /* align={column.align} */
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data, index) => {
                let forma_pago = "-";
                if (data.forma_pago) {
                  const result = formaPago.filter(
                    (res) => res.Value === data.forma_pago
                  );
                  forma_pago = result[0];
                }

                return (
                  <TableRow key={index} role="checkbox" tabIndex={-1}>
                    <TableCell>
                      {data.producto.datos_generales.nombre_comercial}
                    </TableCell>
                    <TableCell>
                      {formatoFechaCorta(data.fecha_registro)}
                    </TableCell>
                    <TableCell>
                      {data.venta_credito ? "Crédito" : "Contado"}
                    </TableCell>
                    <TableCell>{`${forma_pago.Name}`}</TableCell>
                    <TableCell>{`${data.cantidad} - ${data.unidad}`}</TableCell>
                    <TableCell>
                      {`%${
                        data.descuento_porcentaje
                          ? data.descuento_porcentaje
                          : 0
                      } - $${
                        data.descuento_precio
                          ? formatoMexico(data.descuento_precio)
                          : 0
                      }`}
                    </TableCell>
                    <TableCell>${formatoMexico(data.subtotal)}</TableCell>
                    <TableCell>${formatoMexico(data.impuestos)}</TableCell>
                    <TableCell>${formatoMexico(data.total)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
