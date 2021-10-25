import React, { useState, useEffect, useContext } from "react";
import { OBTENER_CLIENTES_VENTAS } from "../../gql/Ventas/ventas_generales";
import { useQuery } from "@apollo/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
// import { BlurLinear } from "@material-ui/icons";
// import { VentasContext } from "../../context/Ventas/ventasContext";
import { ClienteCtx } from '../../context/Catalogos/crearClienteCtx';

export default function ClientesVentas() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const { setUpdateClientVenta, updateClientVenta } =
  useContext(ClienteCtx);

  const [selectClient, setSelectClient] = useState({});

  const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES_VENTAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
    fetchPolicy: "network-only"
  });

  // console.log("data",data);
  let obtenerClientes = [];
  if (data) obtenerClientes = data.obtenerClientesVentas;
  console.log(obtenerClientes);

  useEffect(() => {
    console.log("llego al final");
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    if (venta !== null) {
      setSelectClient(venta.cliente);
    }
    refetch();
  }, [updateClientVenta]);

  const ChangeClientAutocomplate = (value) => {
    try {
      console.log(value);
      setSelectClient(value);
      let venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let VentasProducto = venta === null ? {} : venta;
      VentasProducto.cliente = value;
      VentasProducto.venta_cliente = true;
      localStorage.setItem("DatosVentas", JSON.stringify(VentasProducto));
      setUpdateClientVenta(!updateClientVenta);
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
        onClose={() => console.log("datos")}
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
