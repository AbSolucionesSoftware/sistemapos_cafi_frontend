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
			turno_en_caja_activo
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
			accesos {
				mi_empresa {
					datos_empresa {
						ver
						agregar
						editar
						eliminar
					}
					informacion_fiscal {
						ver
						agregar
						editar
						eliminar
					}
				}
				catalogos {
					clientes {
						ver
						agregar
						editar
						eliminar
					}
					usuarios {
						ver
						agregar
						editar
						eliminar
					}
					marcas {
						ver
						agregar
						editar
						eliminar
					}
					contabilidad {
						ver
						agregar
						editar
						eliminar
					}
					provedores {
						ver
						agregar
						editar
						eliminar
					}
					cajas {
						ver
						agregar
						editar
						eliminar
					}
					departamentos {
						ver
						agregar
						editar
						eliminar
					}
					centro_costos {
						ver
						agregar
						editar
						eliminar
					}
					conceptos_almacen {
						ver
						agregar
						editar
						eliminar
					}
					categorias {
						ver
						agregar
						editar
						eliminar
					}
					colores {
						ver
						agregar
						editar
						eliminar
					}
					colores {
						ver
						agregar
						editar
						eliminar
					}
					tallas_numeros {
						ver
						agregar
						editar
						eliminar
					}
				}
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
			turno_en_caja_activo
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
			accesos {
				mi_empresa {
					datos_empresa {
						ver
						agregar
						editar
						eliminar
					}
					informacion_fiscal {
						ver
						agregar
						editar
						eliminar
					}
				}
				catalogos {
					clientes {
						ver
						agregar
						editar
						eliminar
					}
					usuarios {
						ver
						agregar
						editar
						eliminar
					}
					marcas {
						ver
						agregar
						editar
						eliminar
					}
					contabilidad {
						ver
						agregar
						editar
						eliminar
					}
					provedores {
						ver
						agregar
						editar
						eliminar
					}
					cajas {
						ver
						agregar
						editar
						eliminar
					}
					departamentos {
						ver
						agregar
						editar
						eliminar
					}
					centro_costos {
						ver
						agregar
						editar
						eliminar
					}
					conceptos_almacen {
						ver
						agregar
						editar
						eliminar
					}
					categorias {
						ver
						agregar
						editar
						eliminar
					}
					colores {
						ver
						agregar
						editar
						eliminar
					}
					tallas_numeros {
						ver
						agregar
						editar
						eliminar
					}
				}
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

export const LOGEAR_USUARIO = gql`
	mutation logearUsuario($input: LogearUsuarioInput) {
		logearUsuario(input: $input) {
			token
		}
	}
`;

export const AGIGNAR_PERMISOS_USUARIO = gql`
	mutation asignarAccesosUsuario($input: CrearArregloDeAccesosInput, $id: ID!) {
		asignarAccesosUsuario(id: $id, input: $input) {
			message
		}
}
`;