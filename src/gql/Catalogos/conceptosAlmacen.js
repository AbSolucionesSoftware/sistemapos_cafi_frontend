import { gql } from '@apollo/client';

export const OBTENER_CONCEPTOS_ALMACEN = gql`
    query ObtenerConceptosAlmacen($empresa: ID!, $sucursal: ID!){
        obtenerConceptosAlmacen(empresa: $empresa, sucursal: $sucursal){
                _id
            nombre_concepto
            tipo
            empresa{
                _id
                nombre_empresa
            }
                sucursal{
                _id
                nombre_sucursal
            }
        }
    }
`;

export const REGISTRAR_CONCEPTO_ALMACEN = gql`
    mutation CrearConceptoAlmacen($input: ConceptoAlmacenInput, $empresa: ID!, $sucursal: ID!, $usuario: ID!){
        crearConceptoAlmacen(input:$input,empresa:$empresa,sucursal:$sucursal, usuario:$usuario){
            message
        }
    }
`;

export const ACTUALIZAR_CONCEPTO_ALMACEN = gql`
    mutation ActualizarConceptoAlmacen($input: ConceptoAlmacenInput, $id: ID!){
        actualizarConceptoAlmacen(input: $input, id: $id){
            message
        }
    }
`;

export const ELIMINAR_CONCEPTO_ALMACEN = gql`
    mutation EliminarConceptoAlmacen($id: ID!){
        eliminarConceptoAlmacen(id: $id){
            message
        }
    }
`;