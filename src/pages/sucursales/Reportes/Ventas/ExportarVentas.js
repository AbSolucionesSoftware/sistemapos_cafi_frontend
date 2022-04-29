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

export default function ExportarVentas({ data }) {
  const compras = data.map((compra) => {
    const {
      producto,
      fecha_registro,
      color,
      medida,
      cantidad,
      unidad,
      venta_credito,
      descuento_porcentaje,
      descuento_precio,
      iva_total,
      ieps_total,
      subtotal,
      impuestos,
      total,
    } = compra;
    let forma_pago = "";
    if (compra.forma_pago) {
      const forma_pago_filtrada = formaPago.filter(
        (forma) => forma.Value === compra.forma_pago
      );
      forma_pago = forma_pago_filtrada[0];
    }

    const compra_realizada = {
      producto: producto.datos_generales.nombre_comercial,
      fecha_registro: formatoFechaCorta(fecha_registro),
      color: color ? color.color : "N/A",
      medida: medida ? `${medida.medida}/${medida.tipo}` : "N/A",
      cantidad,
      unidad,
      venta_credito: venta_credito === true ? "Credito" : "Contado",
      forma_pago: `${forma_pago.Value} - ${forma_pago.Name}`,
      descuento_porcentaje: `%${
        descuento_porcentaje ? descuento_porcentaje : 0
      }`,
      descuento_precio: `$${
        descuento_precio ? formatoMexico(descuento_precio) : 0
      }`,
      iva_total: `$${iva_total ? formatoMexico(iva_total) : 0}`,
      ieps_total: `$${ieps_total ? formatoMexico(ieps_total) : 0}`,
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
        <ExcelColumn label="Color" value="color" />
        <ExcelColumn label="Medida" value="medida" />
        <ExcelColumn label="Cantidad" value="cantidad" />
        <ExcelColumn label="Unidad" value="unidad" />
        <ExcelColumn label="Metodo de Pago" value="venta_credito" />
        <ExcelColumn label="Forma de pago" value="forma_pago" />
        <ExcelColumn
          label="Descuento en Porcentaje"
          value="descuento_porcentaje"
        />
        <ExcelColumn label="Descuento en Cantidad" value="descuento_precio" />
        <ExcelColumn label="IVA" value="iva_precio" />
        <ExcelColumn label="IEPS" value="ieps_total" />
        <ExcelColumn label="Subtotal" value="subtotal" />
        <ExcelColumn label="Impuestos" value="impuestos" />
        <ExcelColumn label="Total" value="total" />
      </ExcelSheet>
    </ExcelFile>
  );
}
