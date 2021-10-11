import React, { useEffect, useState, Fragment, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import EliminarProductoVenta from "./EliminarProductoVenta";
import { useDebounce } from "use-debounce";
import { findProductArray, calculateTaxes } from "../../config/reuserFunctions";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "52vh",
  },
});

export default function TablaVentas({
  newProductoVentas,
  setNewProductoVentas,
  setDatosVentasActual,
}) {
  const classes = useStyles();
  const [datosTabla, setDatosTabla] = useState([]);

  useEffect(() => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    setDatosTabla(venta === null ? [] : venta.produtos);
  }, [newProductoVentas]);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 25 }}>Cantidad</TableCell>
              <TableCell style={{ width: 330 }}>Descripcion</TableCell>
              <TableCell style={{ width: 100 }}>Existencias</TableCell>
              <TableCell style={{ width: 100 }}>% Desc</TableCell>
              <TableCell style={{ width: 100 }}>Receta</TableCell>
              <TableCell style={{ width: 100 }}>U. Venta</TableCell>
              <TableCell style={{ width: 100 }}>Precio U</TableCell>
              <TableCell key={1} align="center" style={{ width: 35 }}>
                Eliminar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosTabla.map((producto, index) => {
              return (
                <RenderTableRows
                  key={index}
                  producto={producto}
                  setNewProductoVentas={setNewProductoVentas}
                  newProductoVentas={newProductoVentas}
                  setDatosVentasActual={setDatosVentasActual}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RenderTableRows = ({
  producto,
  setNewProductoVentas,
  newProductoVentas,
  setDatosVentasActual,
}) => {
  // const [actuallyProduct, setActuallyProduct] = useState(producto);
  const [newCantidadProduct, setNewCantidadProduct] = useState(
    producto.cantidad_venta
  );
  const textfield = useRef(null);
  const [value] = useDebounce(newCantidadProduct, 500);

  useEffect(() => {
    setNewCantidadProduct(producto.cantidad_venta);
  }, [producto.cantidad_venta]);

  useEffect(() => {
    CalculeDataPricing(value);
  }, [value]);

  const CalculeDataPricing = async (new_cant) => {
    if (new_cant === "") {
      setNewCantidadProduct(producto.cantidad_venta);
    } else {
      // console.log(new_cant);
      //Obtener el array de ventas
      let venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let productosVentas = venta === null ? [] : venta.produtos;
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
            }
          : venta;
      //Calculos de impuestos que se van a restar de la venta;
      let calculoResta = {};
      //Calculos de impuestos que se van a sumar a la venta
      let calculoSuma = {};
      //Buscar y obtener ese producto en el array de ventas
      const producto_encontrado = await findProductArray(
        productosVentas,
        producto
      );

      if (producto_encontrado.found) {
        const { cantidad_venta, ...newP } =
          producto_encontrado.producto_found.producto;
        //Sacar los impuestos que se van a restar
        calculoResta = await calculateTaxes(newP, cantidad_venta, newP.granelProducto);
        // console.log(calculoResta);
        //Sacar los impuestos que se van a sumar
        calculoSuma = await calculateTaxes(newP, new_cant, newP.granelProducto);
        newP.cantidad_venta = parseInt(new_cant);
        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );
        // console.log(calculoSuma);
      } else {
        console.log("El producto no existe");
      }
      //Crear copia y guardar los impuestos a sumar
      const CalculosData = {
        subTotal: 
          parseFloat(venta_existente.subTotal) -
          parseFloat(calculoResta.subtotalCalculo) +
          calculoSuma.subtotalCalculo
        ,
        total: 
          parseFloat(venta_existente.total) -
          parseFloat(calculoResta.totalCalculo) +
          calculoSuma.totalCalculo
        ,
        impuestos: 
          parseFloat(venta_existente.impuestos) -
          parseFloat(calculoResta.impuestoCalculo) +
          calculoSuma.impuestoCalculo
        ,
        iva: 
          parseFloat(venta_existente.iva) -
          parseFloat(calculoResta.ivaCalculo) +
          calculoSuma.ivaCalculo
        ,
        ieps: 
          parseFloat(venta_existente.ieps) -
          parseFloat(calculoResta.iepsCalculo) +
          calculoSuma.iepsCalculo,
        descuento: 
          parseFloat(venta_existente.descuento) -
          parseFloat(calculoResta.descuentoCalculo) +
          calculoSuma.descuentoCalculo,
      };
      localStorage.setItem("DatosVentas", JSON.stringify({
        ...CalculosData,
        produtos: productosVentasTemp,
      }));
      setDatosVentasActual(CalculosData);
      //Recargar la tabla de los productos
      setNewProductoVentas(!newProductoVentas);
    }
  };

  return (
    <Fragment>
      <TableRow hover>
        <TableCell>
          <Input
            inputRef={textfield}
            onChange={(e) => setNewCantidadProduct(e.target.value)}
            value={newCantidadProduct}
            type="number"
            name="cantidad_venta"
          />
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.nombre_comercial}
        </TableCell>
        <TableCell>
          {producto.inventario_general.map(
            (existencia) => `${existencia.cantidad_existente}`
          )}
        </TableCell>
        <TableCell>
          %{" "}
          {producto.descuento_activo === true
            ? producto.descuento.porciento
            : 0}
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.receta_farmacia === true
            ? "Si"
            : "No"}
        </TableCell>
        <TableCell>
          {producto.inventario_general.map(
            (existencia) => `${existencia.unidad_inventario}`
          )}
        </TableCell>
        <TableCell>$ {producto.precio}</TableCell>
        <TableCell>
          <EliminarProductoVenta 
            producto={producto}
            setNewProductoVentas={setNewProductoVentas}
            newProductoVentas={newProductoVentas}
            setDatosVentasActual={setDatosVentasActual}
          />
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
