import { gql } from '@apollo/client';

export const REGISTRO_ALMACEN = gql`
    mutation CrearAlmacen($input: CrearAlmacen, $id: ID!, $empresa: ID! ){
        crearAlmacen(input: $input, id: $id, empresa: $empresa){
            message
        }
    }
`;
 
export const OBTENER_ALMACENES = gql`
    query obtenerAlmacenes( $id: ID! ){
        obtenerAlmacenes(id: $id){
            _id
            nombre_almacen
            id_usuario_encargado{
                _id
                nombre
            }
            id_sucursal{
                _id
                nombre_sucursal
                descripcion
                direccion{
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
            }
            direccion{
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
        }
    }
`;

export const ACTUALIZAR_ALMACEN = gql`
    mutation ActualizarAlmacen( $input: EditarAlmacen, $id: ID! ){
        actualizarAlmacen(input:$input, id: $id){
            message
        }
    }
`;
