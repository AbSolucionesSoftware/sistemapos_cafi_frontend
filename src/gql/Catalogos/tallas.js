import { gql } from '@apollo/client';

export const CREAR_TALLAS = gql`
	mutation crearTalla($input: CrearTallaInput) {
		crearTalla(input: $input) {
			_id
			talla
			tipo
			empresa {
				nombre
			}
		}
	}
`;

export const OBTENER_TALLAS = gql`
	query obtenerTallas($empresa: String!, $tipo: String) {
		obtenerTallas(empresa: $empresa, tipo: $tipo) {
			_id
			talla
			tipo
			empresa {
				_id
			}
		}
	}
`;

export const ACTUALIZAR_TALLA = gql`
	mutation actualizarTalla($input: ActualizarTallaInput, $id: ID!) {
		actualizarTalla(id: $id, input: $input) {
			message
		}
	}
`;
export const ELIMINAR_TALLA = gql`
	mutation eliminarTalla($id: ID!) {
		eliminarTalla(id: $id) {
			message
		}
	}
`;
