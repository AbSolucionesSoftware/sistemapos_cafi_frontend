export const compra_test = {
  folio: "12345",
  descuento: 5.4,
  ieps: 2.5862100000000003,
  impuestos: 6.724146000000001,
  iva: 4.137936000000001,
  monedero: 0,
  subTotal: 23.875854,
  total: 30.6,
  venta_cliente: true,
  montos_en_caja: {
    monto_efectivo: 50,
    monto_tarjeta: 0,
    monto_creditos: 0,
    monto_monedero: 0,
    monto_transferencia: 0,
    monto_cheques: 0,
    monto_vales_despensa: 0,
  },
  credito: false,
  descuento_general_activo: false,
  descuento_general: {
    cantidad_descontado: 0,
    porciento: 0,
    precio_neto: 0,
  },
  dias_de_credito_venta: null,
  fecha_de_vencimiento_credito: null,
  fecha_vencimiento_cotizacion: null,
  cliente: {
    banco: null,
    celular: null,
    clave_cliente: "23233",
    curp: null,
    dias_credito: null,
    direccion: {
      calle: "Antonio",
      no_ext: "1",
      no_int: "1",
      codigo_postal: "1",
      colonia: "Antonio",
      municipio: "1",
      localidad: "1",
      estado: "1",
      pais: "1",
    },
    email: "antonio.poday@gmail.com",
    imagen: null,
    limite_credito: null,
    nombre_cliente: "Antonio",
    numero_cliente: "2323",
    razon_social: null,
    rfc: null,
    telefono: "1212",
    monedero_electronico: null,
  },
  productos: [
    {
      cantidad: 1,
      cantidad_venta: 1,
      codigo_barras: "226216505720",
      concepto: "unidades",
      default: true,
      descuento: {
        cantidad_unidad: null,
        dinero_descontado: 21.59,
        ieps_precio: 0,
        iva_precio: 3.5856,
        numero_precio: 1,
        porciento: 49.07,
        precio_general: 0,
        precio_neto: 25.0453,
        precio_venta: 22.41,
        unidad_maxima: false,
        utilidad: -43.97,
      },
      descuento_activo: true,
      granel_producto: {
        granel: false,
        valor: 0,
      },
      precio_actual_object: {
        cantidad_unidad: null,
        dinero_descontado: 21.59,
        ieps_precio: 0,
        iva_precio: 3.5856,
        numero_precio: 1,
        porciento: 49.07,
        precio_general: 0,
        precio_neto: 25.0453,
        precio_venta: 22.41,
        unidad_maxima: false,
        utilidad: -43.97,
      },
      precio_unidad: {
        cantidad_unidad: null,
        ieps_precio: 0,
        iva_precio: 6.72,
        numero_precio: 5,
        precio_general: null,
        precio_neto: 48.72,
        precio_venta: 42,
        unidad_maxima: false,
        unidad_mayoreo: 0,
      },
      precio: 36,
      precio_a_vender: 30.6,
      precio_actual_producto: 30.6,
      precio_anterior: 36,
      iva_total_producto: 1.03,
      ieps_total_producto: 0,
      impuestos_total_producto: 1.03,
      subtotal_total_producto: 7.22,
      total_total_producto: 36,
      unidad: "Caja",
      codigo_unidad: "XBX",
      unidad_principal: true,
      inventario_general: [
        {
          cantidad_existente: 120,
          cantidad_existente_maxima: 10,
          unidad_inventario: "Pz",
          codigo_unidad: null,
          unidad_maxima: "Caja",
        },
      ],
      id_producto: {
        _id: "61b7bf6e3454b727a0c2e357",
        datos_generales: {
          clave_alterna: "COCA",
          codigo_barras: "226216505720",
          nombre_comercial: "COCACOLA",
          tipo_producto: "OTROS",
          nombre_generico: "COCACOLA",
          descripcion: null,
          id_categoria: null,
          categoria: null,
          subcategoria: null,
          id_subcategoria: null,
          id_departamento: null,
          departamento: null,
          id_marca: null,
          marca: null,
          receta_farmacia: false,
          clave_producto_sat: {
            Name: "Refrescos",
            Value: "50202306",
          },
        },
        precios: {
          ieps: 10,
          ieps_activo: false,
          inventario: {
            inventario_maximo: 15,
            inventario_minimo: 5,
            unidad_de_inventario: "Caja",
            codigo_unidad: "XBX",
          },
          iva: 16,
          iva_activo: true,
          monedero: false,
          monedero_electronico: 0,
          precio_de_compra: {
            precio_con_impuesto: 180,
            precio_sin_impuesto: 155.1724,
            iva: 24.8276,
            ieps: 0,
          },
          precios_producto: [
            {
              numero_precio: 1,
              precio_neto: 8.25,
              unidad_mayoreo: 0,
              utilidad: 10,
            },
            {
              numero_precio: 2,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 3,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 4,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 5,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 6,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
          ],
          unidad_de_compra: {
            cantidad: 24,
            precio_unitario_con_impuesto: 7.5,
            precio_unitario_sin_impuesto: 6.4655,
            unidad: "Caja",
            codigo_unidad: "XBX",
          },
        },
      },
      medida: null,
      color: null,
    },
    {
      cantidad: 1,
      cantidad_venta: 1,
      codigo_barras: "226216505720",
      concepto: "unidades",
      default: true,
      descuento: {
        cantidad_unidad: null,
        dinero_descontado: 21.59,
        ieps_precio: 0,
        iva_precio: 3.5856,
        numero_precio: 1,
        porciento: 49.07,
        precio_general: 0,
        precio_neto: 25.0453,
        precio_venta: 22.41,
        unidad_maxima: false,
        utilidad: -43.97,
      },
      descuento_activo: true,
      granel_producto: {
        granel: false,
        valor: 0,
      },
      precio_actual_object: {
        cantidad_unidad: null,
        dinero_descontado: 21.59,
        ieps_precio: 0,
        iva_precio: 3.5856,
        numero_precio: 1,
        porciento: 49.07,
        precio_general: 0,
        precio_neto: 25.0453,
        precio_venta: 22.41,
        unidad_maxima: false,
        utilidad: -43.97,
      },
      precio_unidad: {
        cantidad_unidad: null,
        ieps_precio: 0,
        iva_precio: 6.72,
        numero_precio: 5,
        precio_general: null,
        precio_neto: 48.72,
        precio_venta: 42,
        unidad_maxima: false,
        unidad_mayoreo: 0,
      },
      precio: 36,
      precio_a_vender: 30.6,
      precio_actual_producto: 30.6,
      precio_anterior: 36,
      iva_total_producto: 1.03,
      ieps_total_producto: 0,
      impuestos_total_producto: 1.03,
      subtotal_total_producto: 7.22,
      total_total_producto: 36,
      unidad: "Caja",
      codigo_unidad: "XBX",
      unidad_principal: true,
      inventario_general: [
        {
          cantidad_existente: 120,
          cantidad_existente_maxima: 10,
          unidad_inventario: "Pz",
          codigo_unidad: null,
          unidad_maxima: "Caja",
        },
      ],
      id_producto: {
        _id: "61b7bf6e3454b727a0c2e357",
        datos_generales: {
          clave_alterna: "COCA",
          codigo_barras: "226216505720",
          nombre_comercial: "COCACOLA",
          tipo_producto: "OTROS",
          nombre_generico: "COCACOLA",
          descripcion: null,
          id_categoria: null,
          categoria: null,
          subcategoria: null,
          id_subcategoria: null,
          id_departamento: null,
          departamento: null,
          id_marca: null,
          marca: null,
          receta_farmacia: false,
          clave_producto_sat: {
            Name: "Refrescos",
            Value: "50202306",
          },
        },
        precios: {
          ieps: 10,
          ieps_activo: false,
          inventario: {
            inventario_maximo: 15,
            inventario_minimo: 5,
            unidad_de_inventario: "Caja",
            codigo_unidad: "XBX",
          },
          iva: 16,
          iva_activo: true,
          monedero: false,
          monedero_electronico: 0,
          precio_de_compra: {
            precio_con_impuesto: 180,
            precio_sin_impuesto: 155.1724,
            iva: 24.8276,
            ieps: 0,
          },
          precios_producto: [
            {
              numero_precio: 1,
              precio_neto: 8.25,
              unidad_mayoreo: 0,
              utilidad: 10,
            },
            {
              numero_precio: 2,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 3,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 4,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 5,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
            {
              numero_precio: 6,
              precio_neto: 0,
              unidad_mayoreo: 0,
              utilidad: 0,
            },
          ],
          unidad_de_compra: {
            cantidad: 24,
            precio_unitario_con_impuesto: 7.5,
            precio_unitario_sin_impuesto: 6.4655,
            unidad: "Caja",
            codigo_unidad: "XBX",
          },
        },
      },
      medida: null,
      color: null,
    }
  ],
};
