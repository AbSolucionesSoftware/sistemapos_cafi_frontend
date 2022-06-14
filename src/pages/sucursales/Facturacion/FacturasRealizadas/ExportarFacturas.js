import React from "react";
import { Button } from "@material-ui/core";
import { RiFileExcel2Line } from "react-icons/ri";
import {
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { formaPago } from "../catalogos";

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarFacturas({ data }) {

  const facturas = data.map((factura) => {
    const {
      serie,
      folio,
      folio_venta,
      fecha_registro,
      expedition_place,
      cfdi_type,
      payment_form,
      payment_method,
      issuer,
      receiver,
      taxes,
      complement,
      sub_total,
      total,
      discount,
    } = factura;

    const iva = taxes.filter(res => res.Name === "IVA");
    const ieps = taxes.filter(res => res.Name === "IEPS");

    const factura_realizada = {
      serie,
      folio,
      folio_venta,
      fecha_registro,
      expedition_place,
      cfdi_type,
      payment_form,
      payment_method,
      issuer: issuer.TaxName,
      receiver: receiver.Name,
      iva: iva.length ? iva[0].Total : 0,
      ieps: ieps.length ? ieps[0].Total: 0,
      satCertNumber: complement.TaxStamp.SatCertNumber,
      sub_total: formatoMexico(sub_total),
      total: formatoMexico(total),
      discount: formatoMexico(discount),
    };

    return factura_realizada;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<RiFileExcel2Line />}>
          Exportar
        </Button>
      }
      filename="Reporte de compras"
    >
      <ExcelSheet data={facturas} name="Reporte de compras">
        <ExcelColumn label="Serie" value="serie" />
        <ExcelColumn label="Folio" value="folio" />
        <ExcelColumn label="Folio de venta" value="folio_venta" />
        <ExcelColumn label="Fecha" value="fecha_registro" />
        <ExcelColumn label="Lugar de Expedición" value="expedition_place" />
        <ExcelColumn label="tipo de CFDI" value="cfdi_type" />
        <ExcelColumn label="Metodo de Pago" value="payment_method" />
        <ExcelColumn label="Forma de pago" value="payment_form" />
        <ExcelColumn label="Emisor" value="issuer" />
        <ExcelColumn label="Receptor" value="receiver" />
        <ExcelColumn label="IVA" value="iva" />
        <ExcelColumn label="IEPS" value="ieps" />
        <ExcelColumn label="Num. Certificado SAT" value="satCertNumber" />
        <ExcelColumn label="Descuento" value="discount" />
        <ExcelColumn label="Subtotal" value="sub_total" />
        <ExcelColumn label="Total" value="total" />
      </ExcelSheet>
    </ExcelFile>
  );
}
