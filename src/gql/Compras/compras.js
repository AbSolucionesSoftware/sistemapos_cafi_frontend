import { gql } from "@apollo/client";

export const CREAR_COMPRA = gql`
  mutation crearCompra(
    $input: CrearCompraInput
    $empresa: ID!
    $sucursal: ID!
    $usuario: ID!
  ) {
    crearCompra(
      input: $input
      empresa: $empresa
      sucursal: $sucursal
      usuario: $usuario
    ) {
      message
    }
  }
`;

export const OBTENER_CONSULTA_GENERAL_PRODUCTO = gql`
  query obtenerConsultaGeneralCompras($empresa: ID!, $sucursal: ID!) {
    obtenerConsultaGeneralCompras(empresa: $empresa, sucursal: $sucursal) {
      productos {
        _id
        datos_generales {
          codigo_barras
          clave_alterna
          tipo_producto
          nombre_comercial
          nombre_generico
          descripcion
          descripcion
          id_categoria
          categoria
          subcategoria
          id_subcategoria
          id_departamento
          departamento
          id_marca
          marca
          clave_producto_sat
          receta_farmacia
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
            precio_venta
            unidad_mayoreo
            utilidad
          }
          unidad_de_compra {
            cantidad
            precio_unitario_con_impuesto
            precio_unitario_sin_impuesto
            unidad
          }
          granel
        }
        imagenes {
          url_imagen
          location_imagen
          key_imagen
          extencion_imagen
        }
        centro_de_costos {
          cuenta
          id_cuenta
          id_subcuenta
          subcuenta
        }
        precio_plazos {
          precio_cajas {
            plazo
            unidad
            precio
          }
          precio_costales {
            plazo
            unidad
            precio
          }
          precio_piezas {
            plazo
            unidad
            precio
          }
          precio_tarimas {
            plazo
            unidad
            precio
          }
        }
        unidades_de_venta {
          _id
          precio
          cantidad
          concepto
          unidad
          unidad_principal
          codigo_barras
          id_producto
          empresa
          sucursal
          descuento {
            porciento
            dinero_descontado
            precio_con_descuento
          }
          descuento_activo
          default
        }
        inventario_general {
          _id
          cantidad_existente
          unidad_inventario
          cantidad_existente_maxima
          unidad_maxima
        }
        medidas_producto {
          _id
          cantidad
          codigo_barras
          color {
            hex
            nombre
            _id
          }
          existencia
          medida {
            talla
            tipo
            _id
          }
          nombre_comercial
          precio
        }
        medidas_registradas
        empresa
        sucursal
        usuario
      }
      proveedores {
        _id
        numero_cliente
        clave_cliente
        representante
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
        estado_cliente
        tipo_cliente
        banco
        numero_cuenta
        empresa {
          _id
        }
        sucursal {
          _id
        }
      }
      almacenes {
        _id
        nombre_almacen
        id_usuario_encargado {
          _id
          numero_usuario
          nombre
          email
          imagen
          estado_usuario
        }
        id_sucursal {
          _id
          nombre_sucursal
          usuario_sucursal
        }
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
      }
    }
  }
`;
