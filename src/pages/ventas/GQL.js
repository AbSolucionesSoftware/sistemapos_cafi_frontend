const data = `

    input CrearVentasInput {
        cliente: ClienteVentaInput
        descuento: Float
        ieps: Float
        impuestos: Float
        iva: Float
        monedero: Float
        productos: [ProductosVentasInput]
        subTotal: Float
        total: Float
        venta_cliente: Boolean
    }

    input ProductosVentasInput {
        cantidad: Int
        cantidad_venta: Int
        codigo_barras: String
        concepto: String
        default: Boolean
        descuento: DescuentoProductos
        descuento_activo: Boolean
        granel_producto: ProductoGranelVentasInput
        id_producto: ProductoPopulateVentas
        inventario_general: [InventarioGeneralPrecioVentas]
        precio: Float
        precio_a_vender: Float
        precio_actual_producto: Float
        unidad: String
        unidad_principal: Boolean
    }

    input InventarioGeneralPrecioVentas {
        cantidad_existente: Int
        cantidad_existente_maxima: Int
        unidad_inventario: String
        unidad_maxima: String
    }

    input ProductoPopulateVentas {
        _id: String
        datos_generales: DatosGeneralesVentasInput
        precios: PreciosProductoVentasInput
    }

    input PreciosProductoVentasInput {
        ieps: Float
        ieps_activo: Boolean
        inventario: InventarioVentasInput
        iva: Float
        iva_activo: Boolean
        monedero: Boolean
        monedero_electronico: Float
        precio_de_compra: PrecioCompraProductoVentasInput
        precios_producto: [PreciosProductoPopulateVentasInput]
        unidad_de_compra: UnidadCompraProductoVentasInput
    }

    input UnidadCompraProductoVentasInput {
        cantidad: Int
        precio_unitario_con_impuesto: Float
        precio_unitario_sin_impuesto: Float
        unidad: String
    }

    input PreciosProductoPopulateVentasInput {
        numero_precio: Int
        precio_neto: Float
        precio_venta: Float
        unidad_mayoreo: Int
        utilidad: Float
    }

    input PrecioCompraProductoVentasInput {
        precio_con_impuesto: Float
        precio_sin_impuesto: Float
        iva: Float
        ieps: Float
    }

    input InventarioVentasInput {
        inventario: Int
        inventario_minimo: Int
        unidad_de_inventario: String
    }

    input DatosGeneralesVentasInput {
        clave_alterna: String
        codigo_barras: String
        nombre_comercial: String
        tipo_producto: String
    }

    input ProductoGranelVentasInput {
        granel: Boolean
        valor: Float
    }

    input ClienteVentaInput {
        banco: String
        celular: String
        clave_cliente: String
        curp: String
        dias_credito: String
        direccion: DireccionInputCliente
        email: String
        imagen: String
        limite_credito: Int
        nombre_cliente: String
        numero_cliente: String
        numero_cuenta: String
        numero_descuento: Int
        razon_social: String
        rfc: String
        telefono: String
    } 


    

`;