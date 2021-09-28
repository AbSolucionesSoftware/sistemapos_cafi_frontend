import { gql } from '@apollo/client';

export const CONSULTA_PRODUCTOS = gql`
    query obtenerConsultaGeneralVentas($empresa: ID!, $sucursal: ID!){
        obtenerConsultaGeneralVentas(empresa: $empresa, sucursal: $sucursal){
            _id
            producto{
                datos_generales{
                nombre_comercial
                nombre_generico
                clave_alterna
                }
            }
                cantidad_existente
                unidad_inventario
                cantidad_existente_minima
                unidad_minima
                cantidad_existente_maxima
            unidad_maxima
            unidades_de_venta{
                precio
                cantidad
                concepto
                unidad
                codigo_barras
            }
            medidas_producto{
                cantidad
                codigo_barras
                color{
                hex
                nombre
                _id
                }
                existencia
                medida{
                talla
                tipo
                _id
                }
                precio
            }
        }
    }	
`;