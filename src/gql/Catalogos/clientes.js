import { gql } from '@apollo/client';

export const CREAR_CLIENTE = gql`
	mutation crearCliente($input: CrearClienteInput) {
		crearCliente(input: $input) {
			_id
			numero_cliente
			clave_cliente
			representante
			nombre_cliente
			rfc
			curp
			telefono
			celular
			email
			numero_descuento
			limite_credito
			dias_credito
			razon_social
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
			estado_cliente
			tipo_cliente
		}
	}
`;

export const OBTENER_CLIENTES = gql`
	query obtenerClientes {
		obtenerClientes {
			_id
			numero_cliente
			clave_cliente
			representante
			nombre_cliente
			rfc
			curp
			telefono
			celular
			email
			numero_descuento
			limite_credito
			dias_credito
			razon_social
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
			estado_cliente
			tipo_cliente
		}
	}
`;

export const ACTUALIZAR_CLIENTE = gql`
	mutation actualizarCliente($input: ActualizarClienteInput, $id: ID!) {
		actualizarCliente(id: $id, input: $input) {
			message
		}
	}
`;
export const ELIMINAR_CLIENTE = gql`
	mutation eliminarCliente($id: ID!) {
		eliminarCliente(id: $id) {
			message
		}
	}
`;
