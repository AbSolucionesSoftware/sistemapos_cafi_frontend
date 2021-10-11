export const numerosRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const formatoHora = (hora) => {
  if (!hora) {
    return null;
  } else {
    var newtime = new Date(hora);
    return newtime.toLocaleTimeString("en-US", { hour12: "false" });
  }
};

export const formatoFecha = (fecha) => {
  if (!fecha) {
    return null;
  } else {
    var newdate = new Date(fecha);
    return newdate.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const formatoMexico = (number) => {
  if (!number) {
    return null;
  } else {
    let nueva;
    if (number % 1 === 0) {
      nueva = number;
    } else {
      nueva = parseFloat(number).toFixed(2);
    }
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1,";
    return nueva.toString().replace(exp, rep);
  }
};

export const cleanTypenames = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanTypenames);
  } else if (value !== null && typeof value === "object") {
    const newObject = {};
    for (const property in value)
      if (property !== "__typename")
        newObject[property] = cleanTypenames(value[property]);
    return newObject;
  } else {
    return value;
  }
};

export const findProductArray = async (productosVentas, producto) => {
  try {
    let found = false;
    let producto_found = {
      producto: {},
      index: 0,
    };

    for (let i = 0; i < productosVentas.length; i++) {
      if (typeof productosVentas[i].codigo_barras !== "undefined") {
        if (
          productosVentas[i].id_producto.datos_generales.clave_alterna ===
            producto.id_producto.datos_generales.clave_alterna ||
          productosVentas[i].codigo_barras === producto.codigo_barras
        ) {
          producto_found = {
            producto: productosVentas[i],
            index: i,
          };
          found = true;
        }
      } else {
        if (
          productosVentas[i].id_producto.datos_generales.clave_alterna ===
          producto.id_producto.datos_generales.clave_alterna
        ) {
          producto_found = {
            producto: productosVentas[i],
            index: i,
          };
          found = true;
        }
      }
    }

    return {
      producto_found,
      found,
    };
  } catch (error) {
    return false;
  }
};

export const calculateTaxes = async (newP, cantidad, granel) => {
  console.log(newP);
  let subtotalCalculo = 0,
    totalCalculo = 0,
    impuestoCalculo = 0,
    ivaCalculo = 0,
    iepsCalculo = 0,
    descuentoCalculo = 0;

  const cantidadNueva = cantidad > 0 ? cantidad : 1;

  const iva_producto =
    parseFloat(
      newP.id_producto.precios.unidad_de_compra.precio_unitario_sin_impuesto
    ) * parseFloat(`0.${newP.id_producto.precios.iva}`);
  const ieps_producto =
    parseFloat(
      newP.id_producto.precios.unidad_de_compra.precio_unitario_sin_impuesto
    ) * parseFloat(`0.${newP.id_producto.precios.ieps}`);

    totalCalculo =
      granel.granel === true
        ? newP.descuento_activo === true
          ? parseFloat(newP.descuento.precio_con_descuento) *
            cantidadNueva *
            parseFloat(granel.valor)
          : parseFloat(newP.precio) * cantidadNueva * parseFloat(granel.valor)
        : newP.descuento_activo === true
        ? parseFloat(newP.descuento.precio_con_descuento) * cantidadNueva
        : parseFloat(newP.precio) * cantidadNueva;

    subtotalCalculo =
      granel.granel === true
        ? newP.descuento_activo === true
          ? (parseFloat(newP.descuento.precio_con_descuento) -
              (iva_producto + ieps_producto)) *
            cantidadNueva *
            parseFloat(granel.valor)
          : (parseFloat(newP.precio) - (iva_producto + ieps_producto)) *
            cantidadNueva *
            parseFloat(granel.valor)
        : newP.descuento_activo === true
        ? (parseFloat(newP.descuento.precio_con_descuento) -
            (iva_producto + ieps_producto)) *
          cantidadNueva
        : (parseFloat(newP.precio) - (iva_producto + ieps_producto)) *
          cantidadNueva;

    impuestoCalculo =
      granel.granel === true
        ? (iva_producto + ieps_producto) *
          cantidadNueva *
          parseFloat(granel.valor)
        : (iva_producto + ieps_producto) * cantidadNueva;

    ivaCalculo =
      granel.granel === true
        ? iva_producto * cantidadNueva * parseFloat(granel.valor)
        : iva_producto * cantidadNueva;

    iepsCalculo =
      granel.granel === true
        ? ieps_producto * cantidadNueva * parseFloat(granel.valor)
        : ieps_producto * cantidadNueva;

    descuentoCalculo =
      granel.granel === true
        ? newP.descuento_activo === true
          ? parseFloat(newP.descuento.dinero_descontado) *
            cantidadNueva *
            parseFloat(granel.valor)
          : 0
        : newP.descuento_activo === true
        ? parseFloat(newP.descuento.dinero_descontado) *
          cantidadNueva
        : 0;
        

  return {
    totalCalculo,
    subtotalCalculo,
    impuestoCalculo,
    ivaCalculo,
    iepsCalculo,
    descuentoCalculo,
  };
};
