import { gql } from '@apollo/client';

export const CREAR_FACTURA = gql`
	mutation crearFactura( $input: CrearFacturaInput) {
		crearFactura(input: $input) {
			message
		}
	}
`;

export const CONSULTA_CATALOGOS_SAT_API = gql`
	query obtenerCatalogosSAT($input: CrearFacturaInput!) {
		obtenerCatalogosSAT(input: $input) {
			message
            currencies{
                Decimals
                PrecisionRate
                Name
                Value
            }
            paymentForms{
                Name
                Value
            }
            paymentMethods{
                Name
                Value
            }
            fiscalRegimens{
                Natural
                Moral
                Name
                Value
            }
            cfdiTypes{
                NameId
                Name
                Value
            }
	    }
	}
`;

export const CONSULTA_PRODUCTOS_SERVICIOS_SAT_API = gql`
	query obtenerProductosOServicios($input: CrearFacturaInput!) {
		obtenerProductosOServicios(input: $input) {
            message
            productosOServicios{
                DangerousMaterial
                Complement
                Name
                Value
   			 
            }
	    }
	}
`;

export const CONSULTA_POSTAL_CODES_SAT_API = gql`
	query obtenerCodigoPostal($input: CrearFacturaInput!) {
		obtenerCodigoPostal(input: $input) {
            message
            codigoPostal{
                StateCode
                MunicipalityCode
                LocationCode
                Name
                Value
   			 
            }
	    }
	}
`;


export const CONSULTA_CFDIU_USES_SAT_API = gql`
	query obtenerCfdiUses($input: CrearFacturaInput!) {
		obtenerCfdiUses(input: $input) {
            message
            cfdiUses{
                message
                Natural
                Moral
                Name
                Value
            }
	    }
	}
`;
