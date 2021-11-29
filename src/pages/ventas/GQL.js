const data = `

    input CrearVentasInput {
        cliente: ClienteVentaInput
        descuento: Float
        ieps: Float
        impuestos: Float
        iva: Float
        monedero: Float
        productos: 
    }

    input ProductosVentasInput {
        cantidad: Int
        cantidad_venta: Int
        codigo_barras: String
        concepto: String
        default: Boolean
        descuento: DescuentoProductos
        descuento_activo: Boolean
        
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