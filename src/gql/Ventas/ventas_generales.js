import { gql } from "@apollo/client";

export const CONSULTA_PRODUCTOS = gql`
  query ObtenerConsultaGeneralVentas($empresa: ID!, $sucursal: ID!) {
    obtenerConsultaGeneralVentas(empresa: $empresa, sucursal: $sucursal) {
      _id
      precio
      cantidad
      concepto
      unidad
      unidad_principal
      codigo_barras
      descuento {
        porciento
        dinero_descontado
        precio_con_descuento
      }
      descuento_activo
      default
      id_producto {
        datos_generales {
          nombre_comercial
          codigo_barras
          tipo_producto
          clave_alterna
        }
      }
      inventario_general {
        cantidad_existente
        unidad_inventario
        cantidad_existente_maxima
        unidad_maxima
      }
    }
  }
`;

export const CONSULTA_PRODUCTO_UNITARIO = gql`
  query ObtenerUnProductoVentas(
    $empresa: ID!
    $sucursal: ID!
    $datosProductos: ID!
  ) {
    obtenerUnProductoVentas(
      empresa: $empresa
      sucursal: $sucursal
      datosProductos: $datosProductos
    ) {
      _id
      precio
      cantidad
      concepto
      unidad
      unidad_principal
      codigo_barras
      descuento {
        porciento
        dinero_descontado
        precio_con_descuento
      }
      descuento_activo
      default
      id_producto {
        imagenes{
          url_imagen
        }
        _id
        datos_generales {
          nombre_comercial
          codigo_barras
          tipo_producto
          clave_alterna
        }
        precios {
          ieps
          ieps_activo
          inventario {
            inventario_minimo
            inventario_maximo
            unidad_de_inventario
          }
          iva
          iva_activo
          monedero
          monedero_electronico
          precio_de_compra {
            precio_con_impuesto
            precio_sin_impuesto
            iva
            ieps
          }
          precios_producto {
            numero_precio
            precio_neto
            unidad_mayoreo
            utilidad
          }
          unidad_de_compra {
            cantidad
            precio_unitario_con_impuesto
            precio_unitario_sin_impuesto
            unidad
          }
        }
      }
      inventario_general {
        cantidad_existente
        unidad_inventario
        cantidad_existente_maxima
        unidad_maxima
      }
    }
  }
`;

export const CONSULTA_PRODUCTOS_VENTAS = gql`
  query ObtenerProductosVentas($empresa: ID!$sucursal: ID! $input: ObtenerProductosVentasInput) {
    obtenerProductosVentas(empresa: $empresa sucursal: $sucursal input: $input) {
      _id
      precio
      cantidad
      concepto
      unidad
      unidad_principal
      codigo_barras
      descuento {
        porciento
        dinero_descontado
        precio_con_descuento
      }
      descuento_activo
      default
      id_producto {
        imagenes{
          url_imagen
        }
        _id
        datos_generales {
          nombre_comercial
          codigo_barras
          tipo_producto
          clave_alterna
        }
        precios {
          ieps
          ieps_activo
          inventario {
            inventario_minimo
            inventario_maximo
            unidad_de_inventario
          }
          iva
          iva_activo
          monedero
          monedero_electronico
          precio_de_compra {
            precio_con_impuesto
            precio_sin_impuesto
            iva
            ieps
          }
          precios_producto {
            numero_precio
            precio_neto
            unidad_mayoreo
            utilidad
          }
          unidad_de_compra {
            cantidad
            precio_unitario_con_impuesto
            precio_unitario_sin_impuesto
            unidad
          }
        }
      }
      inventario_general {
        cantidad_existente
        unidad_inventario
        cantidad_existente_maxima
        unidad_maxima
      }
    }
  }
`;

export const OBTENER_CLIENTES_VENTAS = gql`
  query ObtenerClientesVentas($empresa: ID!, $sucursal: ID!) {
    obtenerClientesVentas(empresa: $empresa, sucursal: $sucursal) {
      numero_cliente
      clave_cliente
      nombre_cliente
      rfc
      curp
      telefono
      celular
      email
      numero_descuento
      limite_credito
      dias_credito
      razon_social
      direccion {
        calle
        no_ext
        no_int
        codigo_postal
        colonia
        municipio
        localidad
        estado
        pais
      }
      imagen
      banco
      numero_cuenta
      monedero_electronico
      credito_disponible
    }
  }
`;
