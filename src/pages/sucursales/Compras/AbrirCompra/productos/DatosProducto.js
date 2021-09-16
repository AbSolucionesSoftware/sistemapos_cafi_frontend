import React, { Fragment, useContext, useState, forwardRef } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";

import RegistroProvedor from "../../../Catalogos/Cliente/CrearCliente";
import RegistroAlmacen from "../../../Almacenes/RegistroAlmacen/ContainerRegistroAlmacen";
import PreciosProductos from "./PreciosProductos";
import TallasProductos from "./TallasProducto";
import Add from "@material-ui/icons/Add";

import "date-fns";
import local from "date-fns/locale/es";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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
import { validaciones } from "../../../Catalogos/Producto/validaciones";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import ErrorPage from "../../../../../components/ErrorPage";

import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { AlmacenProvider } from "../../../../../context/Almacenes/crearAlmacen";
import { ClienteProvider } from "../../../../../context/Catalogos/crearClienteCtx";

import { useQuery } from "@apollo/client";
import { OBTENER_CONSULTA_GENERAL_PRODUCTO } from "../../../../../gql/Compras/compras";
import PreciosDeVentaCompras from "./PreciosVenta";
import { Dialog, DialogActions, DialogTitle, Slide } from "@material-ui/core";

export default function DatosProducto() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const {
    datosProducto,
    setDatosProducto,
    productosCompra,
    setProductosCompra,
    datosCompra,
    setDatosCompra,
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

  const [alert, setAlert] = useState({ message: "", status: "", open: false });

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
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} />;
  }

  const {
    almacenes,
    productos,
    proveedores,
  } = data.obtenerConsultaGeneralCompras;

  const obtenerProveedorAlmacen = (tipo, value) => {
    if (!value) {
      setDatosCompra({ ...datosCompra, [tipo]: {} });
      return;
    }
    setDatosCompra({ ...datosCompra, [tipo]: value });
  };

  const obtenerSelectsProducto = (producto) => {
    if (!producto) {
      setDatosProducto({
        ...datosProducto,
        producto: {},
        costo: 0,
        cantidad: 0,
        descuento_porcentaje: 0,
        descuento_precio: 0,
        subtotal: 0,
        impuestos: 0,
        total: 0,
      });
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
    });
    setInitialStates(producto);
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

  const agregarCompra = async () => {
    if (
      !datosProducto.producto.datos_generales ||
      !datosCompra.proveedor.nombre_cliente ||
      !datosCompra.almacen.nombre_almacen
    ) {
      return;
    }

    const validate = validaciones(
      datos_generales,
      precios,
      almacen_inicial,
      presentaciones,
      datosProducto.producto
    );

    if (validate.error) {
      setAlert({
        message: `Hay campos sin llenar`,
        status: "error",
        open: true,
      });
      return;
    }

    if (unidadesVenta.length === 0) {
      unidadesVenta.push(unidadVentaXDefecto);
    } else {
      const unidadxdefecto = unidadesVenta.filter(
        (unidades) => unidades.default
      );
      if (unidadxdefecto.length === 0) unidadesVenta.push(unidadVentaXDefecto);
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

    setProductosCompra([...productosCompra, datosProducto]);
    setDatosProducto({
      producto: {},
      costo: 0,
      cantidad: 0,
      descuento_porcentaje: 0,
      descuento_precio: 0,
      subtotal: 0,
      impuestos: 0,
      total: 0,
    });
  };

  const obtenerFecha = (date) => {
    setDatosCompra({
      ...datosCompra,
      fecha_compra: date,
    });
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

  /* SI NO EXISTE ESTA INFORMACION EN LA BD, ENVIAR A LA BD */
  const validateJsonEdit = async (data, tipo) => {
    if (tipo === "datos_generales") {
      let object_date = {
        clave_alterna: data.clave_alterna,
        tipo_producto: data.tipo_producto,
        nombre_comercial: data.nombre_comercial,
        nombre_generico: data.nombre_generico,
        receta_farmacia: data.receta_farmacia,
      };
      if (data.codigo_barras !== null && data.codigo_barras !== "")
        object_date = { ...object_date, codigo_barras: data.codigo_barras };
      if (data.descripcion !== null && data.descripcion !== "")
        object_date = { ...object_date, descripcion: data.descripcion };
      if (data.id_categoria !== null && data.id_categoria !== "")
        object_date = { ...object_date, id_categoria: data.id_categoria };
      if (data.categoria !== null && data.categoria !== "")
        object_date = { ...object_date, categoria: data.categoria };
      if (data.subcategoria !== null && data.subcategoria !== "")
        object_date = { ...object_date, subcategoria: data.subcategoria };
      if (data.id_subcategoria !== null && data.id_subcategoria !== "")
        object_date = { ...object_date, id_subcategoria: data.id_subcategoria };
      if (data.id_departamento !== null && data.id_departamento !== "")
        object_date = { ...object_date, id_departamento: data.id_departamento };
      if (data.departamento !== null && data.departamento !== "")
        object_date = { ...object_date, departamento: data.departamento };
      if (data.id_marca !== null && data.id_marca !== "")
        object_date = { ...object_date, id_marca: data.id_marca };
      if (data.marca !== null && data.marca !== "")
        object_date = { ...object_date, marca: data.marca };
      if (data.clave_producto_sat !== null && data.clave_producto_sat !== "")
        object_date = {
          ...object_date,
          clave_producto_sat: data.clave_producto_sat,
        };
      return object_date;
    } else if (tipo === "unidades_de_venta") {
      let end_array = [];
      for (var i = 0; i < data.length; i++) {
        let object = {
          _id: data[i]._id,
          cantidad: data[i].cantidad,
          id_producto: data[i].id_producto,
          precio: data[i].precio,
          unidad_principal: data[i].unidad_principal,
          unidad: data[i].unidad,
        };
        if (data[i].codigo_barras !== null && data[i].codigo_barras !== "")
          object = { ...object, codigo_barras: data[i].codigo_barras };
        if (data[i].default !== null && data[i].default !== "")
          object = { ...object, default: data[i].default };
        end_array.push(object);
      }
      return end_array;
    }
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <Autocomplete
              id="combo-box-proveedor"
              size="small"
              fullWidth
              options={proveedores}
              getOptionLabel={(option) => option.nombre_cliente}
              renderInput={(params) => (
                <TextField {...params} label="Proveedor" variant="outlined" />
              )}
              onChange={(_, value) =>
                obtenerProveedorAlmacen("proveedor", value)
              }
              getOptionSelected={(option) => option.nombre_cliente}
              value={
                datosCompra.proveedor.nombre_cliente
                  ? datosCompra.proveedor
                  : null
              }
            />
            <ClienteProvider>
              <RegistroProvedor
                accion="registrar"
                tipo="PROVEEDOR"
                refetch={refetch}
              />
            </ClienteProvider>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <Autocomplete
              id="combo-box-almacen"
              size="small"
              fullWidth
              options={almacenes}
              getOptionLabel={(option) => option.nombre_almacen}
              renderInput={(params) => (
                <TextField {...params} label="Almacen" variant="outlined" />
              )}
              onChange={(_, value) => obtenerProveedorAlmacen("almacen", value)}
              getOptionSelected={(option) => option.nombre_almacen}
              value={
                datosCompra.almacen.nombre_almacen ? datosCompra.almacen : null
              }
            />
            <AlmacenProvider>
              <RegistroAlmacen accion="registrar" refetch={refetch} />
            </AlmacenProvider>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={local}>
              <KeyboardDatePicker
                inputVariant="outlined"
                margin="dense"
                id="date-picker-dialog"
                placeholder="ex: DD/MM/AAAA"
                format="dd/MM/yyyy"
                value={datosCompra.fecha_compra}
                onChange={obtenerFecha}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Grid>
      </Grid>
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
        <Grid item>
          <Typography>Cantidad</Typography>
          <Box width={60}>
            <TextField
              name="cantidad"
              variant="outlined"
              size="small"
              fullWidth
              inputMode="numeric"
              value={datosProducto.cantidad}
              onChange={obtenerCostoCantidad}
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Descuento</Typography>
          <Box display="flex" width={140}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              inputMode="numeric"
              value={datosProducto.descuento_precio}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <Box mr={1} />
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              inputMode="numeric"
              value={datosProducto.descuento_porcentaje}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box>
            <Grid container spacing={2}>
              <Grid item>
                <Typography style={{ fontSize: 18 }}>
                  Subtotal: <b>${formatoMexico(datosProducto.subtotal)}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 18 }}>
                  Impuestos: <b>${formatoMexico(datosProducto.impuestos)}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 18 }}>
                  <b>Total: ${formatoMexico(datosProducto.total)}</b>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Box mt={1}>
        <Grid container>
          <Grid item xs={12} md={7} padding="checkbox">
            <PreciosDeVentaCompras />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Box display="flex" width="100%" justifyContent="center">
              <TallasProductos />
              <Box mx={1} />
              <ModalAgregarCompra agregarCompra={agregarCompra} />
			  {/* CONDICIONAR */}
			  
              {/* <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                disableElevation
                disabled={
                  !datosProducto.producto.datos_generales ||
                  !datosCompra.proveedor.nombre_cliente ||
                  !datosCompra.almacen.nombre_almacen
                }
                onClick={() => agregarCompra()}
              >
                Agregar a compra
              </Button> */}
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
          !datosCompra.almacen.nombre_almacen
        }
        onClick={() => handleClickOpen()}
      >
        Agregar a compra
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="modal-agregar-compra"
      >
        <DialogTitle id="modal-agregar-compra">
          <Typography variant="h6">
            El costo es diferente al precio de compra actual
          </Typography>
          <Typography variant="h6">
            ¿Desea actualizar los precios o mantenerlos?
          </Typography>
        </DialogTitle>
        <DialogActions>
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
