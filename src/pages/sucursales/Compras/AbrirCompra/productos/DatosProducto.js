import React, {
  Fragment,
  useContext,
  useState,
  forwardRef,
  useEffect,
} from "react";
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

export default function DatosProducto({ status }) {
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
    costo,
    setCosto,
    cantidad,
    setCantidad,
    loadingProductos,
    setLoadingProductos,
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
    setAlmacenExistente,
  } = useContext(RegProductoContext);
  const [verificate, setVerificate] = useState(false);

  let count = 0;
  if (status === "enEspera" && datosCompra) count = 1;

  const [cargando, setCargando] = useState(false);

  /* Queries */
  const [getProductos, { loading, data, error, refetch }] = useLazyQuery(
    OBTENER_PRODUCTOS,
    {
      variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
      fetchPolicy: "network-only",
    }
  );

  /* console.log(error.networkError.result);
   */
  const [COSTO] = useDebounce(costo, 500);
  const [CANTIDAD] = useDebounce(cantidad, 500);

  useEffect(() => {
    if (loading) {
      setLoadingProductos(true);
    } else {
      setLoadingProductos(false);
    }
  }, [loading]);

  useEffect(() => {
    if (data) obtenerCosto(COSTO);
  }, [COSTO]);

  useEffect(() => {
    if (data) obtenerCantidad(CANTIDAD);
  }, [CANTIDAD]);

  useEffect(() => {
    if (count === 1) {
      getProductos({
        variables: {
          almacen: datosCompra.almacen._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
    }
  }, [count]);

  if (loading) {
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
  }
  if (error) {
    return <ErrorPage error={error} altura={200} />;
  }

  let obtenerProductos = [];
  if (data) obtenerProductos = data.obtenerProductos;

  const obtenerSelectsProducto = (producto) => {
    /* console.log(producto); */
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
      subtotal_descuento: precio_sin_impuesto,
      total_descuento: precio_con_impuesto,
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

    const { iva, ieps, precio_de_compra } = datosProducto.producto.precios;
    const iva_precio = precio_de_compra.iva;
    const ieps_precio = precio_de_compra.ieps;

    let precio_neto = parseFloat(value);
    let subtotal = 0;
    let total = 0;
    let cantidad_descontada = 0;
    let impuesto_actual = iva_precio + ieps_precio;

    let precio_sin_impuesto = precio_neto - impuesto_actual;
    let nuevo_iva =
      parseFloat(precio_sin_impuesto) *
      parseFloat(iva < 10 ? ".0" + iva : "." + iva);
    let nuevo_ieps =
      parseFloat(precio_sin_impuesto) *
      parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
    let nuevo_impuesto = nuevo_ieps + nuevo_iva

    if (datosProducto.descuento_porcentaje > 0) {
      cantidad_descontada = Math.round(
        (precio_sin_impuesto * datosProducto.descuento_porcentaje) / 100
      );
      subtotal = precio_sin_impuesto - cantidad_descontada;
      total = subtotal + nuevo_impuesto;

      setDatosProducto({
        ...datosProducto,
        costo: parseFloat(precio_neto),
        descuento_precio: parseFloat(cantidad_descontada),
        subtotal_descuento: parseFloat(subtotal),
        total_descuento: parseFloat(total),
      });
      return;
    }
    setDatosProducto({
      ...datosProducto,
      costo: parseFloat(precio_neto),
      subtotal_descuento: parseFloat(precio_sin_impuesto),
      total_descuento: parseFloat(precio_sin_impuesto + nuevo_impuesto),
    });
  };

  const agregarCompra = async (actualizar_Precios) => {
    let copy_datosProducto = { ...datosProducto };
    let copy_datosGenerales = { ...datos_generales };
    let copy_presentaciones = [...presentaciones];
    let copy_precios = { ...precios };
    let copy_preciosP = [...preciosP];
    let copy_almacenInicial = { ...almacen_inicial };
    let copy_centroCostos = { ...centro_de_costos };
    let copy_presentacionesEliminadas = [...presentaciones_eliminadas];
    let copy_precioPlazos = { ...preciosPlazos };

    /* Validaciones */
    setCargando(true);
    if (
      !copy_datosProducto.producto.datos_generales ||
      !datosCompra.proveedor.nombre_cliente ||
      !datosCompra.almacen.nombre_almacen
    ) {
      setCargando(false);
      return;
    }

    if (copy_datosGenerales.tipo_producto !== "OTROS") {
      if (copy_presentaciones.length > 0) {
        const pres = copy_presentaciones.filter(
          (res) => res.color._id && res.medida._id && res.existencia
        );
        if (pres.length !== copy_presentaciones.length) {
          setVerificate(true);
          setCargando(false);
          return;
        }
      } else {
        setVerificate(true);
        setCargando(false);
        return;
      }
    }

    let copy_unidadesVenta = [...unidadesVenta];

    if (copy_unidadesVenta.length === 0) {
      copy_unidadesVenta.push(unidadVentaXDefecto);
    } else {
      const unidadxdefecto = copy_unidadesVenta.filter(
        (unidades) => unidades.default === true
      );
      if (unidadxdefecto.length === 0) {
        copy_unidadesVenta.splice(0, 0, unidadVentaXDefecto);
      }
    }

    if (actualizar_Precios) {
      copy_datosProducto.mantener_precio = false;
    } else {
      copy_datosProducto.mantener_precio = true;
    }
    copy_precios.precios_producto = copy_preciosP;

    let producto = {
      datos_generales: await validateJsonEdit(
        copy_datosGenerales,
        "datos_generales"
      ),
      precios: copy_precios,
      imagenes,
      imagenes_eliminadas,
      almacen_inicial: copy_almacenInicial,
      centro_de_costos: copy_centroCostos,
      unidades_de_venta: await validateJsonEdit(
        copy_unidadesVenta,
        "unidades_de_venta"
      ),
      presentaciones: copy_presentaciones,
      presentaciones_eliminadas: copy_presentacionesEliminadas,
      precio_plazos: copy_precioPlazos,
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      usuario: sesion._id,
    };

    copy_datosProducto.producto = producto;

    if (copy_datosProducto.producto.datos_generales.tipo_producto !== "OTROS") {
      //si son medidas sumas las cantidades de las presetnaciones
      if (copy_datosProducto.producto.presentaciones.length > 0) {
        copy_datosProducto.cantidad = 0;
        copy_datosProducto.producto.presentaciones.forEach((presentacion) => {
          const { cantidad, cantidad_nueva } = presentacion;
          let nueva = cantidad_nueva ? cantidad_nueva : 0;
          copy_datosProducto.cantidad += cantidad + nueva;
        });
        if (isNaN(copy_datosProducto.cantidad)) copy_datosProducto.cantidad = 0;
        copy_datosProducto.cantidad_total = copy_datosProducto.cantidad;
      } else {
        copy_datosProducto.cantidad = 0;
        copy_datosProducto.cantidad_total = copy_datosProducto.cantidad;
      }
    } else {
      //Si hay cantidad regalo y es diferente unidad hacer las converciones
      const { cantidad_regalo, cantidad, unidad_regalo } = copy_datosProducto;
      //convertir todo a la unidad media y sumar (Pz, Kg, Lt)
      const factor =
        copy_datosProducto.producto.precios.unidad_de_compra.cantidad;
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
        copy_datosProducto.cantidad_regalo = cantidad_regalo_media / factor;
        copy_datosProducto.cantidad_total = cantidad_total_media / factor;
      } else {
        copy_datosProducto.cantidad_regalo = cantidad_regalo_media;
        copy_datosProducto.cantidad_total = cantidad_total_media;
      }
    }
    copy_datosProducto.subtotal = copy_datosProducto.subtotal_descuento;
    copy_datosProducto.total = copy_datosProducto.total_descuento;

    if (isEditing.producto) {
      //se tiene que actualizar el producto en la fila y sumar el subtotal
      let productosCompra_ordenados = [...productosCompra];
      //calculos de totales, subtotales e impuestos de compra general
      const {
        iva,
        ieps,
      } = copy_datosProducto.producto.precios.precio_de_compra;

      copy_datosProducto.iva_total = iva * copy_datosProducto.cantidad_total;
      copy_datosProducto.ieps_total = ieps * copy_datosProducto.cantidad_total;
      copy_datosProducto.subtotal =
        copy_datosProducto.subtotal * copy_datosProducto.cantidad_total;
      copy_datosProducto.impuestos =
        copy_datosProducto.impuestos * copy_datosProducto.cantidad_total;
      copy_datosProducto.total =
        copy_datosProducto.total * copy_datosProducto.cantidad_total;

      let subtotal =
        datosCompra.subtotal +
        copy_datosProducto.subtotal * copy_datosProducto.cantidad_total -
        isEditing.producto.subtotal;
      let impuestos =
        datosCompra.impuestos +
        copy_datosProducto.impuestos * copy_datosProducto.cantidad_total -
        isEditing.producto.impuestos;
      let total =
        datosCompra.total +
        copy_datosProducto.total * copy_datosProducto.cantidad_total -
        isEditing.producto.total;

      productosCompra_ordenados.splice(isEditing.index, 1, copy_datosProducto);

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
        .map((prod_exist, index) => {
          if (prod_exist.id_producto === copy_datosProducto.id_producto) {
            return { prod_exist, index };
          } else {
            return "";
          }
        })
        .filter(Boolean);

      if (existente.length > 0) {
        let productosCompra_ordenados = [...productosCompra];
        const { index, prod_exist } = existente[0];
        const {
          iva,
          ieps,
        } = copy_datosProducto.producto.precios.precio_de_compra;

        copy_datosProducto.iva_total = iva * copy_datosProducto.cantidad_total;
        copy_datosProducto.ieps_total =
          ieps * copy_datosProducto.cantidad_total;
        copy_datosProducto.subtotal =
          copy_datosProducto.subtotal * copy_datosProducto.cantidad_total;
        copy_datosProducto.impuestos =
          copy_datosProducto.impuestos * copy_datosProducto.cantidad_total;
        copy_datosProducto.total =
          copy_datosProducto.total * copy_datosProducto.cantidad_total;

        productosCompra_ordenados.splice(index, 1, copy_datosProducto);
        setProductosCompra(productosCompra_ordenados);
        setDatosCompra({
          ...datosCompra,
          subtotal:
            datosCompra.subtotal -
            prod_exist.subtotal +
            copy_datosProducto.subtotal,
          impuestos:
            datosCompra.impuestos -
            prod_exist.impuestos +
            copy_datosProducto.impuestos,
          total:
            datosCompra.total - prod_exist.total + copy_datosProducto.total,
        });
      } else {
        let array_ordenado = [...productosCompra];
        const {
          iva,
          ieps,
        } = copy_datosProducto.producto.precios.precio_de_compra;

        copy_datosProducto.iva_total = iva * copy_datosProducto.cantidad_total;
        copy_datosProducto.ieps_total =
          ieps * copy_datosProducto.cantidad_total;
        copy_datosProducto.subtotal =
          copy_datosProducto.subtotal * copy_datosProducto.cantidad_total;
        copy_datosProducto.impuestos =
          copy_datosProducto.impuestos * copy_datosProducto.cantidad_total;
        copy_datosProducto.total =
          copy_datosProducto.total * copy_datosProducto.cantidad_total;

        array_ordenado.splice(0, 0, copy_datosProducto);
        setProductosCompra(array_ordenado);
        setDatosCompra({
          ...datosCompra,
          subtotal: datosCompra.subtotal + copy_datosProducto.subtotal,
          impuestos: datosCompra.impuestos + copy_datosProducto.impuestos,
          total: datosCompra.total + copy_datosProducto.total,
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
    let unidades_venta = producto.unidades_de_venta.filter(
      (res) => !res.default
    );
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
    setUnidadesVenta(unidades_venta);
    setPreciosP(producto.precios.precios_producto);
    setUnidadVentaXDefecto(unidadxdefecto[0]);
    setPresentaciones(
      producto.medidas_producto ? producto.medidas_producto : []
    );
    if (
      datosCompra.almacen.id_almacen &&
      producto.medidas_producto.length === 0
    ) {
      setAlmacenInicial({
        ...almacen_inicial,
        id_almacen: datosCompra.almacen.id_almacen,
        almacen: datosCompra.almacen.nombre_almacen,
      });
    }

    if (producto.inventario_general.length > 0) {
      setAlmacenExistente(true);
    } else {
      setAlmacenExistente(false);
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
        status={status}
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
              getOptionSelected={(option, value) => option._id === value._id}
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
              getOptionSelected={(option, value) => option._id === value._id}
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
              getOptionSelected={(option, value) => option._id === value._id}
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
                <TallasProductos
                  verificate={verificate}
                  setVerificate={setVerificate}
                />
              ) : null}

              <Box mx={1} />
              {datosProducto.costo !==
              productoOriginal.precios.precio_de_compra.precio_con_impuesto ? (
                <ModalAgregarCompra
                  agregarCompra={agregarCompra}
                  cargando={cargando}
                />
              ) : (
                <Button
                  style={
                    loadingProductos
                      ? {
                          pointerEvents: "none",
                          opacity: 0.4,
                        }
                      : null
                  }
                  variant="contained"
                  color="primary"
                  startIcon={
                    cargando ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <Add />
                    )
                  }
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
                  {isEditing.producto ? "Actualizar " : "Agregar a compra"}
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
  const {
    datosProducto,
    datosCompra,
    isEditing,
    loadingProductos,
  } = useContext(ComprasContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        style={
          loadingProductos
            ? {
                pointerEvents: "none",
                opacity: 0.4,
              }
            : null
        }
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
        {isEditing.producto ? "Actualizar " : "Agregar a compra"}
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
