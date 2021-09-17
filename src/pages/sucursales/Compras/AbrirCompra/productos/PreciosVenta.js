import React, { useCallback, useContext, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";

export default function PreciosDeVentaCompras() {
  const { preciosVenta } = useContext(ComprasContext);

  return (
    <div>
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 150 }}>Precios de venta</TableCell>
              {[1, 2, 3, 4, 5, 6].map((numero, index) => (
                <TableCell style={{ minWidth: 100 }} key={index}>
                  {numero}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {["Utilidad", "Precio de venta"].map((tipo, index) => (
              <TableRow key={index}>
                <TableCell style={{ border: 0 }}>
                  <b>{tipo}</b>
                </TableCell>
                {preciosVenta.map((data, index) => (
                  <RenderPrecios
                    key={index}
                    data={data}
                    index={index}
                    tipo={tipo}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const RenderPrecios = ({ data, tipo, index }) => {
  const { precios } = useContext(RegProductoContext);
  const { preciosVenta, datosProducto } = useContext(ComprasContext);

  const [precio_neto, setPrecioNeto] = useState(data.precio_neto);

  //creamos variables para trabajar con ellas, no causar errores y afectar las originales
  let copy_preciosVenta = { ...preciosVenta[index] };

  let precio_unitario_con_impuesto =
    datosProducto.costo / datosProducto.cantidad;
  let precio_unitario_sin_impuesto =
    precios.precio_de_compra.precio_sin_impuesto / datosProducto.cantidad;

  if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
  if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;

  const calculos = useCallback(() => {
    if (copy_preciosVenta.numero_precio === data.numero_precio) {
      if (!precios.iva_activo && !precios.ieps_activo) {
        copy_preciosVenta.precio_neto = precio_unitario_sin_impuesto;
        setPrecioNeto(precio_unitario_sin_impuesto);
      } else {
        copy_preciosVenta.precio_neto = precio_unitario_con_impuesto;
        setPrecioNeto(precio_unitario_con_impuesto);
      }

      let verificacion_entero = false;
      let new_utilidad = 0;
      new_utilidad = data.utilidad;

      if (parseFloat(data.utilidad) < 10)
        new_utilidad = "0" + data.utilidad.toString().replace(/[.]/g, "");
      if (data.utilidad > 99) {
        new_utilidad = data.utilidad / 100;
        verificacion_entero = true;
      }

      if (!verificacion_entero) {
        new_utilidad = "." + new_utilidad.toString().replace(/[.]/g, "");
      } else {
        new_utilidad = parseFloat(new_utilidad);
      }

      const ganancia_utilidad_sin_impuestos =
        precio_unitario_sin_impuesto +
        precio_unitario_sin_impuesto * new_utilidad;

      copy_preciosVenta.precio_venta = parseFloat(
        ganancia_utilidad_sin_impuestos.toFixed(2)
      );

      if (precios.iva_activo || precios.ieps_activo) {
        const ganancia_utilidad_con_impuestos =
          precio_unitario_con_impuesto +
          precio_unitario_con_impuesto * new_utilidad;

        copy_preciosVenta.precio_neto = parseFloat(
          ganancia_utilidad_con_impuestos.toFixed(2)
        );

        setPrecioNeto(parseFloat(ganancia_utilidad_con_impuestos.toFixed(2)));
      } else {
        copy_preciosVenta.precio_neto = parseFloat(
          ganancia_utilidad_sin_impuestos.toFixed(2)
        );
        setPrecioNeto(parseFloat(ganancia_utilidad_sin_impuestos.toFixed(2)));
      }
      preciosVenta.slice(index, 1, copy_preciosVenta);
    }
  }, [datosProducto.costo, datosProducto.cantidad]);

  useEffect(() => {
    calculos();
  }, [calculos]);

  switch (tipo) {
    case "Utilidad":
      return <TableCell style={{ border: 0 }}>{data.utilidad}%</TableCell>;
    case "Precio de venta":
      return <TableCell style={{ border: 0 }}>${precio_neto}</TableCell>;
    default:
      return null;
  }
};
