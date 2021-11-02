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
    const data = () => {
      console.log("llego al final");
      const venta = JSON.parse(localStorage.getItem("DatosVentas"));
      if (venta !== null) {
        setSelectClient(venta.cliente);
        refetch();
      }
    }
    data();
  }, [refetch, updateClientVenta]);

  const ChangeClientAutocomplate = (value) => {
    try {
      console.log(value);
      const venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let venta_actual = venta === null ? {} : venta;
      setSelectClient(value);
      console.log(value);
      console.log(venta_actual);
      if(value === null){
        localStorage.setItem(
          "DatosVentas",
          JSON.stringify({
            subTotal:
              venta_actual.subTotal === undefined ? 0 : venta_actual.subTotal,
            total: venta_actual.total === undefined ? 0 : venta_actual.total,
            impuestos:
              venta_actual.impuestos === undefined ? 0 : venta_actual.impuestos,
            iva: venta_actual.iva === undefined ? 0 : venta_actual.iva,
            ieps: venta_actual.ieps === undefined ? 0 : venta_actual.ieps,
            descuento:
              venta_actual.descuento === undefined ? 0 : venta_actual.descuento,
            tipo_cambio: venta_actual.tipo_cambio ? venta_actual.descuento : {},
            venta_cliente: false,
            productos:
              venta_actual.productos?.length > 0 ? venta_actual. productos : [],
          })
        );
        setUpdateClientVenta(!updateClientVenta);
      }else{
        localStorage.setItem(
          "DatosVentas",
          JSON.stringify({
            subTotal:
              venta_actual.subTotal === undefined ? 0 : venta_actual.subTotal,
            total: venta_actual.total === undefined ? 0 : venta_actual.total,
            impuestos:
              venta_actual.impuestos === undefined ? 0 : venta_actual.impuestos,
            iva: venta_actual.iva === undefined ? 0 : venta_actual.iva,
            ieps: venta_actual.ieps === undefined ? 0 : venta_actual.ieps,
            descuento:
              venta_actual.descuento === undefined ? 0 : venta_actual.descuento,
            tipo_cambio: venta_actual.tipo_cambio ? venta_actual.descuento : {},
            cliente: value,
            venta_cliente: true,
            productos:
              venta_actual.productos?.length > 0 ? venta_actual.productos : [],
          })
        );
        setUpdateClientVenta(!updateClientVenta);
      }

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
