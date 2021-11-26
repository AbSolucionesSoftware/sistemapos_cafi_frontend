import { gql } from '@apollo/client';

export const CREAR_CODIGO_PRODUCTO = gql`
	mutation crearCodigoProducto($input: CodigoCatalogoProductoInput ) {
		crearCodigoProducto(input:$input) {
			message
    }
	}
`;
/* 
export const OBTENER_COLORES = gql`
	query obtenerColores($sucursal: String!) {
		obtenerColores(sucursal: $sucursal) {
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
			sucursal {
				_id
				nombre_sucursal
				descripcion
			}
		}
	}
`; */

/* export const ELIMINAR_COLOR = gql`
	mutation eliminarColor($id: ID!) {
		eliminarColor(id: $id) {
			message
		}
	}
`;
 */