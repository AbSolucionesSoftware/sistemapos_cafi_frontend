import { gql } from '@apollo/client';

export const OBTENER_CONSULTAS = gql`
	query obtenerConsultasProducto($empresa: ID!, $sucursal: ID!) {
		obtenerConsultasProducto(empresa: $empresa, sucursal: $sucursal) {
			categorias {
				_id
				categoria
				subcategorias {
					_id
					subcategoria
				}
			}
			departamentos {
				_id
				nombre_departamentos
			}
			marcas {
				_id
				nombre_marca
			}
			colores {
				_id
				nombre
				hex
			}
			tallas {
				_id
				talla
				tipo
			}
		}
	}
`;

export const CREAR_PRODUCTO = gql`
	mutation crearProducto($input: CrearProductoInput) {
		crearProducto(input: $input) {
			_id
			imagenes {
				url_imagen
				key_imagen
			}
		}
	}
`;

/* export const OBTENER_TALLAS = gql`
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
`; */

/* export const ACTUALIZAR_TALLA = gql`
	mutation actualizarTalla($input: ActualizarTallaInput, $id: ID!) {
		actualizarTalla(id: $id, input: $input) {
			message
		}
	}
`; */
/* export const ELIMINAR_TALLA = gql`
	mutation eliminarTalla($id: ID!) {
		eliminarTalla(id: $id) {
			message
		}
	}
`; */
