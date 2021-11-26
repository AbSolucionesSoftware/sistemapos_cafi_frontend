import React, { createContext, useState } from "react";
import moment from "moment";

export const FacturacionCtx = createContext();

export const FacturacionProvider = ({ children }) => {
  const [datosFactura, setDatosFactura] = useState({
    rfc_empresa: "",
    razon_social_empresa: "",
    regimen_fiscal_empresa: "",
    tipo_factura: "",
    cliente: "",
    uso_cfdi: "",
    fecha_expedicion: moment().format('LL'),
    codigo_postal: "",
    moneda: "",
    forma_pago: "",
    metodo_pago: "",
    serie: "",
    folio: "",
    tipo_relacion: "",
    folio_cfdi_relacion: "",
    subtotal: "",
    impuestos: "",
    total: "",
    concepto: [],
    articulos: []
  });

  return (
    <FacturacionCtx.Provider
      value={{
        datosFactura,
        setDatosFactura
      }}
    >
      {children}
    </FacturacionCtx.Provider>
  );
};
