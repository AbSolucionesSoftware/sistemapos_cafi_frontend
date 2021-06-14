import { gql } from '@apollo/client';

export const CREAR_COLOR = gql`
	mutation crearColor($input: CrearColorInput) {
		crearColor(input: $input) {
			_id
			nombre
			hex
			empresa {
				nombre_empresa
				correo_empresa
				nombre_dueno
				telefono_dueno
				sucursales_activas
				limite_sucursales
				_id
			}
		}
	}
`;

export const OBTENER_COLORES = gql`
	query obtenerColores($empresa: String!) {
		obtenerColores(empresa: $empresa) {
			_id
			nombre
			hex
			empresa {
				nombre_empresa
				correo_empresa
				nombre_dueno
				telefono_dueno
				sucursales_activas
				limite_sucursales
				_id
			}
		}
	}
`;

export const ACTUALIZAR_COLOR = gql`
	mutation actualizarColor($input: ActualizarColorInput, $id: ID!) {
		actualizarColor(id: $id, input: $input) {
			message
		}
	}
`;
export const ELIMINAR_COLOR = gql`
	mutation eliminarColor($id: ID!) {
		eliminarColor(id: $id) {
			message
		}
	}
`;
