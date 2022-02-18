import React, { useState, useEffect, useContext } from "react";
import { OBTENER_CLIENTES_VENTAS } from "../../gql/Ventas/ventas_generales";
import { useQuery } from "@apollo/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
// import { BlurLinear } from "@material-ui/icons";
// import { VentasContext } from "../../context/Ventas/ventasContext";
import { ClienteCtx } from '../../context/Catalogos/crearClienteCtx';
import { VentasContext } from "../../context/Ventas/ventasContext";

export default function ClientesVentas() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const { setUpdateClientVenta, updateClientVenta } = useContext(ClienteCtx);
  const { setClientesVentas } = useContext(VentasContext);

  const [selectClient, setSelectClient] = useState({});

  // console.log(sesion.empresa._id);
  // console.log(sesion.sucursal._id);

  const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES_VENTAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
    fetchPolicy: "network-only"
  });

  // console.log(error);
  // console.log("data",data);
  let obtenerClientes = [];
  if (data) obtenerClientes = data.obtenerClientesVentas;
  // console.log(obtenerClientes);

  useEffect(() => {
    const data = () => {
      // console.log("llego al final");
      const venta = JSON.parse(localStorage.getItem("DatosVentas"));
      if (venta !== null) {
        setSelectClient(venta.cliente);
        setClientesVentas(venta.cliente);
        refetch();
      }
    }
    data();
  }, [refetch, updateClientVenta]);

  const ChangeClientAutocomplate = (value) => {
    try {
      // console.log(value);
      const venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let venta_actual = venta === null ? {} : venta;
      setSelectClient(value);
      
      // console.log(venta_actual);
      let dataCliente = {
          subTotal:
            venta_actual.subTotal === undefined ? 0 : venta_actual.subTotal,
          total: venta_actual.total === undefined ? 0 : venta_actual.total,
          impuestos:
            venta_actual.impuestos === undefined ? 0 : venta_actual.impuestos,
          iva: venta_actual.iva === undefined ? 0 : venta_actual.iva,
          ieps: venta_actual.ieps === undefined ? 0 : venta_actual.ieps,
          descuento:
            venta_actual.descuento === undefined ? 0 : venta_actual.descuento,
          monedero: venta_actual.monedero === undefined ? 0 : venta_actual.monedero,
          // tipo_cambio: venta_actual.tipo_cambio ? venta_actual.tipo_cambio : {},
          venta_cliente: value === null ? false : true,
          productos:
            venta_actual.productos?.length > 0 ? venta_actual. productos : [],
      }
      if(value !== null) dataCliente = {...dataCliente, cliente: value, }
      localStorage.setItem("DatosVentas",JSON.stringify(dataCliente));
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
