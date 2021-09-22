import React, { Fragment, useContext, useState, forwardRef } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";

import PreciosProductos from "./PreciosProductos";
import TallasProductos from "./TallasProducto";
import Add from "@material-ui/icons/Add";

import {
  initial_state_almacen_inicial,
  initial_state_centro_de_costos,
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_preciosPlazos,
  initial_state_unidadVentaXDefecto,
} from "../../../../../context/Catalogos/initialStatesProducto";

import CrearProducto, {
  initial_state_preciosP,
} from "../../../Catalogos/Producto/crearProducto";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import ErrorPage from "../../../../../components/ErrorPage";

import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

import { useQuery } from "@apollo/client";
import { OBTENER_CONSULTA_GENERAL_PRODUCTO } from "../../../../../gql/Compras/compras";
import PreciosDeVentaCompras from "./PreciosVenta";
import { Dialog, DialogActions, DialogTitle, Slide } from "@material-ui/core";
import { validateJsonEdit } from "../../../Catalogos/Producto/validateDatos";
import { Alert, AlertTitle } from "@material-ui/lab";
import { InfoOutlined } from "@material-ui/icons";
import DescuentosInputs from "./Descuentos";
import DatosProveedorAlmacen from "./DatosProveedorAlmacen";
import { initial_state_datosProducto } from "../initial_states";

export default function DatosProducto() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const {
    datosProducto,
    setDatosProducto,
    productosCompra,
    setProductosCompra,
    datosCompra,
    productoOriginal,
    setProductoOriginal,
    setPreciosVenta,
	setDatosCompra
  } = useContext(ComprasContext);
  const {
    datos_generales,
    setDatosGenerales,
    precios,
    setPrecios,
    setValidacion,
    preciosP,
    setPreciosP,
    imagenes,
    setImagenes,
    unidadesVenta,
    setUnidadesVenta,
    almacen_inicial,
    setAlmacenInicial,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    centro_de_costos,
    setCentroDeCostos,
    preciosPlazos,
    setPreciosPlazos,
    setSubcategorias,
    setOnPreview,
    setSubcostos,
    imagenes_eliminadas,
    setImagenesEliminadas,
    presentaciones,
    setPresentaciones,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
  } = useContext(RegProductoContext);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(
    OBTENER_CONSULTA_GENERAL_PRODUCTO,
    {
      variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id },
    }
  );

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="25vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} altura={200} />;
  }

  const {
    almacenes,
    productos,
    proveedores,
  } = data.obtenerConsultaGeneralCompras;

  const obtenerSelectsProducto = (producto) => {
    if (!producto) {
      setDatosProducto(initial_state_datosProducto);
      resetInitialStates();
      return;
    }

    const {
      ieps,
      iva,
      precio_con_impuesto,
      precio_sin_impuesto,
    } = producto.precios.precio_de_compra;
    const { cantidad } = producto.precios.unidad_de_compra;
    const impuestos = iva + ieps;

    setDatosProducto({
      ...datosProducto,
      producto,
      costo: precio_con_impuesto,
      cantidad,
      descuento_porcentaje: 0,
      descuento_precio: 0,
      subtotal: precio_sin_impuesto,
      impuestos: parseFloat(impuestos.toFixed(2)),
      total: precio_con_impuesto,
	  total_con_descuento: precio_con_impuesto,
    });
    setInitialStates(producto);
    setProductoOriginal(producto);
    setPreciosVenta(producto.precios.precios_producto);
  };

  const obtenerCostoCantidad = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        [name]: "",
      });
      return;
    }
    setDatosProducto({
      ...datosProducto,
      [name]: parseFloat(value),
    });
  };

  const agregarCompra = async (actualizar_Precios) => {
    /* Validaciones */
    if (
      !datosProducto.producto.datos_generales ||
      !datosCompra.proveedor.nombre_cliente ||
      !datosCompra.almacen.nombre_almacen
    ) {
      return;
    }

    /* poner la unidad de venta por defecto si no agrego */
    if (unidadesVenta.length === 0) {
      unidadesVenta.push(unidadVentaXDefecto);
    } else {
      const unidadxdefecto = unidadesVenta.filter(
        (unidades) => unidades.default
      );
      if (unidadxdefecto.length === 0) unidadesVenta.push(unidadVentaXDefecto);
    }

    if (actualizar_Precios) {
      datosProducto.mantener_precio = false;
    } else {
      datosProducto.mantener_precio = true;
    }

    precios.precios_producto = preciosP;

    let producto = {
      datos_generales: await validateJsonEdit(
        datos_generales,
        "datos_generales"
      ),
      precios,
      imagenes,
      imagenes_eliminadas,
      almacen_inicial,
      centro_de_costos,
      unidades_de_venta: await validateJsonEdit(
        unidadesVenta,
        "unidades_de_venta"
      ),
      presentaciones,
      presentaciones_eliminadas,
      precio_plazos: preciosPlazos,
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      usuario: sesion._id,
    };

    datosProducto.producto = producto;
    datosProducto.total = datosProducto.total_con_descuento;

    setProductosCompra([...productosCompra, datosProducto]);
	setDatosCompra({
		...datosCompra, 
		subtotal: datosCompra.subtotal + datosProducto.subtotal,
		impuestos: datosCompra.impuestos + datosProducto.impuestos,
		total: datosCompra.total + datosProducto.total,
	});
    setProductoOriginal({ precios: initial_state_precios });
    setDatosProducto(initial_state_datosProducto);
  };

  /* SET STATES WHEN UPDATING */
  const setInitialStates = (producto) => {
    const { precios_producto, ...new_precios } = producto.precios;
    const unidadxdefecto = producto.unidades_de_venta.filter(
      (res) => res.default
    );

    setDatosGenerales(producto.datos_generales);
    setPrecios(new_precios);
    setCentroDeCostos(
      producto.centro_de_costos
        ? producto.centro_de_costos
        : initial_state_centro_de_costos
    );
    setImagenes(producto.imagenes);
    setPreciosPlazos(producto.precio_plazos);
    setUnidadesVenta(producto.unidades_de_venta);
    setPreciosP(producto.precios.precios_producto);
    setUnidadVentaXDefecto(unidadxdefecto[0]);
    setPresentaciones(
      producto.medidas_producto ? producto.medidas_producto : []
    );
  };

  /* ###### RESET STATES ###### */
  const resetInitialStates = () => {
    setDatosGenerales(initial_state_datos_generales);
    setPrecios(initial_state_precios);
    setUnidadVentaXDefecto(initial_state_unidadVentaXDefecto);
    setPreciosP(initial_state_preciosP);
    setUnidadesVenta([]);
    setAlmacenInicial(initial_state_almacen_inicial);
    setCentroDeCostos({});
    setPreciosPlazos(initial_state_preciosPlazos);
    setSubcategorias([]);
    setImagenes([]);
    setOnPreview({ index: "", image: "" });
    setValidacion({ error: false, message: "" });
    setSubcostos([]);
    setImagenesEliminadas([]);
    setPresentaciones([]);
    setPresentacionesEliminadas([]);
  };

  return (
    <Fragment>
      <DatosProveedorAlmacen
        proveedores={proveedores}
        almacenes={almacenes}
        refetch={refetch}
      />
      <Box my={1} />
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Typography>Código de barras</Typography>
          <Box width={200}>
            <Autocomplete
              id="combo-box-producto-codigo"
              size="small"
              fullWidth
              options={productos}
              getOptionLabel={(option) =>
                option.datos_generales.codigo_barras
                  ? option.datos_generales.codigo_barras
                  : "N/A"
              }
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
              onChange={(_, value) => obtenerSelectsProducto(value)}
              getOptionSelected={(option) =>
                option.datos_generales.codigo_barras
              }
              value={
                datosProducto.producto.datos_generales
                  ? datosProducto.producto
                  : null
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Producto</Typography>
          <Box display="flex" alignItems="center" width={250}>
            <Autocomplete
              id="combo-box-producto-nombre"
              size="small"
              fullWidth
              options={productos}
              getOptionLabel={(option) =>
                option.datos_generales.nombre_comercial
              }
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
              onChange={(_, value) => obtenerSelectsProducto(value)}
              getOptionSelected={(option) =>
                option.datos_generales.nombre_comercial
              }
              value={
                datosProducto.producto.datos_generales
                  ? datosProducto.producto
                  : null
              }
            />
            <CrearProducto
              accion={false}
              productosRefetch={refetch}
              fromCompra={true}
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Clave</Typography>
          <Box width={140}>
            <Autocomplete
              id="combo-box-producto-clave"
              size="small"
              fullWidth
              options={productos}
              getOptionLabel={(option) => option.datos_generales.clave_alterna}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
              onChange={(_, value) => obtenerSelectsProducto(value)}
              getOptionSelected={(option) =>
                option.datos_generales.clave_alterna
              }
              value={
                datosProducto.producto.datos_generales
                  ? datosProducto.producto
                  : null
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Costo</Typography>
          <Box width={100}>
            <TextField
              inputMode="numeric"
              name="costo"
              variant="outlined"
              size="small"
              fullWidth
              disabled={!datosProducto.producto.datos_generales}
              value={datosProducto.costo}
              onChange={obtenerCostoCantidad}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
        {datosProducto.producto.datos_generales &&
        datosProducto.producto.datos_generales.tipo_producto === "OTROS" ? (
          <Grid item>
            <Typography>Cantidad</Typography>
            <Box width={80}>
              <TextField
                name="cantidad"
                variant="outlined"
                size="small"
                fullWidth
                inputMode="numeric"
                disabled={!datosProducto.producto.datos_generales}
                value={datosProducto.cantidad}
                onChange={obtenerCostoCantidad}
              />
            </Box>
          </Grid>
        ) : null}

        <Grid item>
          <Typography>Descuento</Typography>
          <DescuentosInputs />
        </Grid>
        <Grid item>
          <Box mx={1}>
            <Grid container spacing={2}>
              <Grid item>
                <Typography style={{ fontSize: 16 }}>Subtotal:</Typography>
                <Typography style={{ fontSize: 18 }}>
                  <b>${formatoMexico(datosProducto.subtotal)}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 16 }}>Impuestos:</Typography>
                <Typography style={{ fontSize: 18 }}>
                  <b>${formatoMexico(datosProducto.impuestos)}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 16 }}>Descuento:</Typography>
                <Typography style={{ fontSize: 18 }}>
                  <b>{datosProducto.descuento_porcentaje}%</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 16 }}>Total:</Typography>
                <Typography style={{ fontSize: 18 }}>
                  <b>${formatoMexico(datosProducto.total_con_descuento)}</b>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Box mt={1}>
        <Grid container>
          <Grid item xs={12} md={8} lg={7} padding="checkbox">
            <PreciosDeVentaCompras />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            lg={5}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Box display="flex" width="100%" >
              {datosProducto.producto.datos_generales &&
              datosProducto.producto.datos_generales.tipo_producto !==
                "OTROS" ? (
                <TallasProductos />
              ) : null}

              <Box mx={1} />
              {datosProducto.costo !==
              productoOriginal.precios.precio_de_compra.precio_con_impuesto ? (
                <ModalAgregarCompra agregarCompra={agregarCompra} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  disableElevation
                  disabled={
                    !datosProducto.producto.datos_generales ||
                    !datosCompra.proveedor.nombre_cliente ||
                    !datosCompra.almacen.nombre_almacen ||
                    !datosProducto.costo ||
                    !datosProducto.cantidad
                  }
                  onClick={() => agregarCompra()}
                >
                  Agregar a compra
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalAgregarCompra = ({ agregarCompra }) => {
  const [open, setOpen] = useState(false);
  const { datosProducto, datosCompra } = useContext(ComprasContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        disableElevation
        disabled={
          !datosProducto.producto.datos_generales ||
          !datosCompra.proveedor.nombre_cliente ||
          !datosCompra.almacen.nombre_almacen ||
          !datosProducto.costo ||
          !datosProducto.cantidad
        }
        onClick={() => handleClickOpen()}
      >
        Agregar a compra
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        aria-labelledby="modal-agregar-compra"
      >
        <DialogTitle id="modal-agregar-compra" style={{ padding: 0 }}>
          <Alert
            severity="info"
            icon={<InfoOutlined style={{ fontSize: 30 }} />}
            style={{ padding: 16 }}
          >
            <AlertTitle style={{ fontSize: 20 }}>
              El costo es diferente al precio de compra actual
            </AlertTitle>
            <Typography style={{ fontSize: 18 }}>
              ¿Desea actualizar los precios o mantenerlos?
            </Typography>
          </Alert>
        </DialogTitle>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => handleClose()} color="default">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              agregarCompra();
              handleClose();
            }}
            color="primary"
          >
            Mantener
          </Button>
          <PreciosProductos
            handleClose={handleClose}
            agregarCompra={agregarCompra}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};
