import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Slide,
  InputBase,
  Paper,
  IconButton,
  DialogTitle,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import useStyles from "../styles";
import { useDebounce } from "use-debounce/lib";
import { FcSearch } from "react-icons/fc";
import CloseIcon from "@material-ui/icons/Close";
import { Search } from "@material-ui/icons";
import ListaProductos from "./ListaProductos";
import { useQuery } from "@apollo/client";
import { CONSULTA_PRODUCTOS_VENTAS } from "../../../gql/Ventas/ventas_generales";
import InformacionProducto from "./InformacionProducto";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import {
  calculatePrices2,
  findProductArray,
  verifiPrising,
} from "../../../config/reuserFunctions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BuscarProducto() {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
  } = useContext(VentasContext);

  const [open, setOpen] = useState(false);
  const [searchProducto, setSearchProducto] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [granelBase, setGranelBase] = useState({
    granel: false,
    valor: 0,
  });

  const [value] = useDebounce(searchProducto, 500);

  const { data, refetch, loading } = useQuery(CONSULTA_PRODUCTOS_VENTAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: {
        producto: value.producto ? value.producto : "",
      },
    },
  });

  let productosBusqueda = [];

  if (data) productosBusqueda = data.obtenerProductosVentas;

  const obtenerDatos = (e) => {
    setSearchProducto({ ...searchProducto, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setProductoSeleccionado([]);
    refetch();
    setOpen(!open);
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 80) {
      handleClickOpen();
    }
  }

  useEffect(() => {
    setGranelBase({
      granel: false,
      valor: 0,
    });
  }, []);

  const agregarProductos = async (producto) => {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let venta_actual = venta === null ? [] : venta;
    let venta_existente =
      venta === null
        ? {
            subTotal: 0,
            total: 0,
            impuestos: 0,
            iva: 0,
            ieps: 0,
            descuento: 0,
            monedero: 0,
          }
        : venta;

    let productosVentasTemp = productosVentas;

    let CalculosData = {
      subTotal: 0,
      total: 0,
      impuestos: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
      monedero: 0,
    };

    const producto_encontrado = await findProductArray(producto);

    if (!producto_encontrado.found && producto._id) {
      const newP = { ...producto };
      //Tomar el precio con descuento o normal
      const productoPrecioFinal = newP.descuento_activo
        ? newP.descuento.precio_neto
        : newP.precio_unidad.precio_neto;

      const new_prices = await calculatePrices2({
        newP,
        cantidad: 0,
        granel: granelBase,
        origen: "Ventas1",
        precio_boolean: false,
      });

      new_prices.newP.precio_anterior = productoPrecioFinal;

      new_prices.newP.iva_total_producto = parseFloat(new_prices.ivaCalculo);
      new_prices.newP.ieps_total_producto = parseFloat(new_prices.iepsCalculo);
      new_prices.newP.impuestos_total_producto = parseFloat(
        new_prices.impuestoCalculo
      );
      new_prices.newP.subtotal_total_producto = parseFloat(
        new_prices.subtotalCalculo
      );
      new_prices.newP.total_total_producto = parseFloat(
        new_prices.totalCalculo
      );

      //   console.log(new_prices.newP);

      productosVentasTemp.push(new_prices.newP);

      CalculosData = {
        subTotal:
          parseFloat(venta_existente.subTotal) +
          parseFloat(new_prices.subtotalCalculo),
        total:
          parseFloat(venta_existente.total) +
          parseFloat(new_prices.totalCalculo),
        impuestos:
          parseFloat(venta_existente.impuestos) +
          parseFloat(new_prices.impuestoCalculo),
        iva:
          parseFloat(venta_existente.iva) + parseFloat(new_prices.ivaCalculo),
        ieps:
          parseFloat(venta_existente.ieps) + parseFloat(new_prices.iepsCalculo),
        descuento:
          parseFloat(venta_existente.descuento) +
          parseFloat(new_prices.descuentoCalculo),
        monedero:
          parseFloat(venta_existente.monedero) +
          parseFloat(new_prices.monederoCalculo),
      };
    } else if (producto_encontrado.found && producto._id) {
      const {
        cantidad_venta,
        ...newP
      } = producto_encontrado.producto_found.producto;

      newP.cantidad_venta = parseInt(cantidad_venta) + 1;

      const verify_prising = await verifiPrising(newP);

      //   console.log(verify_prising);

      //Verificar si el precio fue encontrado
      if (verify_prising.found) {
        const calculo_resta = await calculatePrices2({
          newP,
          cantidad_venta,
          granel: newP.granel_producto,
          origen: "",
          precio_boolean: true,
          precio: newP.precio_actual_object,
        });

        const calculo_sumar = await calculatePrices2({
          newP,
          cantidad_venta: newP.cantidad_venta,
          granel: newP.granel_producto,
          origen: "",
          precio_boolean: true,
          precio: verify_prising.object_prising,
        });

        newP.precio_a_vender = calculo_sumar.totalCalculo;
        newP.precio_anterior = newP.precio_actual_producto;
        newP.precio_actual_producto = verify_prising.pricing;

        // console.log(calculo_sumar);

        newP.iva_total_producto = parseFloat(calculo_sumar.ivaCalculo);
        newP.ieps_total_producto = parseFloat(calculo_sumar.iepsCalculo);
        newP.impuestos_total_producto = parseFloat(
          calculo_sumar.impuestoCalculo
        );
        newP.subtotal_total_producto = parseFloat(
          calculo_sumar.subtotalCalculo
        );
        newP.total_total_producto = parseFloat(calculo_sumar.totalCalculo);

        // console.log(newP);

        newP.precio_actual_object = {
          cantidad_unidad: verify_prising.object_prising.cantidad_unidad
            ? verify_prising.object_prising.cantidad_unidad
            : null,
          numero_precio: verify_prising.object_prising.numero_precio
            ? verify_prising.object_prising.numero_precio
            : null,
          unidad_maxima: verify_prising.object_prising.unidad_maxima
            ? verify_prising.object_prising.unidad_maxima
            : null,
          precio_general: verify_prising.object_prising.precio_general
            ? verify_prising.object_prising.precio_general
            : null,
          precio_neto: verify_prising.object_prising.precio_neto
            ? verify_prising.object_prising.precio_neto
            : null,
          precio_venta: verify_prising.object_prising.precio_venta
            ? verify_prising.object_prising.precio_venta
            : null,
          iva_precio: verify_prising.object_prising.iva_precio
            ? verify_prising.object_prising.iva_precio
            : null,
          ieps_precio: verify_prising.object_prising.ieps_precio
            ? verify_prising.object_prising.ieps_precio
            : null,
          utilidad: verify_prising.object_prising.utilidad
            ? verify_prising.object_prising.utilidad
            : null,
          porciento: verify_prising.object_prising.porciento
            ? verify_prising.object_prising.porciento
            : null,
          dinero_descontado: verify_prising.object_prising.dinero_descontado
            ? verify_prising.object_prising.dinero_descontado
            : null,
        };

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(calculo_resta.subtotalCalculo) +
            calculo_sumar.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(calculo_resta.totalCalculo) +
            calculo_sumar.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(calculo_resta.impuestoCalculo) +
            calculo_sumar.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(calculo_resta.ivaCalculo) +
            calculo_sumar.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(calculo_resta.iepsCalculo) +
            calculo_sumar.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(calculo_resta.descuentoCalculo) +
            calculo_sumar.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(calculo_resta.monederoCalculo) +
            calculo_sumar.monederoCalculo,
        };
      } else {
        // console.log("Entro");
        const productoPrecioFinal = newP.descuento_activo
          ? newP.descuento.precio_neto
          : newP.precio_unidad.precio_neto;

        const new_prices = await calculatePrices2({
          newP,
          cantidad: 0,
          granel: granelBase,
          origen: "Ventas2",
        });

        new_prices.newP.precio_actual_producto = productoPrecioFinal;

        // console.log(new_prices);

        new_prices.newP.iva_total_producto =
          parseFloat(new_prices.ivaCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.ieps_total_producto =
          parseFloat(new_prices.iepsCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.impuestos_total_producto =
          parseFloat(new_prices.impuestoCalculo) *
          parseFloat(newP.cantidad_venta);
        new_prices.newP.subtotal_total_producto =
          parseFloat(new_prices.subtotalCalculo) *
          parseFloat(newP.cantidad_venta);
        new_prices.newP.total_total_producto =
          parseFloat(new_prices.totalCalculo) * parseFloat(newP.cantidad_venta);

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          new_prices.newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) +
            parseFloat(new_prices.subtotalCalculo),
          total: parseFloat(venta_existente.total) + new_prices.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) + new_prices.impuestoCalculo,
          iva: parseFloat(venta_existente.iva) + new_prices.ivaCalculo,
          ieps: parseFloat(venta_existente.ieps) + new_prices.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) + new_prices.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) + new_prices.monederoCalculo,
        };
      }
    }

    localStorage.setItem(
      "DatosVentas",
      JSON.stringify({
        ...CalculosData,
        cliente:
          venta_actual.venta_cliente === true ? venta_actual.cliente : {},
        venta_cliente:
          venta_actual.venta_cliente === true
            ? venta_actual.venta_cliente
            : false,
        productos: productosVentasTemp,
      })
    );
    setDatosVentasActual({
      ...CalculosData,
    });
    setUpdateTablaVentas(!updateTablaVentas);
    handleClickOpen();
  };

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso}
      >
        <Box>
          <Box>
            <FcSearch style={{ fontSize: 45 }} />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Productos</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + P</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Buscar productos</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
              size="large"
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              variant="outlined"
              placeholder="Buscar producto"
              name="producto"
              size="small"
              fullWidth
              onChange={obtenerDatos}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <InformacionProducto productoSeleccionado={productoSeleccionado} />
          <Grid>
            <ListaProductos
              productosBusqueda={productosBusqueda}
              setProductoSeleccionado={setProductoSeleccionado}
              loading={loading}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => agregarProductos(productoSeleccionado)}
            variant="contained"
            color="primary"
            size="large"
          >
            AGREGAR
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
