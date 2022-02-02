import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, Typography } from "@material-ui/core";

import { Close, Search } from "@material-ui/icons";
import ErrorPage from "../../../../../components/ErrorPage";
import { useQuery } from "@apollo/client";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";
import ProductosSinClaveSat from "./ProductosSinClave";
import { OBTENER_VENTAS_SUCURSAL } from "../../../../../gql/Ventas/ventas_generales";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { Alert } from "@material-ui/lab";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: "50vh",
  },
}));

export default function ListaVentasFactura() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={() => handleOpen()} size="small">
        <Search />
      </IconButton>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box style={{ display: "flex" }}>
            <Typography variant="h6">Selecionar venta</Typography>
            <Box flexGrow={1} />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleClose()}
            >
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <RenderLista handleClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              /* setDatosFactura({ ...datosFactura, cliente: "" }); */
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const RenderLista = ({ handleClose }) => {
  const classes = useStyles();
  const [filtro, setFiltro] = useState("");
  const [values, setValues] = useState("");
  const [selected, setSelected] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const {
    datosFactura,
    setDatosFactura,
    setVentaFactura,
    setProductos,
  } = useContext(FacturacionCtx);

  const [open_productos, setOpenProductos] = useState(false);
  const [productos_sin_clave, setProductosSinClave] = useState([]);

  const openProductosClaves = () => setOpenProductos(true);
  const closeProductosClaves = () => setOpenProductos(false);

  /* Queries */
  const { loading, data, error } = useQuery(OBTENER_VENTAS_SUCURSAL, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
  });

  const pressEnter = (e) => {
    if (e.key === "Enter") setFiltro(e.target.value);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="55vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage />;
  }

  const { obtenerVentasSucursal } = data;

  const obtenerVenta = (click, data) => {
    setSelected(data.folio);
    if (click === 2) {
      console.log(data);
      const without_sat_code = data.productos.filter(
        (res) => !res.producto.datos_generales.clave_producto_sat.Value
      );

      if (without_sat_code.length > 0) {
        setProductosSinClave(without_sat_code);
        openProductosClaves();
        return;
      }

      setVentaFactura(data);
      setProductos(data.productos);
      handleClose();
    }
  };

  return (
    <Fragment>
      <ProductosSinClaveSat
        productos={productos_sin_clave}
        open={open_productos}
        handleClose={closeProductosClaves}
      />
      <Box mb={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por: Folio, cliente, clave o nombre"
          variant="outlined"
          onChange={(e) => setValues(e.target.value)}
          onKeyPress={pressEnter}
          value={values}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setFiltro(values)}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box my={1}>
        <Alert severity="info">
          Para seleccionar una venta haz un doble click!
        </Alert>
      </Box>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Folio</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Total de articulos</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Impuestos</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {obtenerVentasSucursal.map((data, index) => {
                return (
                  <TableRow
                    key={index}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    selected={data.folio === selected}
                    onClick={(e) => obtenerVenta(e.detail, data)}
                  >
                    <TableCell>{data.folio}</TableCell>
                    <TableCell>
                      {data.cliente !== null
                        ? data.cliente.nombre_cliente
                        : "-"}
                    </TableCell>
                    <TableCell>{data.productos.length}</TableCell>
                    <TableCell>
                      ${data.descuento ? formatoMexico(data.descuento) : 0}
                    </TableCell>
                    <TableCell>${formatoMexico(data.subTotal)}</TableCell>
                    <TableCell>${formatoMexico(data.impuestos)}</TableCell>
                    <TableCell>${formatoMexico(data.total)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
};
