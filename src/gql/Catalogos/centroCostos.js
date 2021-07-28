import { gql } from '@apollo/client';

export const CREAR_COSTO = gql`
	mutation crearCosto($input: CrearCostosInput) {
		crearCosto(input: $input) {
			_id
			costo
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
export const CREAR_SUBCOSTO= gql`
	mutation crearSubcosto($idCosto: ID!, $input: CrearSubcostosInput) {
		crearSubcosto(idCosto: $idCosto, input: $input) {
			message
		}
	}
`;

export const ACTUALIZAR_COSTO= gql`
	mutation actualizarCosto($idCosto: ID!, $input: ActualizarCostosInput) {
		actualizarCosto(idCosto: $idCosto, input: $input) {
			message
		}
	}
`;
export const ACTUALIZAR_SUBCOSTO = gql`
	mutation actualizarSubcosto($idCosto: ID!, $idSubcosto: ID!, $input: ActualizarSubcostosInput) {
		actualizarSubcosto(idCosto: $idCosto, idSubcosto: $idSubcosto, input: $input) {
			message
		}
	}
`;

export const OBTENER_COSTOS = gql`
	query obtenerCostos($empresa: ID!, $sucursal: ID!) {
		obtenerCostos(empresa: $empresa, sucursal: $sucursal) {
			_id
			costo
			subcostos {
				_id
				subcosto
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

export const ELIMINAR_COSTO = gql`
	mutation eliminarCosto($id: ID!) {
		eliminarCosto(id: $id) {
			message
		}
	}
`; 
export const ELIMINAR_SUBCOSTO = gql`
	mutation eliminarSubcosto($idCosto: ID!, $idSubcosto: ID!) {
		eliminarSubcosto(idCosto: $idCosto, idSubcosto: $idSubcosto) {
			message
		}
	}
`; 