import { gql } from '@apollo/client';

export const CONSULTA_PRODUCTOS = gql`
    query ObtenerConsultaGeneralVentas($empresa: ID!, $sucursal: ID!){
        obtenerConsultaGeneralVentas(empresa: $empresa, sucursal: $sucursal){
             _id
            precio
            cantidad
            concepto
            unidad
            unidad_principal
            codigo_barras
            descuento{
                porciento
                dinero_descontado
                precio_con_descuento
            }
            descuento_activo
            default
            id_producto{
                datos_generales{
                    nombre_comercial
                    codigo_barras
                    tipo_producto
                    clave_alterna
                }
            }
            inventario_general{
                cantidad_existente
                unidad_inventario
                cantidad_existente_maxima
                unidad_maxima
            }
        }
    }	
`;

export const CONSULTA_PRODUCTO_UNITARIO = gql`
    query ObtenerUnProductoVentas($empresa: ID!, $sucursal: ID!, $datosProductos: ID!){
        obtenerUnProductoVentas(empresa: $empresa, sucursal: $sucursal, datosProductos: $datosProductos){
            _id
            precio
            cantidad
            concepto
            unidad
            unidad_principal
            codigo_barras
            descuento{
                porciento
                dinero_descontado
                precio_con_descuento
            }
            descuento_activo
            default
            id_producto{
                datos_generales{
                    nombre_comercial
                    codigo_barras
                    tipo_producto
                    clave_alterna
                }
            }
        }
    }	
`;