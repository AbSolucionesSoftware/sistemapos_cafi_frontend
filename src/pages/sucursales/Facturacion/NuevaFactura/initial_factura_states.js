const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

export const factura_initial_state = {
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
  }