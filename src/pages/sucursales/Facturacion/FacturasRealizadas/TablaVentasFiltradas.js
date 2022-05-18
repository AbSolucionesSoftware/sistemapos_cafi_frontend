import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box } from "@material-ui/core";
import { formatoMexico } from "../../../../config/reuserFunctions";
import moment from "moment";
import DetallesFacturaModal from "./DetallesFacturaModal";
import { OBTENER_DOCUMENTO_FACTURA } from "../../../../gql/Facturacion/Facturacion";
import { useApolloClient } from "@apollo/client";
import Snackbar from "@material-ui/core/Snackbar";

const columns = [
  { label: "Serie", padding: "checkbox" },
  { label: "Folio", padding: "checkbox" },
  { label: "Folio venta", minWidth: 90 },
  { label: "Fecha", minWidth: 90 },
  { label: "Tipo CDFI", minWidth: 110 },
  { label: "F. de pago", minWidth: 90 },
  { label: "M. de pago", minWidth: 110 },
  { label: "Cliente", minWidth: 100 },
  { label: "Descuento", minWidth: 90 },
  { label: "Subtotal", minWidth: 90 },
  { label: "Total", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    height: "72vh",
  },
}));

export default function TablaVentasFiltradas({ data }) {
  const classes = useStyles();
  const [factura, setFactura] = useState();
  const [facturaBase64, setFacturaBase64] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleSelectFactura = (e, factura) => {
    if (e.detail === 2) {
      setFactura(factura);
      setOpen(true);
      getDocumentCfdi(factura.id_cfdi);
    }
  };

  //consultar documento cfdi
  const client = useApolloClient();

  const getDocumentCfdi = async (id) => {
    try {
      setLoading(true);
      const response = await client.query({
        query: OBTENER_DOCUMENTO_FACTURA,
        variables: {
          id
        },
        fetchPolicy: "network-only",
      });
      setLoading(false);
      setFacturaBase64(response.data.obtenerDocumentCfdi);
    } catch (error) {
      setLoading(false);
      setAlert(true);
    }
  };

  return (
    <Box my={2}>
      <DetallesFacturaModal
        factura={factura}
        facturaBase64={facturaBase64}
        open={open}
        setOpen={setOpen}
        loading={loading}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={() => setAlert(false)}
        message="Hubo un error al cargar los productos"
        autoHideDuration={3000}
      />
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    /* align={column.align} */
                    padding={column.padding}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data, index) => {
                return (
                  <TableRow
                    hover
                    key={index}
                    role="checkbox"
                    tabIndex={-1}
                    onClick={(e) => handleSelectFactura(e, data)}
                  >
                    <TableCell>{data.serie}</TableCell>
                    <TableCell>{data.folio}</TableCell>
                    <TableCell>{data.folio_venta}</TableCell>
                    <TableCell>
                      {moment(data.fecha_registro).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{data.cfdi_type}</TableCell>
                    <TableCell>{data.payment_method}</TableCell>
                    <TableCell>{data.payment_form}</TableCell>
                    <TableCell>{data.receiver.Name}</TableCell>
                    <TableCell>${formatoMexico(data.discount)}</TableCell>
                    <TableCell>${formatoMexico(data.sub_total)}</TableCell>
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
