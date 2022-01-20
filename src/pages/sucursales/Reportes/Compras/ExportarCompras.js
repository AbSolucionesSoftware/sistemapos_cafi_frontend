import React from "react";
import { Button } from "@material-ui/core";
import { RiFileExcel2Line } from "react-icons/ri";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { formaPago } from "../../Facturacion/catalogos";

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarCompras({ data }) {
  const compras = data.map((compra) => {
    const {
      producto,
      fecha_registro,
      almacen,
      proveedor,
      color,
      medida,
      cantidad,
      unidad,
      unidad_regalo,
      cantidad_regalo,
      cantidad_total,
      compra_credito,
      costo,
      descuento_porcentaje,
      descuento_precio,
      iva_precio,
      ieps_precio,
      subtotal,
      impuestos,
      total,
    } = compra;
    const forma_pago_filtrada = formaPago.filter(
      (forma) => forma.Value === compra.forma_pago
    );
    const forma_pago = forma_pago_filtrada[0];

    const compra_realizada = {
      producto: producto.datos_generales.nombre_comercial,
      fecha_registro: formatoFechaCorta(fecha_registro),
      almacen: almacen.nombre_almacen,
      proveedor: proveedor.nombre_cliente,
      color: color ? color.color : "N/A",
      medida: medida ? `${medida.medida}/${medida.tipo}` : "N/A",
      cantidad,
      unidad,
      unidad_regalo,
      cantidad_regalo,
      cantidad_total,
      compra_credito: compra_credito === true ? "Credito" : "Contado",
      forma_pago: `${forma_pago.Value} - ${forma_pago.Name}`,
      costo: `$${costo ? formatoMexico(costo) : 0}`,
      descuento_porcentaje: `%${descuento_porcentaje}`,
      descuento_precio: `$${
        descuento_precio ? formatoMexico(descuento_precio) : 0
      }`,
      iva_precio: `$${ieps_precio ? formatoMexico(ieps_precio) : 0}`,
      subtotal: `$${subtotal ? formatoMexico(subtotal) : 0}`,
      impuestos: `$${impuestos ? formatoMexico(impuestos) : 0}`,
      total: `$${total ? formatoMexico(total) : 0}`,
    };

    return compra_realizada;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<RiFileExcel2Line />}>
          Exportar a Excel
        </Button>
      }
      filename="Reporte de compras"
    >
      <ExcelSheet data={compras} name="Reporte de compras">
        <ExcelColumn label="Producto" value="producto" />
        <ExcelColumn label="Fecha de compra" value="fecha_registro" />
        <ExcelColumn label="Almacen" value="almacen" />
        <ExcelColumn label="Proveedor" value="proveedor" />
        <ExcelColumn label="Color" value="color" />
        <ExcelColumn label="Medida" value="medida" />
        <ExcelColumn label="Cantidad" value="cantidad" />
        <ExcelColumn label="Unidad" value="unidad" />
        <ExcelColumn label="Unidad de Regalo" value="unidad_regalo" />
        <ExcelColumn label="Cantidad de Regalo" value="cantidad_regalo" />
        <ExcelColumn label="Cantidad Total" value="cantidad_total" />
        <ExcelColumn label="Metodo de Pago" value="compra_credito" />
        <ExcelColumn label="Forma de pago" value="forma_pago" />
        <ExcelColumn label="Costo" value="costo" />
        <ExcelColumn
          label="Descuento en Porcentaje"
          value="descuento_porcentaje"
        />
        <ExcelColumn label="Descuento en Cantidad" value="descuento_precio" />
        <ExcelColumn label="IVA" value="iva_precio" />
        <ExcelColumn label="IEPS" value="ieps_precio" />
        <ExcelColumn label="Subtotal" value="subtotal" />
        <ExcelColumn label="Impuestos" value="impuestos" />
        <ExcelColumn label="Total" value="total" />
      </ExcelSheet>
    </ExcelFile>
  );
}
