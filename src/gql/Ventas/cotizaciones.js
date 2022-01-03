import { gql } from "@apollo/client";

export const CREAR_COTIZACION = gql`
mutation crearCotizacion( $input: CrearVentasInput!, $empresa: ID!, $sucursal: ID!, $usuario: ID!, $caja: ID!) {
    crearCotizacion(input: $input, empresa: $empresa, sucursal: $sucursal, usuario: $usuario, caja: $caja, ) {
			message
		}
	}
`;