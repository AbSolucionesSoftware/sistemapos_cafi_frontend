import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useContext,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import EliminarProductoVenta from "./EliminarProductoVenta";

import { useDebounce } from "use-debounce";
import {
  findProductArray,
  verifiPrising,
  calculatePrices2,
  formatoMexico,
} from "../../config/reuserFunctions";
import { VentasContext } from "../../context/Ventas/ventasContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "100%",
    maxHeight: "59vh",
    "& ::-webkit-scrollbar": {
      display: "none",
    },
    [theme.breakpoints.up("xl")]: {
      maxHeight: "64vh",
    },
  },
}));

export default function EnhancedTable({ setDatosVentasActual }) {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  /* const sesion = JSON.parse(localStorage.getItem("sesionCafi")); */

  const {
    setProductoCambioPrecio,
    setPrecioSelectProductoVenta,
    updateTablaVentas,
    setUpdateTablaVentas,
  } = useContext(VentasContext);

  const [datosTabla, setDatosTabla] = useState([]);

  useEffect(() => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    setDatosTabla(venta === null ? [] : venta.productos);
  }, [updateTablaVentas]);

  const handleClick = (name) => {
    if (name.unidad === "Caja" || name.unidad === "Costal") return;
    let newSelected = [];
    const exist = selected.indexOf(name) !== -1;
    if (exist) {
      newSelected = [];
      setPrecioSelectProductoVenta([]);
      setProductoCambioPrecio({});
      setSelected(newSelected);
      return;
    }
    newSelected = newSelected.concat([], name);
    const producto = name.id_producto.precios.precios_producto.filter(
      (p) => p.precio_neto === name.precio_actual_producto
    );
    if (producto.length > 0) setPrecioSelectProductoVenta(producto);
    setProductoCambioPrecio(name);
    setSelected(newSelected);
  };

  const TwoClickInRowTableBuy = (e, producto) => {
    try {
      /* let timer;
      clearTimeout(timer); */
      if (e.detail === 2) {
        handleClick(producto);
        /* setProductoCambioPrecio(producto); */
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isSelected = (name) => {
    return selected.indexOf(name) !== -1;
  };

  return (
    <div className={classes.root}>
      <Paper>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            size="small"
            aria-labelledby="tableTitle"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell style={{ textAlign: "center", width: 120 }}>
                  Valor Granel
                </TableCell>
                <TableCell style={{ textAlign: "center" }} padding="checkbox">
                  Cantidad
                </TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell style={{ textAlign: "center" }} padding="checkbox">
                  Existencia
                </TableCell>
                <TableCell style={{ textAlign: "center" }} padding="checkbox">
                  <b>Descuento</b>
                </TableCell>
                <TableCell style={{ textAlign: "center" }} padding="checkbox">
                  Receta
                </TableCell>
                <TableCell style={{ textAlign: "center" }} padding="checkbox">
                  Unidad
                </TableCell>
                <TableCell style={{ width: 140, textAlign: "center" }}>
                  Precio Unitario
                </TableCell>
                <TableCell style={{ width: 140, textAlign: "center" }}>
                  Precio a vender
                </TableCell>
                <TableCell padding="checkbox" />
              </TableRow>
            </TableHead>
            <TableBody>
              {datosTabla.map((producto, index) => {
                const isItemSelected = isSelected(producto);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <RenderTableRows
                    key={index}
                    producto={producto}
                    setUpdateTablaVentas={setUpdateTablaVentas}
                    updateTablaVentas={updateTablaVentas}
                    setDatosVentasActual={setDatosVentasActual}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                    selected={selected}
                    TwoClickInRowTableBuy={TwoClickInRowTableBuy}
                    setSelected={setSelected}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const RenderTableRows = ({
  producto,
  setUpdateTablaVentas,
  updateTablaVentas,
  setDatosVentasActual,
  TwoClickInRowTableBuy,
  handleClick,
  isItemSelected,
  labelId,
  setSelected,
  selected,
}) => {
  // const [actuallyProduct, setActuallyProduct] = useState(producto);
  const [newCantidadProduct, setNewCantidadProduct] = useState(
    producto.cantidad_venta
  );

  const [tempAmount, setTempAmount] = useState(producto.cantidad_venta);

  const textfield = useRef(null);
  const [value] = useDebounce(newCantidadProduct, 500);

  useEffect(() => {
    setTempAmount(producto.cantidad_venta);
  }, [producto.cantidad_venta]);

  useEffect(() => {
    CalculeDataPricing(value);
  }, [value]);

  const calculateNewPricingAmount = (cantidad) => {
    if (producto.concepto === "medidas") {
      if (cantidad > producto.cantidad) return;
    } else {
      if (cantidad > producto.inventario_general[0].cantidad_existente) return;
    }
    try {
      setTempAmount(cantidad);
      setNewCantidadProduct(cantidad);
    } catch (error) {
      return false;
    }
  };

  const CalculeDataPricing = async (new_cant) => {
    if (new_cant === "" || new_cant === 0) {
      setTempAmount(producto.cantidad_venta);
    } else {
      let venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let productosVentas = venta === null ? [] : venta.productos;
      const venta_actual = venta === null ? [] : venta;
      let productosVentasTemp = productosVentas;
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

      let CalculosData = {};

      //Buscar y obtener ese producto en el array de ventas
      const producto_encontrado = await findProductArray(producto);

      if (producto_encontrado.found) {
        const {
          cantidad_venta,
          ...newP
        } = producto_encontrado.producto_found.producto;
        newP.cantidad_venta = parseInt(new_cant);
        const verify_prising = await verifiPrising(newP);
        const newPrising = verify_prising.found
          ? verify_prising.object_prising
          : newP.precio_actual_object;

        const new_resta = await calculatePrices2({
          newP,
          cantidad: cantidad_venta,
          precio_boolean: true,
          precio: newP.precio_actual_object,
          granel: newP.granel_producto,
          origen: "Tabla",
        });
        const new_suma = await calculatePrices2({
          newP,
          cantidad: parseInt(new_cant),
          precio_boolean: true,
          precio: newPrising,
          granel: newP.granel_producto,
          origen: "Tabla",
        });

        newP.iva_total_producto = parseFloat(new_suma.ivaCalculo);
        newP.ieps_total_producto = parseFloat(new_suma.iepsCalculo);
        newP.impuestos_total_producto = parseFloat(new_suma.impuestoCalculo);
        newP.subtotal_total_producto = parseFloat(new_suma.subtotalCalculo);
        newP.total_total_producto = parseFloat(new_suma.totalCalculo);

        if (verify_prising.found) {
          newP.precio_a_vender = new_suma.totalCalculo;
          newP.precio_anterior = newP.precio_actual_porducto;
          newP.precio_actual_producto = verify_prising.pricing;
          newP.precio_actual_object = verify_prising.object_prising;

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
        } else {
          newP.cantidad_venta = parseInt(new_cant);
          newP.precio_anterior = newP.precio_actual_producto;
          newP.precio_a_vender = new_suma.totalCalculo;
        }

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(new_resta.subtotalCalculo) +
            new_suma.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(new_resta.totalCalculo) +
            new_suma.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(new_resta.impuestoCalculo) +
            new_suma.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(new_resta.ivaCalculo) +
            new_suma.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(new_resta.iepsCalculo) +
            new_suma.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(new_resta.descuentoCalculo) +
            new_suma.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(new_resta.monederoCalculo) +
            new_suma.monederoCalculo,
        };
      } else {
        console.log("El producto no existe");
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
          tipo_emision: venta_actual.tipo_emision
            ? venta_actual.tipo_emision
            : "TICKET",
        })
      );
      setDatosVentasActual(CalculosData);
      //Recargar la tabla de los productos
      setUpdateTablaVentas(!updateTablaVentas);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        style={{ height: "15px" }}
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={producto._id}
        selected={isItemSelected}
        hover
        onClick={(e) => TwoClickInRowTableBuy(e, producto)}
      >
        <TableCell padding="checkbox">
          <Checkbox
            onClick={(event) => {
              if (selected.length > 0) setSelected([]);
              handleClick(producto);
            }}
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell style={{ textAlign: "center" }} padding="checkbox">
          {producto.granel_producto.granel
            ? `${producto.granel_producto.valor} ${producto.unidad}`
            : "N/A"}
        </TableCell>
        <TableCell>
          <Input
            inputRef={textfield}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => calculateNewPricingAmount(e.target.value)}
            value={tempAmount}
            type="number"
            name="cantidad_venta"
            inputProps={{
              min: 1,
              max:
                producto.concepto === "medidas"
                  ? producto.cantidad
                  : producto.inventario_general.map(
                      (existencia) => `${existencia.cantidad_existente}`
                    ),
            }}
          />
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.nombre_comercial}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {producto.id_producto.datos_generales.tipo_producto === "OTROS"
            ? producto.unidad === "Costal" || producto.unidad === "Caja"
              ? producto.inventario_general[0].cantidad_existente_maxima
              : producto.inventario_general[0].cantidad_existente
            : producto.cantidad}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          %{" "}
          {producto.precio_actual_object.porciento !== null
            ? producto.precio_actual_object.porciento
            : 0}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {producto.id_producto.datos_generales.receta_farmacia === true
            ? "Si"
            : "No"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>{producto.unidad}</TableCell>
        <TableCell style={{ textAlign: "center" }}>
          ${" "}
          {producto.precio_actual_object.precio_neto
            ? formatoMexico(producto.precio_actual_object.precio_neto)
            : 0}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          ${" "}
          {producto.precio_a_vender
            ? formatoMexico(producto.precio_a_vender)
            : 0}
        </TableCell>
        <TableCell>
          <EliminarProductoVenta
            producto={producto}
            setDatosVentasActual={setDatosVentasActual}
          />
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
