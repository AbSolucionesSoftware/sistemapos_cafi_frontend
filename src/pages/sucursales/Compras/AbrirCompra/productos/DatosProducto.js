import React, { Fragment, useContext, useState, forwardRef, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slide from "@material-ui/core/Slide";

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
import { useLazyQuery } from "@apollo/client";
import { OBTENER_PRODUCTOS } from "../../../../../gql/Catalogos/productos";
import PreciosDeVentaCompras from "./PreciosVenta";
import { validateJsonEdit } from "../../../Catalogos/Producto/validateDatos";
import { Alert, AlertTitle } from "@material-ui/lab";
import { InfoOutlined } from "@material-ui/icons";
import DescuentosInputs from "./Descuentos";
import DatosProveedorAlmacen from "./DatosProveedorAlmacen";
import { initial_state_datosProducto } from "../initial_states";
import MostrarPrecios from "./mostrar_precios";
import { useDebounce } from "use-debounce/lib";

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
    setDatosCompra,
    isEditing,
    setIsEditing,
    editFinish,
    setEditFinish,
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

  const [costo, setCosto] = useState(datosProducto.costo);
  const [cantidad, setCantidad] = useState(datosProducto.cantidad);
  const [cargando, setCargando] = useState(false);

  const [COSTO] = useDebounce(costo, 500);
  const [CANTIDAD] = useDebounce(cantidad, 500);

  useEffect(() => {
    obtenerCosto(COSTO);
  }, [COSTO]);

  useEffect(() => {
    obtenerCantidad(CANTIDAD);
  }, [CANTIDAD]);

  /* Queries */
  const [getProductos, { loading, data, error, refetch }] = useLazyQuery(
    OBTENER_PRODUCTOS,
    {
      variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
      fetchPolicy: "network-only",
    }
  );

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="20vh"
      >
        <CircularProgress />
        <Typography variant="h5">Cargando</Typography>
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} altura={200} />;
  }

  let obtenerProductos = [];
  if (data) obtenerProductos = data.obtenerProductos;

  const obtenerSelectsProducto = (producto) => {
    if (!producto) {
      setDatosProducto(initial_state_datosProducto);
      setCosto(0);
      setCantidad(0);
      resetInitialStates();
      return;
    }

    const {
      ieps,
      iva,
      precio_con_impuesto,
      precio_sin_impuesto,
    } = producto.precios.precio_de_compra;

    const impuestos = iva + ieps;

    setDatosProducto({
      ...datosProducto,
      producto,
      id_producto: producto._id,
      costo: precio_con_impuesto,
      cantidad: 1,
      unidad_regalo: producto.precios.unidad_de_compra.unidad,
      descuento_porcentaje: 0,
      descuento_precio: 0,
      subtotal: precio_sin_impuesto,
      impuestos: parseFloat(impuestos.toFixed(6)),
      total: precio_con_impuesto,
      total_con_descuento: precio_con_impuesto,
    });
    setInitialStates(producto);
    setCosto(precio_con_impuesto);
    setCantidad(1);
    setProductoOriginal(producto);
    setPreciosVenta(producto.precios.precios_producto);
  };

  const obtenerCantidad = (value) => {
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        cantidad: "",
      });
      return;
    }
    setDatosProducto({
      ...datosProducto,
      cantidad: parseFloat(value),
    });
  };

  const obtenerCantidadRegalo = (value) => {
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        cantidad_regalo: "",
      });
      return;
    }
    setDatosProducto({
      ...datosProducto,
      cantidad_regalo: parseFloat(value),
    });
  };

  const obtenerUnidadRegalo = (e) => {
    const { value, name } = e.target;
    setDatosProducto({
      ...datosProducto,
      [name]: value,
    });
  };

  const obtenerCosto = (value) => {
    /* const { name, value } = e.target; */
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        costo: "",
      });
      return;
    }

    let total = value;
    let total_con_descuento;
    let descuento_precio;
    if (datosProducto.descuento_porcentaje > 0) {
      descuento_precio = Math.round(
        (value * datosProducto.descuento_porcentaje) / 100
      );
      total_con_descuento = total - descuento_precio;

      setDatosProducto({
        ...datosProducto,
        costo: parseFloat(value),
        descuento_precio: parseFloat(descuento_precio),
        total_con_descuento: parseFloat(total_con_descuento),
        subtotal: parseFloat(total) - datosProducto.impuestos,
      });
      return;
    }
    setDatosProducto({
      ...datosProducto,
      costo: parseFloat(value),
      total_con_descuento: parseFloat(total),
      subtotal: parseFloat(total) - datosProducto.impuestos,
    });
  };

  const agregarCompra = async (actualizar_Precios) => {
    /* Validaciones */
    setCargando(true);
    if (
      !datosProducto.producto.datos_generales ||
      !datosCompra.proveedor.nombre_cliente ||
      !datosCompra.almacen.nombre_almacen
    ) {
      setCargando(false);
      return;
    }

    let copy_unidadesVenta = [ ...unidadesVenta];

    if (copy_unidadesVenta.length === 0) {
      copy_unidadesVenta.push(unidadVentaXDefecto);
    } else {
      const unidadxdefecto = copy_unidadesVenta.filter(
        (unidades) => unidades.default === true
      );
      if (unidadxdefecto.length > 0) copy_unidadesVenta.splice(0,1,unidadVentaXDefecto);
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
        copy_unidadesVenta,
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

    if (datosProducto.producto.datos_generales.tipo_producto !== "OTROS") {
      //si son medidas sumas las cantidades de las presetnaciones
      if (datosProducto.producto.presentaciones.length > 0) {
        datosProducto.cantidad = 0;
        datosProducto.producto.presentaciones.forEach((presentacion) => {
          const { cantidad, cantidad_nueva } = presentacion;
          let nueva = cantidad_nueva ? cantidad_nueva : 0;
          datosProducto.cantidad += cantidad + nueva;
        });
        if (isNaN(datosProducto.cantidad)) datosProducto.cantidad = 0;
        datosProducto.cantidad_total = datosProducto.cantidad
      }else{
        datosProducto.cantidad = 0;
        datosProducto.cantidad_total = datosProducto.cantidad
      }
    } else {
      //Si hay cantidad regalo y es diferente unidad hacer las converciones
      const { cantidad_regalo, cantidad, unidad_regalo } = datosProducto;
      //convertir todo a la unidad media y sumar (Pz, Kg, Lt)
      const factor = datosProducto.producto.precios.unidad_de_compra.cantidad;
      const cantiad_media = cantidad * factor;
      let cantidad_regalo_media =
        unidad_regalo === "Pz" ||
        unidad_regalo === "Kg" ||
        unidad_regalo === "Lt"
          ? cantidad_regalo
          : cantidad_regalo * factor;
      let cantidad_total_media = cantiad_media + cantidad_regalo_media;

      //si factor es > 1 es caja o costal y dividir unidad media entre factor y si no mandar la cantidad total media;
      if (factor > 1) {
        datosProducto.cantidad_regalo = cantidad_regalo_media / factor;
        datosProducto.cantidad_total = cantidad_total_media / factor;
      } else {
        datosProducto.cantidad_regalo = cantidad_regalo_media;
        datosProducto.cantidad_total = cantidad_total_media;
      }
    }
    datosProducto.total = datosProducto.total_con_descuento;

    if (isEditing.producto) {
      //se tiene que actualizar el producto en la fila y sumar el subtotal
      let productosCompra_ordenados = [...productosCompra];

      let subtotal =
        datosCompra.subtotal +
        datosProducto.subtotal -
        isEditing.producto.subtotal;
      let impuestos =
        datosCompra.impuestos +
        datosProducto.impuestos -
        isEditing.producto.impuestos;
      let total =
        datosCompra.total + datosProducto.total - isEditing.producto.total;

      productosCompra_ordenados.splice(isEditing.index, 1, datosProducto);

      setProductosCompra(productosCompra_ordenados);
      setDatosCompra({
        ...datosCompra,
        subtotal,
        impuestos,
        total,
      });
      setIsEditing({});
      setEditFinish(!editFinish);
      setProductoOriginal({ precios: initial_state_precios });
      setDatosProducto(initial_state_datosProducto);
      setCosto(0);
      setCantidad(0);
      setCargando(false);
    } else {
      // se agregar el producto normal y verificar si ya esta el producto en la lista

      const existente = productosCompra
        .map((result, index) => {
          if (result.id_producto === datosProducto.id_producto) {
            return { result, index };
          } else {
            return "";
          }
        })
        .filter(Boolean);

      if (existente.length > 0) {
        let productosCompra_ordenados = [...productosCompra];
        const { index, result } = existente[0];
        productosCompra_ordenados.splice(index, 1, datosProducto);
        setProductosCompra(productosCompra_ordenados);
        setDatosCompra({
          ...datosCompra,
          subtotal:
            datosCompra.subtotal + datosProducto.subtotal - result.subtotal,
          impuestos:
            datosCompra.impuestos + datosProducto.impuestos - result.impuestos,
          total: datosCompra.total + datosProducto.total - result.total,
        });
      } else {
        let array_ordenado = [ ...productosCompra];
        const { iva, ieps } = datosProducto.producto.precios.precio_de_compra;

        datosProducto.iva_total = iva*datosProducto.cantidad_total
        datosProducto.ieps_total = ieps*datosProducto.cantidad_total
        datosProducto.subtotal = datosProducto.subtotal*datosProducto.cantidad_total
        datosProducto.impuestos = datosProducto.impuestos*datosProducto.cantidad_total
        datosProducto.total = datosProducto.total*datosProducto.cantidad_total

        array_ordenado.splice(0,0, datosProducto)
        setProductosCompra(array_ordenado);
        setDatosCompra({
          ...datosCompra,
          subtotal: datosCompra.subtotal + datosProducto.subtotal,
          impuestos: datosCompra.impuestos + datosProducto.impuestos,
          total: datosCompra.total + datosProducto.total,
        });
      }
      setProductoOriginal({ precios: initial_state_precios });
      setDatosProducto(initial_state_datosProducto);
      setCosto(0);
      setCantidad(0);
      setCargando(false);
    }
  };

  /* SET STATES WHEN UPDATING */
  const setInitialStates = (producto) => {
    const { precios_producto, ...new_precios } = producto.precios;
    const unidadxdefecto = producto.unidades_de_venta.filter(
      (res) => res.default === true
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
    if (datosCompra.almacen.id_almacen && !producto.medidas_registradas) {
      setAlmacenInicial({
        ...almacen_inicial,
        id_almacen: datosCompra.almacen.id_almacen,
        almacen: datosCompra.almacen.nombre_almacen,
      });
    }
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
        refetchProductos={refetch}
        getProductos={getProductos}
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
              options={obtenerProductos}
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
              disabled={
                !datosCompra.almacen.id_almacen ||
                !datosCompra.proveedor.id_proveedor
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Producto</Typography>
          <Box display="flex" width={250} alignItems="center">
            <Autocomplete
              id="combo-box-producto-nombre"
              size="small"
              fullWidth
              options={obtenerProductos}
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
              disabled={
                !datosCompra.almacen.id_almacen ||
                !datosCompra.proveedor.id_proveedor
              }
            />
            {!datosCompra.almacen.id_almacen ||
            !datosCompra.proveedor.id_proveedor ? (
              <IconButton disabled>
                <Add />
              </IconButton>
            ) : (
              <CrearProducto
                accion={false}
                productosRefetch={refetch}
                fromCompra={true}
              />
            )}
          </Box>
        </Grid>
        <Grid item>
          <Typography>Clave</Typography>
          <Box width={140}>
            <Autocomplete
              id="combo-box-producto-clave"
              size="small"
              fullWidth
              options={obtenerProductos}
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
              disabled={
                !datosCompra.almacen.id_almacen ||
                !datosCompra.proveedor.id_proveedor
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Costo</Typography>
          <Box width={100}>
            <TextField
              inputMode="decimal"
              name="costo"
              variant="outlined"
              size="small"
              fullWidth
              disabled={!datosProducto.producto.datos_generales}
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
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
          <Fragment>
            <Grid item>
              <Typography>Unidad</Typography>
              <Box width={100}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  aria-readonly="true"
                  value={datosProducto.producto.precios.unidad_de_compra.unidad}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography>Cantidad</Typography>
              <Box width={100}>
                <TextField
                  name="cantidad"
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputMode="numeric"
                  disabled={!datosProducto.producto.datos_generales}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography>Cant. regalo</Typography>
              <Box width={100}>
                <TextField
                  name="cantidad_regalo"
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputMode="numeric"
                  disabled={!datosProducto.producto.datos_generales}
                  value={datosProducto.cantidad_regalo}
                  onChange={(e) => obtenerCantidadRegalo(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography>Unidad. regalo</Typography>
              <Box width={100}>
                <FormControl
                  variant="outlined"
                  size="small"
                  name="unidad_regalo"
                  fullWidth
                >
                  {datosProducto.producto.precios.granel ? (
                    <Select
                      id="select-unidad-regalo"
                      disabled={!datosProducto.producto.datos_generales}
                      name="unidad_regalo"
                      value={datosProducto.unidad_regalo}
                      onChange={obtenerUnidadRegalo}
                    >
                      <MenuItem value="Kg">Kg</MenuItem>
                      <MenuItem value="Costal">Costal</MenuItem>
                      <MenuItem value="Lt">Lt</MenuItem>
                    </Select>
                  ) : (
                    <Select
                      id="select-unidad-regalo"
                      disabled={!datosProducto.producto.datos_generales}
                      name="unidad_regalo"
                      value={datosProducto.unidad_regalo}
                      onChange={obtenerUnidadRegalo}
                    >
                      <MenuItem value="Caja">Caja</MenuItem>
                      <MenuItem value="Pz">Pz</MenuItem>
                    </Select>
                  )}
                </FormControl>
              </Box>
            </Grid>
          </Fragment>
        ) : null}

        <Grid item>
          <Typography>Descuento</Typography>
          <DescuentosInputs />
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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box m={1}>
              <MostrarPrecios />
            </Box>
            <Box display="flex">
              {datosProducto.producto.datos_generales &&
              datosProducto.producto.datos_generales.tipo_producto !==
                "OTROS" ? (
                <TallasProductos />
              ) : null}

              <Box mx={1} />
              {datosProducto.costo !==
              productoOriginal.precios.precio_de_compra.precio_con_impuesto ? (
                <ModalAgregarCompra agregarCompra={agregarCompra} cargando={cargando} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={cargando ? <CircularProgress color="inherit" size={20} /> : <Add />}
                  disableElevation
                  disabled={
                    datosProducto.producto.datos_generales
                      ? datosProducto.producto.datos_generales.tipo_producto ===
                        "OTROS"
                        ? !datosCompra.proveedor.nombre_cliente ||
                          !datosCompra.almacen.nombre_almacen ||
                          !datosProducto.costo ||
                          !datosProducto.cantidad
                          ? true
                          : false
                        : !datosCompra.proveedor.nombre_cliente ||
                          !datosCompra.almacen.nombre_almacen ||
                          !datosProducto.costo
                        ? true
                        : false
                      : true
                  }
                  onClick={() => agregarCompra()}
                >
                  {isEditing.producto ? "Actualizar " :"Agregar a compra"}
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

const ModalAgregarCompra = ({ agregarCompra, cargando }) => {
  const [open, setOpen] = useState(false);
  const { datosProducto, datosCompra, isEditing } = useContext(ComprasContext);

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
          datosProducto.producto.datos_generales
            ? datosProducto.producto.datos_generales.tipo_producto === "OTROS"
              ? !datosCompra.proveedor.nombre_cliente ||
                !datosCompra.almacen.nombre_almacen ||
                !datosProducto.costo ||
                !datosProducto.cantidad
                ? true
                : false
              : !datosCompra.proveedor.nombre_cliente ||
                !datosCompra.almacen.nombre_almacen ||
                !datosProducto.costo
              ? true
              : false
            : true
        }
        onClick={() => handleClickOpen()}
      >
        {isEditing.producto ? "Actualizar " :"Agregar a compra"}
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
            cargando={cargando}
            handleClose={handleClose}
            agregarCompra={agregarCompra}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};
