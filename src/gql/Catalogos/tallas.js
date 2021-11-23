import { gql } from '@apollo/client';

export const CREAR_TALLAS = gql`
	mutation crearTalla($input: CrearTallaInput) {
		crearTalla(input: $input) {
			_id
			talla
			tipo
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

export const OBTENER_TALLAS = gql`
	query obtenerTallas($sucursal: String!, $tipo: String! ) {
		obtenerTallas(sucursal: $sucursal, tipo: $tipo) {
			_id
			talla
			tipo
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
