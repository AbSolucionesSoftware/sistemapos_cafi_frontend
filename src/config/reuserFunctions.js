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

export const calculatePrices = async ( newP, cantidad, granel, newPrising = 0, data ) => {

  let subtotalCalculo = 0,
    totalCalculo = 0,
    impuestoCalculo = 0,
    ivaCalculo = 0,
    iepsCalculo = 0,
    descuentoCalculo = 0,
    monederoCalculo = 0;
console.log("newPrising",newPrising);
  const cantidadNueva = cantidad > 0 ? cantidad : 1;
  // console.log(newP);
  const iva_producto =
    parseFloat(
      newP.id_producto.precios.unidad_de_compra.precio_unitario_sin_impuesto
    ) * parseFloat(`0.${newP.id_producto.precios.iva  < 9 ? `0${newP.id_producto.precios.iva}` : newP.id_producto.precios.iva}`);
  const ieps_producto =
    parseFloat(
      newP.id_producto.precios.unidad_de_compra.precio_unitario_sin_impuesto
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
    console.log(newP);
    console.log(newP.cantidad_venta);
    const amount = newP.cantidad_venta;
    const pricings = newP.id_producto.precios.precios_producto;

    let finalPrising = {
      found: false,
      pricing: 0,
      number_pricing: 0
    };

    for (let i = 0; i < pricings.length; i++) {
      // const objectPrising = pricings[i];
      // console.log("Unidad mayoreo",pricings[i].unidad_mayoreo);
      // console.log("Amount",amount);
      if(pricings[i].unidad_mayoreo > 1 && amount >= pricings[i].unidad_mayoreo){
        console.log(pricings[i]);
        finalPrising = {
          found: true,
          pricing: pricings[i].precio_neto,
          number_pricing: pricings[i].numero_precio
        }
      }
    }

    console.log(finalPrising);

    return finalPrising;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const PricingProductVenta = async (producto,origen, granelBase) => {
  try {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let venta_actual = venta === null ? [] : venta;
    let venta_existente =
      venta === null
        ? {
            subTotal: 0,
            total: 0,
            impuestos: 0,
            iva: 0,
            ieps: 0,
            descuento: 0,
            monedero: 0,
          }
        : venta;
    let productosVentasTemp = productosVentas;
    let subTotal = 0,
      total = 0,
      impuestos = 0,
      iva = 0,
      ieps = 0,
      descuento = 0,
      monedero = 0;

    let calculoResta = {};
    let calculoSuma = {};

    let CalculosData = {};

    const producto_encontrado = await findProductArray(
      productosVentas,
      producto
    );

    if(origen === "principal"){
      if (!producto_encontrado.found && producto._id) {
        const newP = { ...producto };
        const productoPrecioFinal = newP.descuento_activo
          ? newP.descuento.precio_con_descuento
          : newP.precio;
        const {
          subtotalCalculo,
          totalCalculo,
          impuestoCalculo,
          ivaCalculo,
          iepsCalculo,
          descuentoCalculo,
          monederoCalculo,
        } = await calculatePrices(newP, 0, granelBase, productoPrecioFinal);
        subTotal = subtotalCalculo;
        total = totalCalculo;
        impuestos = impuestoCalculo;
        iva = ivaCalculo;
        ieps = iepsCalculo;
        descuento = descuentoCalculo;
        monedero = monederoCalculo;
        // console.log(monedero);
        newP.cantidad_venta = 1;
        newP.granelProducto = granelBase;
        newP.precio_a_vender = totalCalculo;
        newP.precio_actual_producto = productoPrecioFinal;
        newP.precio_anterior = productoPrecioFinal;
        productosVentasTemp.push(newP);
        CalculosData = {
          subTotal: parseFloat(venta_existente.subTotal) + subTotal,
          total: parseFloat(venta_existente.total) + total,
          impuestos: parseFloat(venta_existente.impuestos) + impuestos,
          iva: parseFloat(venta_existente.iva) + iva,
          ieps: parseFloat(venta_existente.ieps) + ieps,
          descuento: parseFloat(venta_existente.descuento) + descuento,
          monedero: parseFloat(venta_existente.monedero) + monedero,
        };
      } else if (producto_encontrado.found && producto._id) {
        const { cantidad_venta, ...newP } =
          producto_encontrado.producto_found.producto;
        newP.cantidad_venta = parseInt(cantidad_venta) + 1;
        const verify_prising = await verifiPrising(newP);
  
        //Verificar si el precio fue encontrado
        if (verify_prising.found) {
          // console.log("Entro a aqui nuevo precio");
          calculoResta = await calculatePrices(
            newP,
            cantidad_venta,
            newP.granelProducto,
            newP.precio_actual_producto,
            "TABLA"
          );
  
          //Sacar los impuestos que se van a sumar
          calculoSuma = await calculatePrices(
            newP,
            cantidad_venta,
            newP.granelProducto,
            verify_prising.pricing,
            "TABLA"
          );
  
          newP.precio_a_vender = calculoSuma.totalCalculo;
          newP.precio_anterior = newP.precio_actual_producto;
          newP.precio_actual_producto = verify_prising.pricing;
          productosVentasTemp.splice(
            producto_encontrado.producto_found.index,
            1,
            newP
          );
  
          CalculosData = {
            subTotal:
              parseFloat(venta_existente.subTotal) -
              parseFloat(calculoResta.subtotalCalculo) +
              calculoSuma.subtotalCalculo,
            total:
              parseFloat(venta_existente.total) -
              parseFloat(calculoResta.totalCalculo) +
              calculoSuma.totalCalculo,
            impuestos:
              parseFloat(venta_existente.impuestos) -
              parseFloat(calculoResta.impuestoCalculo) +
              calculoSuma.impuestoCalculo,
            iva:
              parseFloat(venta_existente.iva) -
              parseFloat(calculoResta.ivaCalculo) +
              calculoSuma.ivaCalculo,
            ieps:
              parseFloat(venta_existente.ieps) -
              parseFloat(calculoResta.iepsCalculo) +
              calculoSuma.iepsCalculo,
            descuento:
              parseFloat(venta_existente.descuento) -
              parseFloat(calculoResta.descuentoCalculo) +
              calculoSuma.descuentoCalculo,
            monedero:
              parseFloat(venta_existente.monedero) -
              parseFloat(calculoResta.monederoCalculo) +
              calculoSuma.monederoCalculo,
          }; 
        } else {
          const productoPrecioFinal = newP.descuento_activo
            ? newP.descuento.precio_con_descuento
            : newP.precio;
          const {
            subtotalCalculo,
            totalCalculo,
            impuestoCalculo,
            ivaCalculo,
            iepsCalculo,
            descuentoCalculo,
            monederoCalculo,
          } = await calculatePrices(newP, 0, granelBase, productoPrecioFinal);
          subTotal = subtotalCalculo;
          total = totalCalculo;
          impuestos = impuestoCalculo;
          iva = ivaCalculo;
          ieps = iepsCalculo;
          descuento = descuentoCalculo;
          monedero = monederoCalculo;
  
          newP.granelProducto = granelBase;
          newP.precio_a_vender = totalCalculo;
          newP.precio_anterior = newP.precio_actual_producto;
          newP.precio_actual_producto = productoPrecioFinal;
          productosVentasTemp.splice(
            producto_encontrado.producto_found.index,
            1,
            newP
          );
  
          CalculosData = {
            subTotal: parseFloat(venta_existente.subTotal) + subTotal,
            total: parseFloat(venta_existente.total) + total,
            impuestos: parseFloat(venta_existente.impuestos) + impuestos,
            iva: parseFloat(venta_existente.iva) + iva,
            ieps: parseFloat(venta_existente.ieps) + ieps,
            descuento: parseFloat(venta_existente.descuento) + descuento,
            monedero: parseFloat(venta_existente.monedero) + monedero,
          };
          // console.log("Precio normal",CalculosData);
          // setDatosVentasActual({
          //   ...CalculosData,
          // });
          // //Recargar la tabla de los productos
          // setUpdateTablaVentas(!updateTablaVentas);
        }
      }
    }

    localStorage.setItem(
      "DatosVentas",
      JSON.stringify({
        ...CalculosData,
        cliente:
          venta_actual.venta_cliente === true ? venta_actual.cliente : {},
        venta_cliente:
          venta_actual.venta_cliente === true
            ? venta_actual.venta_cliente
            : false,
        productos: productosVentasTemp,
      })
    );

    return CalculosData;

    
  } catch (error) {
    return false;
  }
}