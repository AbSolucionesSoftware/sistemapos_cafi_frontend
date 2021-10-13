import React, { useState, useEffect } from "react";
import { OBTENER_CLIENTES_VENTAS } from "../../gql/Ventas/ventas_generales";
import { useQuery } from "@apollo/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { BlurLinear } from "@material-ui/icons";

export default function ClientesVentas() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  console.log(sesion);

  const [selectClient, setSelectClient] = useState({});

  const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES_VENTAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
    // fetchPolicy: "network-only"
  });

  // console.log("data",data);
  let obtenerClientes = [];
  if (data) obtenerClientes = data.obtenerClientesVentas;
  console.log(obtenerClientes);

  useEffect(() => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    if (venta !== null) {
      setSelectClient(venta.cliente);
    }
  }, []);

  

  const ChangeClientAutocomplate = (value) => {
    try {
      console.log(value);
      setSelectClient(value);
    } catch (error) {
      console.log(error);
    }
  };


  if (loading) return null;

  return (
    <div>
      <Autocomplete
        id="combo-box-producto-codigo"
        size="small"
        fullWidth
        options={obtenerClientes}
        getOptionLabel={(option) =>
          option.nombre_cliente ? option.nombre_cliente : "N/A"
        }
        renderInput={(params) => <TextField {...params} variant="outlined" />}
        onChange={(_, value) => ChangeClientAutocomplate(value)}
        getOptionSelected={(option) => option.nombre_cliente}
        value={selectClient ? selectClient : null}
      />
    </div>
  );
}
