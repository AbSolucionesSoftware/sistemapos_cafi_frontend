import React, { createContext, useState } from "react";

export const FacturacionCtx = createContext();

export const FacturacionProvider = ({ children }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [datosFactura, setDatosFactura] = useState({
    serie: "",
    currency: "",
    expedition_place: "",
    folio: "",
    cfdi_type: "",
    payment_form: "",
    payment_method: "",
    logo_url: sesion.imagen,
    date: "0",
    issuer: {
      FiscalRegime: sesion.empresa.regimen_fiscal,
      Rfc: sesion.empresa.rfc,
      Name: sesion.empresa.nombre_fiscal,
    },
    receiver: {
      Rfc: "",
      Name: "",
      CfdiUse: "",
    },
    items: [],
    empresa: sesion.empresa._id,
    sucursal: sesion.sucursal._id,
  });

  const [productoFactura, setProductoFactura] = useState([]);

  const [cp_valido, setCPValido] = useState(false);
  const [codigo_postal, setCodigoPostal] = useState("");
  const [error_validation, setError] = useState({ status: false, message: "" });

  return (
    <FacturacionCtx.Provider
      value={{
        datosFactura,
        setDatosFactura,
        cp_valido,
        setCPValido,
        codigo_postal,
        setCodigoPostal,
        error_validation,
        setError,
      }}
    >
      {children}
    </FacturacionCtx.Provider>
  );
};
