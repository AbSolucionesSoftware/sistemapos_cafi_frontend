import React, { createContext, useState } from "react";
import moment from "moment";

export const FacturacionCtx = createContext();

export const FacturacionProvider = ({ children }) => {
  const [datosFactura, setDatosFactura] = useState({
    serie: "",
    currency: "",
    expedition_place: "",
    folio: "",
    cfdi_type: "",
    payment_form: "",
    payment_method: "",
    logo_url: "",
    date: moment().format("LL"),
    issuer: {
      FiscalRegime: "",
      Rfc: "",
      Name: "",
    },
    receiver: {
      Rfc: "",
      Name: "",
      CfdiUse: "",
    },
    items: [],
    empresa: "",
    sucursal: "",
  });

  const [productoFactura, setProductoFactura] = useState([]);

  const [cp_valido, setCPValido] = useState(false);

  return (
    <FacturacionCtx.Provider
      value={{
        datosFactura,
        setDatosFactura,
        cp_valido,
        setCPValido,
      }}
    >
      {children}
    </FacturacionCtx.Provider>
  );
};
