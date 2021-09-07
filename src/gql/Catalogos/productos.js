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
			calzados {
				_id
				talla
				tipo
			}
			almacenes {
				_id
				nombre_almacen
			}
			centro_costos {
				_id
				cuenta
				subcuentas {
					_id
					subcuenta
				}
			}
		}
	}
`;

export const CREAR_PRODUCTO = gql`
	mutation crearProducto($input: CrearProductoInput) {
		crearProducto(input: $input) {
			message
		}
	}
`;

export const OBTENER_PRODUCTOS = gql`
	query obtenerProductos($empresa: ID!, $sucursal: ID!, $filtro: String) {
		obtenerProductos(empresa: $empresa, sucursal: $sucursal, filtro: $filtro) {
			_id
			centro_de_costos {
				id_cuenta
				cuenta
				id_subcuenta
				subcuenta
			}
			unidades_de_venta {
				_id
				precio
				cantidad
				unidad
				unidad_principal
				codigo_barras
				id_producto
				descuento_activo
				descuento {
					porciento
					dinero_descontado
					precio_con_descuento
				}
				default
			}
			datos_generales {
				codigo_barras
				clave_alterna
				tipo_producto
				nombre_comercial
				nombre_generico
				descripcion
				id_categoria
				categoria
				subcategoria
				id_subcategoria
				id_departamento
				departamento
				id_marca
				marca
				clave_producto_sat
				receta_farmacia
			}
			empresa
			imagenes {
				location_imagen
				extencion_imagen
				url_imagen
				key_imagen
			}
			precio_plazos {
				precio_cajas {
					plazo
					unidad
					precio
				}
				precio_piezas {
					plazo
					unidad
					precio
				}
				precio_costales {
					plazo
					unidad
					precio
				}
			}
			precios {
				ieps
				ieps_activo
				iva
				iva_activo
				monedero
				monedero_electronico
				precio_de_compra {
					ieps
					iva
					precio_con_impuesto
					precio_sin_impuesto
				}
				precios_producto {
					numero_precio
					precio_neto
					precio_venta
					unidad_mayoreo
					utilidad
				}
				unidad_de_compra {
					cantidad
					precio_unitario_con_impuesto
					precio_unitario_sin_impuesto
					unidad
				}
				inventario {
					inventario_minimo
					inventario_maximo
					unidad_de_inventario
				}
				granel
			}
			medidas_producto {
				_id
				cantidad
				codigo_barras
				color {
					_id
					nombre
					hex
				}
				existencia
				medida {
					_id
					talla
					tipo
				}
				nombre_comercial
				precio
			}
			inventario_general {
				_id
				cantidad_existente
			}
			medidas_registradas
			sucursal
			usuario
		}
	}
`;

export const ACTUALIZAR_PRODUCTO = gql`
	mutation actualizarProducto($id: ID!, $input: ActualizarProductoInput) {
		actualizarProducto(id: $id, input: $input) {
			message
		}
	}
`;

export const ELIMINAR_PRODUCTO = gql`
	mutation eliminarProducto($id:ID!) {
		eliminarProducto(id: $id) {
			message
		}
}
`;
