import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Snackbar, Typography } from "@material-ui/core";
import moment from "moment";

import { Close } from "@material-ui/icons";
import ErrorPage from "../../../components/ErrorPage";
import { useQuery } from "@apollo/client";
import { OBTENER_VENTAS_SUCURSAL } from "../../../gql/Ventas/ventas_generales";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../config/reuserFunctions";
import { Alert } from "@material-ui/lab";
import { useDebounce } from "use-debounce/lib";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
import InfoVentaFolio from "./InfoVenta";
import CancelarFolio from "./CancelarFolio";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "60vh",
  },
}));

export default function ListaVentasRealizadas({ handleClose }) {
  const [filtro, setFiltro] = useState("");

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [value] = useDebounce(filtro, 500);

  /* Queries */
  const resultado_ventas = useQuery(OBTENER_VENTAS_SUCURSAL, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtro: value,
    },
    fetchPolicy: "network-only",
  });

  return (
    <Fragment>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item sm={8} xs={12}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por: Folio, cliente, clave o nombre"
              variant="outlined"
              onChange={(e) => setFiltro(e.target.value)}
              value={filtro}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type="date"
              onChange={(e) => setFiltro(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box my={1}>
        <Alert severity="info">
          Para ver la información completa una venta haz un doble click!
        </Alert>
      </Box>
      <Box my={1} display="flex">
        <Box
          border={1}
          borderColor="#EAEAEA"
          bgcolor="#EDFFF3"
          height="24px"
          width="24px"
        />
        <Box mx={1} />
        <Typography>
          <b>- Ventas de hoy</b>
        </Typography>
      </Box>
      <RenderLista
        resultado_ventas={resultado_ventas}
        handleClose={handleClose}
      />
    </Fragment>
  );
}

const RenderLista = ({ resultado_ventas, handleClose }) => {
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setVentaRetomada,
  } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);
  const classes = useStyles();
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const { loading, data, error } = resultado_ventas;
  const [view, setView] = useState(false);

  const handleClickView = () => {
    setView(true);
  };

  const handleCloseView = () => {
    setView(false);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage />;
  }

  const { obtenerVentasSucursal } = data;

  const obtenerVenta = (click, data) => {
    setSelected(data);
    let temp = true;
    if (click === 2 && !temp) {
      let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
      if (datosVenta === null) {
        //armar array de productos
        let productos = [];

        data.productos.forEach((res) => {
          productos.push({
            cantidad: res.cantidad,
            cantidad_venta: res.cantidad_venta,
            codigo_barras: res.id_producto.datos_generales.codigo_barras,
            codigo_unidad: res.codigo_unidad,
            color: res.color,
            concepto: res.concepto,
            default: res.default,
            descuento: res.id_unidad_venta.descuento,
            descuento_activo: res.id_unidad_venta.descuento_activo,
            granel_producto: res.granel_producto,
            id_producto: res.id_producto,
            ieps_total_producto: res.ieps_total,
            impuestos_total_producto: res.impuestos,
            inventario_general: res.inventario_general,
            iva_total_producto: res.iva_total,
            medida: res.medida,
            precio: res.precio,
            precio_a_vender: res.precio_a_vender,
            precio_actual_object: res.precio_actual_object,
            precio_actual_producto: res.precio_actual_producto,
            precio_anterior: res.precio_actual_producto,
            precio_unidad: res.precio_unidad,
            subtotal_total_producto: res.subtotal,
            total_total_producto: res.total,
            unidad: res.unidad,
            unidad_principal: res.id_unidad_venta.unidad_principal,
            _id: res.id_unidad_venta._id,
          });
        });

        //armar objeto para Storage

        let datosVenta = {
          cliente: data.cliente,
          descuento: data.descuento,
          ieps: data.ieps,
          impuestos: data.impuestos,
          iva: data.iva,
          monedero: data.monedero,
          productos,
          subTotal: data.subTotal,
          total: data.total,
          venta_cliente: data.venta_cliente,
        };

        //se agregan la venta a localStorage
        localStorage.setItem("DatosVentas", JSON.stringify(datosVenta));
        setVentaRetomada(datosVenta);
        updateDataStorage();
        handleClose();
      } else {
        handleClickOpen();
      }
    } else if (click === 2 && temp) {
      handleClickView();
    }
  };

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const updateDataStorage = () => {
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
  };

  return (
    <Paper variant="outlined">
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClickOpen}
        message="No puedes agregar una venta cuando ya está una en curso."
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClickOpen}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Folio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Caja</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Impuestos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Cancelar Venta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerVentasSucursal.map((data, index) => {
              return (
                <RowComprasRealizadas
                  key={index}
                  data={data}
                  selected={selected}
                  obtenerVenta={obtenerVenta}
                />
              );
            })}
          </TableBody>
        </Table>
        <InfoVentaFolio
          venta={selected}
          open={view}
          handleClose={handleCloseView}
        />
      </TableContainer>
    </Paper>
  );
};

const tableStyles = makeStyles((theme) => ({
  today_color: {
    backgroundColor: "#EDFFF3",
    "&:hover": {
      backgroundColor: "#D8FFE5",
    },
  },
  normal_color: {
    backgroundColor: "#FFF",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
}));

const RowComprasRealizadas = ({ data, selected, obtenerVenta }) => {
  const classes = tableStyles();
  let today = data.fecha_registro === moment().format("YYYY-MM-DD");

  return (
    <TableRow
      role="checkbox"
      tabIndex={-1}
      selected={data.folio === selected.folio}
      onClick={(e) => obtenerVenta(e.detail, data)}
      className={today ? classes.today_color : classes.normal_color}
    >
      <TableCell>{data.folio}</TableCell>
      <TableCell>{moment(data.fecha_registro).format("DD/MM/YYYY")}</TableCell>
      <TableCell>
        {data.cliente !== null
          ? data.cliente.nombre_cliente
          : "Publico General"}
      </TableCell>
      <TableCell>{data.usuario.nombre}</TableCell>
      <TableCell>{data.id_caja.numero_caja}</TableCell>
      <TableCell>
        ${data.descuento ? formatoMexico(data.descuento) : 0}
      </TableCell>
      <TableCell>${formatoMexico(data.subTotal)}</TableCell>
      <TableCell>${formatoMexico(data.impuestos)}</TableCell>
      <TableCell>${formatoMexico(data.total)}</TableCell>
      <TableCell align="center">
        <CancelarFolio venta={data} />
      </TableCell>
    </TableRow>
  );
};
