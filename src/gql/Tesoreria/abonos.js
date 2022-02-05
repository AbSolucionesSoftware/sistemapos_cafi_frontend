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
            numero_usuario_creador
            nombre_usuario_creador
            monto_total_abonado
            numero_cliente
            nombre_cliente
            telefono_cliente
            email_cliente
            montos_en_caja{
                monto_efectivo{
                    monto 
                }
                monto_tarjeta_credito{
                    monto 
                }
                monto_tarjeta_debito{
                    monto 
                }
                monto_creditos{
                    monto 
                }
                monto_monedero{
                    monto 
                }
                monto_transferencia{
                    monto 
                }
                monto_cheques{
                    monto 
                }
                monto_vales_despensa{
                    monto 
                }
            }
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