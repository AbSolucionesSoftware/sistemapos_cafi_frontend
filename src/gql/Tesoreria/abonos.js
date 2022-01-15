import { gql } from '@apollo/client';

export const OBTENER_HISTORIAL_ABONOS = gql`
    query ObtenerHistorialAbonos($empresa: ID!, $sucursal: ID!, $input: ObtenerHistorialAbonosInput){
        obtenerHistorialAbonos( empresa: $empresa, sucursal: $sucursal, input: $input ){
            numero_caja
            id_Caja
            horario_turno
            tipo_movimiento
            rol_movimiento
            fecha_movimiento{
                completa
            }
            montos_en_caja { 
                monto_efectivo
            }
            monto_total_abonado
            numero_usuario_creador
            nombre_usuario_creador
            id_cliente
            numero_cliente
            nombre_cliente 
            telefono_cliente 
            email_cliente
            id_egreso
            provedor_egreso
            folio_egreso
            id_compra       
        }
    }
`

export const CREAR_ABONO = gql`
    mutation CrearAbono($empresa: ID!, $sucursal: ID!, $input: CrearAbonoInput){
        crearAbono(empresa: $empresa, sucursal: $sucursal, input: $input, ){
            message
        }
    }
`;