import React, { createContext, useState } from "react";
import moment from "moment";

export const FacturacionCtx = createContext();

export const FacturacionProvider = ({ children }) => {
  const [datosFactura, setDatosFactura] = useState({
serie: "",
currency: "",
expedition_place: "",
folio: "",





    rfc_empresa: "",
    razon_social_empresa: "",
    regimen_fiscal_empresa: "",
    tipo_factura: "",
    cliente: "",
    uso_cfdi: "",
    fecha_expedicion: moment().format('LL'),
    
    
    forma_pago: "",
    metodo_pago: "",
    
    
    tipo_relacion: "",
    folio_cfdi_relacion: "",
    subtotal: "",
    impuestos: "",
    total: "",
    concepto: [],
    articulos: []
  });
  const [cp_valido, setCPValido] = useState(false);

  return (
    <FacturacionCtx.Provider
      value={{
        datosFactura,
        setDatosFactura,
        cp_valido,
        setCPValido
      }}
    >
      {children}
    </FacturacionCtx.Provider>
  );
};
