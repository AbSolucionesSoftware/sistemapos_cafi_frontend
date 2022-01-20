import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import TablaComprasFiltradas from "./TablaComprasFiltradas";
import { formaPago } from "../../Facturacion/catalogos";
import { useDebounce } from "use-debounce/lib";
import { OBTENER_REPORTE_COMPRAS } from "../../../../gql/Compras/reporte_compras";
import { useQuery } from "@apollo/client";
import ErrorPage from "../../../../components/ErrorPage";
import { ClearOutlined } from "@material-ui/icons";
import ExportarCompras from "./ExportarCompras";

export default function FiltrosCompras() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const { loading, data, error, refetch } = useQuery(OBTENER_REPORTE_COMPRAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: {
        fecha_inicio: "",
        fecha_fin: "",
        proveedor: "",
        metodo_pago: "",
        forma_pago: "",
        producto: "",
      },
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }

  if (error) return <ErrorPage error={error} />;

  const { obtenerProductoMovimientos } = data;

  return (
    <Fragment>
      <DialogContent>
        <CapturaDeDatos refetch={refetch} data={obtenerProductoMovimientos} />
        <TablaComprasFiltradas data={obtenerProductoMovimientos} />
      </DialogContent>
    </Fragment>
  );
}

const CapturaDeDatos = ({ refetch, data }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [filtro, setFiltro] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    proveedor: "",
    metodo_pago: "",
    forma_pago: "",
    producto: "",
  });

  const [values] = useDebounce(filtro, 800);

  const limpiarFiltros = () => {
    setFiltro({
      fecha_inicio: "",
      fecha_fin: "",
      proveedor: "",
      metodo_pago: "",
      forma_pago: "",
      producto: "",
    });
  };

  const obtenerCamposFiltro = (e) => {
    const { name, value } = e.target;
    setFiltro({
      ...filtro,
      [name]: value,
    });
  };

  useEffect(() => {
    realizarBusquedaBD(values);
  }, [values]);

  const realizarBusquedaBD = (filter) => {
    refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: filter,
    });
  };
  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item md={2}>
          <Typography>Fecha compra inicio:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha_inicio"
            variant="outlined"
            type="date"
            onChange={obtenerCamposFiltro}
            value={filtro.fecha_inicio}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Fecha compra fin:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha_fin"
            variant="outlined"
            type="date"
            onChange={obtenerCamposFiltro}
            value={filtro.fecha_fin}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Proveedor:</Typography>
          <TextField
            fullWidth
            size="small"
            name="proveedor"
            variant="outlined"
            placeholder="Nombre, Clave o numero"
            onChange={obtenerCamposFiltro}
            value={filtro.proveedor}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Método de pago:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              name="metodo_pago"
              onChange={obtenerCamposFiltro}
              value={filtro.metodo_pago}
            >
              <MenuItem value="">
                <em>Cualquier metodo</em>
              </MenuItem>
              <MenuItem value="CREDITO">Crédito</MenuItem>
              <MenuItem value="CONTADO">Contado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Forma de Pago:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              name="forma_pago"
              onChange={obtenerCamposFiltro}
              value={filtro.forma_pago}
            >
              <MenuItem value="">
                <em>Cualquier forma</em>
              </MenuItem>
              {formaPago.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Producto:</Typography>
          <TextField
            fullWidth
            size="small"
            name="producto"
            variant="outlined"
            placeholder="Nombre, código, clave..."
            onChange={obtenerCamposFiltro}
            value={filtro.producto}
          />
        </Grid>
      </Grid>
      <Box mt={1} display="flex">
        <Button
          color="primary"
          startIcon={<ClearOutlined />}
          onClick={() => limpiarFiltros()}
        >
          Limpiar filtros
        </Button>
        <Box mx={1} />
        <ExportarCompras data={data} />
      </Box>
    </Fragment>
  );
};
