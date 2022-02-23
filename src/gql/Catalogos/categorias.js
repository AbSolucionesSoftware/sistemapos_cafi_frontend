import { gql } from '@apollo/client';
 
export const CREAR_CATEGORIA = gql`
	mutation crearCategoria($input: CrearCategoriasInput) {
		crearCategoria(input: $input) {
			_id
			categoria
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
export const CREAR_SUBCATEGORIA = gql`
	mutation crearSubcategoria($idCategoria: ID!, $input: CrearSubcategoriasInput) {
		crearSubcategoria(idCategoria: $idCategoria, input: $input) {
			message
		}
	}
`;

export const ACTUALIZAR_CATEGORIA = gql`
	mutation actualizarCategoria($idCategoria: ID!, $input: ActualizarCategoriasInput) {
		actualizarCategoria(idCategoria: $idCategoria, input: $input) {
			message
		}
	}
`;
export const ACTUALIZAR_SUBCATEGORIA = gql`
	mutation actualizarSubcategoria($idCategoria: ID!, $idSubcategoria: ID!, $input: ActualizarSubcategoriasInput) {
		actualizarSubcategoria(idCategoria: $idCategoria, idSubcategoria: $idSubcategoria, input: $input) {
			message
		}
	}
`;

export const OBTENER_CATEGORIAS = gql`
	query obtenerCategorias($empresa: ID!, $sucursal: ID!) {
		obtenerCategorias(empresa: $empresa, sucursal: $sucursal) {
			_id
			categoria
			subcategorias {
				_id
				subcategoria
			}
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
export const ELIMINAR_CATEGORIA = gql`
	mutation eliminarCategoria($idCategoria: ID!) {
		eliminarCategoria(idCategoria: $idCategoria) {
			message
		}
	}
`; 

export const ELIMINAR_SUBCATEGORIA = gql`
	mutation eliminarSubcategoria($idCategoria: ID!, $idSubcategoria: ID!) {
		eliminarSubcategoria(idCategoria: $idCategoria, idSubcategoria: $idSubcategoria) {
			message
		}
	}
`;