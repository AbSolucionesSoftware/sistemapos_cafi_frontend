import { gql } from '@apollo/client';

export const REGISTRAR_DESCUENTOS = gql`
	mutation CrearDescuentoUnidad($input: DescuentoUnidadesInput!){
        crearDescuentoUnidad(input: $input){
            message
        }
    }
`;

export const ACTUALIZAR_DESCUENTOS = gql`
	mutation ActualizarDescuentoUnidad($input: [DescuentoUnidadesInput]){
        actualizarDescuentoUnidad(input: $input){
            message
        }
    }
`;

export const DESACTIVAR_DESCUENTOS = gql`
	mutation DesactivarDescuentoUnidad($id: ID!){
        desactivarDescuentoUnidad(id: $id){
            message
        }
    }
`;