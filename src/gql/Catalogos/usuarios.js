import { gql } from '@apollo/client';

export const OBTENER_USUARIOS = gql`
    query obtenerUsuarios( $sucursal: String! ){
        obtenerUsuarios(sucursal: $sucursal){
            _id
            numero_usuario
            nombre
        }
    }
`;