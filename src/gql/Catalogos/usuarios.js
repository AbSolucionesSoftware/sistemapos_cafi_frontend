import { gql } from '@apollo/client';

export const CREAR_USUARIO = gql`
	mutation crearUsuario($input: CrearUsuarioInput) {
		crearUsuario(input: $input) {
			_id
			numero_usuario
			nombre
			telefono
			celular
			email
			direccion {
				calle
				no_ext
				no_int
				codigo_postal
				colonia
				municipio
				localidad
				estado
				pais
			}
			imagen
			estado_usuario
			empresa {
				_id
				nombre_empresa
				correo_empresa
				nombre_dueno
				telefono_dueno
			}
			sucursal {
				_id
				nombre_sucursal
				descripcion
			}
		}
	}
`;

export const OBTENER_USUARIOS = gql`
	query obtenerUsuarios($sucursal: String!, $filtro: String) {
		obtenerUsuarios(sucursal: $sucursal, filtro: $filtro) {
			_id
			numero_usuario
			nombre
			telefono
			celular
			email
			direccion {
				calle
				no_ext
				no_int
				codigo_postal
				colonia
				municipio
				localidad
				estado
				pais
			}
			imagen
			estado_usuario
			empresa {
				_id
				nombre_empresa
				correo_empresa
				nombre_dueno
				telefono_dueno
			}
			sucursal {
				_id
				nombre_sucursal
				descripcion
			}
		}
	}
`;

export const ACTUALIZAR_USUARIO = gql`
	mutation actualizarUsuario($input: ActualizarUsuarioInput, $id: ID!) {
		actualizarUsuario(id: $id, input: $input) {
			message
		}
	}
`;
/* export const ELIMINAR_USUARIO = gql`
	
`;
 */