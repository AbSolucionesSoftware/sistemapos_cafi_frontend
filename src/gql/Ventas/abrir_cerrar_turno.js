import { gql } from "@apollo/client";

export const REGISTRAR_TURNOS = gql`
	mutation crearRegistroDeTurno( $input: AbrirCerrarTurnoInput, $activa: Boolean) {
		crearRegistroDeTurno(input: $input, activa: $activa) {
			horario_en_turno
			concepto
			numero_caja
			id_caja
			comentarios
			hora_entrada {
				hora
				minutos
				segundos
			}
			hora_salida{
				hora
				minutos
				segundos
			}
			fecha_entrada{
				year
				mes
				dia
				no_semana_year
				no_dia_year
			}
			fecha_salida{
				year
				mes
				dia
				no_semana_year
				no_dia_year
			}
			montos_en_caja {
				monto_efectivo
				monto_tarjeta_debito
				monto_tarjeta_credito
				monto_creditos
				monto_puntos
				monto_transferencia
				monto_cheques
				monto_vales_despensa
			}
			usuario_en_turno {
				numero_usuario
				nombre
			}
			empresa
			sucursal
		}
	}
`;

export const OBTENER_HISTORIAL_TURNOS = gql`
	query obtenerFiltroTurnos($input: HistorialTurnosInput, $empresa: ID!, $sucursal: ID!) {
		obtenerFiltroTurnos(input: $input, empresa: $empresa, sucursal: $sucursal) {
			horario_en_turno
			concepto
			numero_caja
			id_caja
			comentarios
			hora_entrada {
				hora
				minutos
				segundos
				completa
			}
			hora_salida{
				hora
				minutos
				segundos
				completa
			}
			fecha_entrada{
				year
				mes
				dia
				no_semana_year
				no_dia_year
				completa
			}
			fecha_salida{
				year
				mes
				dia
				no_semana_year
				no_dia_year
				completa
			}
			fecha_movimiento
			montos_en_caja {
				monto_efectivo
				monto_tarjeta_debito
				monto_tarjeta_credito
				monto_creditos
				monto_puntos
				monto_transferencia
				monto_cheques
				monto_vales_despensa
			}
			usuario_en_turno {
				numero_usuario
				nombre
			}
			empresa
			sucursal
		}
	}
`;