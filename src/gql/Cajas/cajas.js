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