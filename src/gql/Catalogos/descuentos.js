import { gql } from '@apollo/client';

export const REGISTRAR_DESCUENTOS = gql`
	mutation CrearDescuentoUnidad($input: ObjetoDescuentoUnidadesInput!){
        crearDescuentoUnidad(input: $input){
            message
        }
  }
`;

export const ACTUALIZAR_DESCUENTOS = gql`
	mutation ActualizarDescuentoUnidad($input: ObjetoDescuentoUnidadesInput!){
        actualizarDescuentoUnidad(input: $input){
            message
        }
    }
`;

export const DESACTIVAR_DESCUENTOS = gql`
	mutation DesactivarDescuentoUnidad($input: ActivarDescuentoUnidades , $id: ID!){
        desactivarDescuentoUnidad(input: $input, id: $id){
            message
        }
    }
`;

export const ELIMINAR_DESCUENTOS = gql`
	mutation ELiminarDescuentoUnidad( $id: ID!){
        eliminarDescuentoUnidad( id: $id){
            message
        }
    }
`;