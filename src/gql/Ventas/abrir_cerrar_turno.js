import { gql } from "@apollo/client";

export const REGISTRAR_TURNOS = gql`
	mutation crearRegistroDeTurno( $input: AbrirCerrarTurnoInput, $activa: Boolean) {
		crearRegistroDeTurno(input: $input, activa: $activa) {
			message
		}
	}
`;