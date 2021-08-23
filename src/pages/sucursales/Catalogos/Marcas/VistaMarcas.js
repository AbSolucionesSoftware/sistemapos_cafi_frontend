import React, { useState, useContext } from 'react';
import {
    Button,
    Box,
    TextField
} from '@material-ui/core';
import ListaMarcas from './ListaMarcas';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import { Add } from '@material-ui/icons';
import { /* OBTENER_MARCAS, */ REGISTRAR_MARCAS } from '../../../../gql/Catalogos/marcas';
import { useMutation } from '@apollo/client';
import { CreateMarcasContext } from '../../../../context/Catalogos/Marcas';


export default function VistaMarcas({ accion }) {

    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const [ data, setData ] = useState({
        nombre_marca: ""
    });
    const [updateData, setUpdateData] = useState(false);
    const { /* datosMarcas, setDatosMarcas, */ error, setError } = useContext(CreateMarcasContext);

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    const [ CrearMarca ] = useMutation(REGISTRAR_MARCAS);
	// const [  ] = useMutation(ACTUALIZAR_MARCAS);

    const obtenerDatos = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const saveData = async () => {
        try {
            if(!data.nombre_marca){
                setError(true);
			    return;
            }else{
                if(accion === "registrar"){
                    const input = data;
                    await CrearMarca({
                        variables: {
                            input,
                            empresa: sesion.empresa._id,
							sucursal: sesion.sucursal._id
                        }
                    });
                }else{

                }
                setUpdateData(!updateData);
                setAlert({ message: '¡Listo!', status: 'success', open: true });
                setError(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
            <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                <TextField
                    id="outlined-error-helper-text"
                    label="Nombre departamento"
                    value={data.nombre_marca}
                    name="nombre_marca"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={obtenerDatos}
                    error={error}
                />
                <Box ml={1} />
                <Button color="primary" variant="contained" size="large" disableElevation onClick={saveData} >
                    <Add />Guardar
                </Button>
            </Box>
            <ListaMarcas updateData={updateData} />
        </div>
    )
}
