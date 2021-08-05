import { gql } from '@apollo/client';

export const CREAR_CAJA = gql`
    mutation CrearCaja($input: CrearCajasInput!, $empresa: ID!, $sucursal: ID!){
        crearCaja(input: $input, empresa: $empresa, sucursal: $sucursal){
            message
        }
    }
`;

export const OBTENER_CAJAS = gql`
    query ObtenerCajasSucursales($empresa: ID!, $sucursal: ID!){
        obtenerCajasSucursal(empresa: $empresa, sucursal: $sucursal){
            _id
            numero_caja
            activa
            usuario_creador {
            numero_usuario
            nombre
            email
            }
            cantidad_efectivo_actual
            usuario_en_caja {
            _id
            numero_usuario
            nombre
            email
            }
             
        }
    }
`;
export const CREAR_HISTORIAL_CAJA = gql`
    mutation CrearHistorialCaja($input: CrearHistorialCajasInput!, $empresa: ID!, $sucursal: ID!){
        crearHistorialCaja(input: $input, empresa: $empresa, sucursal: $sucursal){
            message
        }
    }
`;

export const OBTENER_HISTORIAL_CAJA = gql`
    query ObtenerHistorialCaja($id_Caja: ID!,$empresa: ID!, $sucursal: ID!){
        obtenerHistorialCaja(id_Caja: $id_Caja,empresa: $empresa, sucursal: $sucursal){
            _id
            tipo_movimiento
            cantidad_movimiento
            
            id_Caja {
            _id    
            numero_caja
            }
            id_User {
            _id
            numero_usuario
            nombre
            email
            }
            origen_movimiento
            id_caja_destino{
            numero_caja
            }
            createdAt
        }
    }
`;