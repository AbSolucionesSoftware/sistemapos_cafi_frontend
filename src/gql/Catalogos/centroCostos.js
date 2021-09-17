import { gql } from '@apollo/client';

export const CREAR_CUENTA = gql`
	mutation crearCuenta($input: CrearCuentasInput) {
		crearCuenta(input: $input) {
			_id
			cuenta
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
export const CREAR_SUBCUENTA= gql`
	mutation crearSubcuenta($idCuenta: ID!, $input: CrearSubcuentasInput) {
		crearSubcuenta(idCuenta: $idCuenta, input: $input) {
			message
		}
	}
`;

export const ACTUALIZAR_CUENTA= gql`
	mutation actualizarCuenta($idCuenta: ID!, $input: ActualizarCuentasInput) {
		actualizarCuenta(idCuenta: $idCuenta, input: $input) {
			message
		}
	}
`;
export const ACTUALIZAR_SUBCUENTA = gql`
	mutation actualizarSubcuenta($idCuenta: ID!, $idSubcuenta: ID!, $input: ActualizarSubcuentasInput) {
		actualizarSubcuenta(idCuenta: $idCuenta, idSubcuenta: $idSubcuenta, input: $input) {
			message
		}
	}
`;

export const OBTENER_CUENTAS = gql`
	query obtenerCuentas($empresa: ID!, $sucursal: ID!) {
		obtenerCuentas(empresa: $empresa, sucursal: $sucursal) {
			_id
			cuenta
			subcuentas {
				_id
				subcuenta
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

export const ELIMINAR_CUENTA = gql`
	mutation eliminarCuenta($id: ID!) {
		eliminarCuenta(id: $id) {
			message
		}
	}
`; 
export const ELIMINAR_SUBCUENTA = gql`
	mutation eliminarSubcuenta($idCuenta: ID!, $idSubcuenta: ID!) {
		eliminarSubcuenta(idCuenta: $idCuenta, idSubcuenta: $idSubcuenta) {
			message
		}
	}
`; 