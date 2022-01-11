import { gql } from "@apollo/client";

export const REGISTRO_ALMACEN = gql`
  mutation CrearAlmacen($input: CrearAlmacen, $id: ID!, $empresa: ID!) {
    crearAlmacen(input: $input, id: $id, empresa: $empresa) {
      _id
    }
  }
`;

export const OBTENER_ALMACENES = gql`
  query obtenerAlmacenes($id: ID!) {
    obtenerAlmacenes(id: $id) {
      _id
      nombre_almacen
      id_usuario_encargado {
        _id
        nombre
      }
      id_sucursal {
        _id
        nombre_sucursal
        descripcion
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
`;

export const ACTUALIZAR_ALMACEN = gql`
  mutation ActualizarAlmacen($input: EditarAlmacen, $id: ID!) {
    actualizarAlmacen(input: $input, id: $id) {
      message
    }
  }
`;

export const OBTENER_PRODUCTOS_ALMACEN = gql`
  query obtenerProductosAlmacenes(
    $empresa: ID!
    $sucursal: ID!
    $filtro: FilterProductoInput
  ) {
    obtenerProductosAlmacenes(
      empresa: $empresa
      sucursal: $sucursal
      filtro: $filtro
    ) {
      _id
      datos_generales {
        codigo_barras
        clave_alterna
        tipo_producto
        nombre_comercial
        nombre_generico
        descripcion
        id_categoria
        categoria
        subcategoria
        id_subcategoria
        id_departamento
        departamento
        id_marca
        marca
        clave_producto_sat {
          Name
          Value
        }
        receta_farmacia
      }
      existencia_almacenes {
        _id {
          producto
          almacen {
            _id
            nombre_almacen
          }
        }
        cantidad_existente
      }
      empresa
      sucursal
    }
  }
`;

export const OBTENER_CATEGORIAS = gql`
  query obtenerCategorias($empresa: ID!, $sucursal: ID!) {
    obtenerCategorias(empresa: $empresa, sucursal: $sucursal) {
      _id
      categoria
      subcategorias {
        _id
        subcategoria
      }
    }
  }
`;

export const REALIZAR_TRASPASO = gql`
  mutation CrearTraspaso(
    $input: CrearTraspasoInput
    $usuario: ID!
    $empresa: ID!
  ) {
    crearTraspaso(input: $input, usuario: $usuario, empresa: $empresa) {
      message
      resp
    }
  }
`;

export const OBTENER_PRODUCTOS_EMPRESA = gql`
  query obtenerProductosPorEmpresa($empresa: ID!) {
    obtenerProductosPorEmpresa(empresa: $empresa) {
      _id
      datos_generales {
        codigo_barras
        clave_alterna
        tipo_producto
        nombre_comercial
        nombre_generico
        descripcion
        id_categoria
        categoria
        subcategoria
        id_subcategoria
        id_departamento
        departamento
        id_marca
        marca
        clave_producto_sat {
          Name
          Value
        }
        receta_farmacia
      }
      precio_plazos {
        precio_cajas {
          plazo
          unidad
          precio
        }
        precio_piezas {
          plazo
          unidad
          precio
        }
        precio_costales {
          plazo
          unidad
          precio
        }
      }
      precios {
        ieps
        ieps_activo
        iva
        iva_activo
        monedero
        monedero_electronico
        precio_de_compra {
          ieps
          iva
          precio_con_impuesto
          precio_sin_impuesto
        }
        precios_producto {
          numero_precio
          precio_neto
          precio_venta
          unidad_mayoreo
          utilidad
          ieps_precio
          iva_precio
        }
        unidad_de_compra {
          cantidad
          precio_unitario_con_impuesto
          precio_unitario_sin_impuesto
          unidad
        }
        inventario {
          inventario_minimo
          inventario_maximo
          unidad_de_inventario
        }
        granel
      }
      sucursal
      usuario
      empresa
    }
  }
`;
