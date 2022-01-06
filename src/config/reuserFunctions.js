export const numerosRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateCode = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let found = false;
    let producto_found = {
      producto: {},
      index: 0,
    };

    for (let i = 0; i < productosVentas.length; i++) {
      if (typeof productosVentas[i].codigo_barras !== "undefined") {
        if(productosVentas[i].codigo_barras === producto.codigo_barras){
          producto_found = {
            producto: productosVentas[i],
            index: i,
          };
          found = true;
          return {
            producto_found,
            found,
          };
        }
      } else {
        if (productosVentas[i].id_producto.datos_generales.clave_alterna === producto.id_producto.datos_generales.clave_alterna) {
          producto_found = {
            producto: productosVentas[i],
            index: i,
          };
          found = true;
          return {
            producto_found,
            found,
          }
        }
      }
    }

    return {
      producto_found,
      found,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const calculatePrices = async ( newP, cantidad, granel, newPrising = 0 ) => {

  let subtotalCalculo = 0,
    totalCalculo = 0,
    impuestoCalculo = 0,
    ivaCalculo = 0,
    iepsCalculo = 0,
    descuentoCalculo = 0,
    monederoCalculo = 0;
// console.log("newPrising",newPrising);
  const cantidadNueva = cantidad > 0 ? cantidad : 1;
  console.log(newP.id_producto.precios.precios_producto[0].precio_venta);
  // console.log(newP);
  const iva_producto =
    parseFloat(
      newP.id_producto.precios.precios_producto[0].precio_venta
    ) * parseFloat(`0.${newP.id_producto.precios.iva  < 9 ? `0${newP.id_producto.precios.iva}` : newP.id_producto.precios.iva}`);
  
  const ieps_producto =
    parseFloat(
      newP.id_producto.precios.precios_producto[0].precio_venta
    ) * parseFloat(`0.${newP.id_producto.precios.ieps < 9 ? `0${newP.id_producto.precios.ieps}` : newP.id_producto.precios.ieps}`);

  const precioProducto = newPrising;
    // const precioDescuentoProducto = newP.descuento_activo ? parseFloat(newP.descuento.precio_con_descuento) : 0;

  totalCalculo = granel.granel === true 
      ? precioProducto * cantidadNueva * parseFloat(granel.valor)
      : precioProducto * cantidadNueva;

  subtotalCalculo = granel.granel === true 
      ? (precioProducto - (iva_producto + ieps_producto)) * cantidadNueva * parseFloat(granel.valor) 
      : (precioProducto - (iva_producto + ieps_producto)) * cantidadNueva;

  impuestoCalculo =
      granel.granel === true
        ? (iva_producto + ieps_producto) *
          cantidadNueva *
          parseFloat(granel.valor)
        : (iva_producto + ieps_producto) * cantidadNueva;

        console.log(cantidadNueva);

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

  monederoCalculo = newP.id_producto.precios.monedero ? newP.id_producto.precios.monedero_electronico * cantidadNueva : 0;

  return {
    totalCalculo,
    subtotalCalculo,
    impuestoCalculo,
    ivaCalculo,
    iepsCalculo,
    descuentoCalculo,
    monederoCalculo
  };
};

export const verifiPrising = async (newP) => {
  try {
    if(!newP) return false;
    const amount = newP.cantidad_venta;
    const pricings = newP.id_producto.precios.precios_producto.filter((p) => p.unidad_mayoreo > 0 && p.precio_neto > 0);
 
    let finalPrising = {
      found: false,
      pricing: 0,
      number_pricing: 0
    };
    const datoFinal = pricings.length;
    if(newP.precio_seleccionado) return finalPrising;
    //CONIDICONAR SI EL PRECIO ES MENOR Y MENOR PERO QUE NO SEA MAYOR AL SEGUNDO
    if(amount < newP.id_producto.precios.precios_producto[1].unidad_mayoreo) 
      return finalPrising = {
        found: true,
        pricing: newP.descuento_activo ? newP.descuento.precio_con_descuento : newP.id_producto.precios.precios_producto[0].precio_neto,
        number_pricing: newP.id_producto.precios.precios_producto[0].numero_precio
      };

    for (let i = 0; i < pricings.length; i++) {
      if(i + 1 === datoFinal && amount >= pricings[i].unidad_mayoreo) 
        return finalPrising = {found: true,pricing: pricings[i].precio_neto,number_pricing: pricings[i].numero_precio };
      
      if(i + 1 < datoFinal && amount >= pricings[i].unidad_mayoreo && amount < pricings[i + 1].unidad_mayoreo){
        finalPrising = {
          found: true,
          pricing: pricings[i].precio_neto,
          number_pricing: pricings[i].numero_precio
        }
      }
      // if(i + 1 === datoFinal){
      //     if(amount >= pricings[i].unidad_mayoreo){
      //       finalPrising = {
      //         found: true,
      //         pricing: pricings[i].precio_neto,
      //         number_pricing: pricings[i].numero_precio
      //       }
      //     }else{
      //     }
      // }else{
      //   if(i + 1 < datoFinal && amount >= pricings[i].unidad_mayoreo && amount < pricings[i + 1].unidad_mayoreo){
      //     finalPrising = {
      //       found: true,
      //       pricing: pricings[i].precio_neto,
      //       number_pricing: pricings[i].numero_precio
      //     }
      //     // console.log("llego al rango de precio");
      //   }
      // }
    }
    return finalPrising;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function formatCurrency (number) {
  var formatted = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: "USD",
    minimumFractionDigits: 2
  }).format(number);
  console.log(formatted);
  return formatted;
}

//Recalcular los precios con los nuevos campos
export async function calculateNewPrising(props) {
  try {
    const { producto, cantidad, granel } = props;

    /* precio_unidad: {
        numero_precio: Number,
        precio_neto: Float,
        precio_venta: Float,
        unidad_mayoreo: Number,
        iva_precio: Float,
        ieps_precio: Float,
        utilidad: Float,
        precio_general: Float,
        cantidad_unidad: Number,
        unidad_maxima:Boolean
      } */
    //Declarar variables que se utilizaran
    const valores = {
      subtotal: 0,
      total: 0,
      impuesto: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
      monedero: 0
    }
    const new_producto = {};

    //Buscar el producto en el array del local storage
      const { producto_found, found } = await findProductArrayRefactor(producto);

      if(found){

      }else{

      }


    //Verificar si el producto tiene descuento

    
    

    //Verificar si ese precio fue seleccionado (en la tabla de precios del producto)

    //Verificar si la cantidad esta en rango de otro precio

  } catch (error) {
    console.log(error);
    return false;
  }
}


export const findProductArrayRefactor = async (producto) => {
  try {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    //Declarar variables
    let found = false;
    let producto_found = {
      producto: {},
      index: 0,
    };

    //Se recorren los productos
    for (let i = 0; i < productosVentas.length; i++) {
      //Se verifica si tiene codigo de barras ya que no es obligatorio
      if (typeof productosVentas[i].codigo_barras !== "undefined") {
        if(productosVentas[i].codigo_barras === producto.codigo_barras){
          return {
            producto_found: {
              producto: productosVentas[i],
              index: i,
            },
            found: true,
          };
        }
      } else {
        if (productosVentas[i].id_producto.datos_generales.clave_alterna === producto.id_producto.datos_generales.clave_alterna) {
          return {
            producto_found: {
              producto: productosVentas[i],
              index: i,
            },
            found: true,
          }
        }
      }
    }

    return {
      producto_found,
      found,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};