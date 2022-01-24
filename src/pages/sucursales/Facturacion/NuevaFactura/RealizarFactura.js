import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DoneIcon from "@material-ui/icons/Done";
import moment from "moment";
import { verificarDatosFactura } from "./validacion_factura";
import { factura_initial_state } from "./initial_factura_states";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx";
import { CREAR_FACTURA } from "../../../../gql/Facturacion/Facturacion";
import { useMutation } from "@apollo/client";
import { formaPago, metodoPago, tiposCfdi, usosCfdi } from "../catalogos";
import { Done } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RealizarFactura({ setAlert }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    datosFactura,
    setDatosFactura,
    codigo_postal,
    setCodigoPostal,
    productosFactura,
    setProductosFactura,
    setError,
  } = useContext(FacturacionCtx);

  const [CrearFactura] = useMutation(CREAR_FACTURA);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const limpiarCampos = () => {
    setDatosFactura(factura_initial_state);
    setProductosFactura([]);
    setCodigoPostal("");
  };

  const crearFactura = async () => {
    try {
      setLoading(true);
      let nuevo_obj = { ...datosFactura };
      const productos = [
        {
          ProductCode: "50202306",
          IdentificationNumber: "61b7bf6e3454b727a0c2e357",
          Description: "COCACOLA",
          /* Unit: "Unidad de Servicio", */
          UnitCode: "XBX",
          UnitPrice: "36",
          Quantity: "1",
          Subtotal: "36",
          Discount: "5.4",
          Taxes: [
            {
              Total: "4.89",
              Name: "IVA",
              Base: "30.6",
              Rate: "0.16",
              IsRetention: "false",
            },
          ],
          Total: "35.49",
        },
      ];

      //poner la fecha de facturacion
      if (datosFactura.date === "1") {
        nuevo_obj.date = moment()
          .subtract(1, "d")
          .format("YYYY-MM-DDTHH:mm:ss");
      } else if (datosFactura.date === "2") {
        nuevo_obj.date = moment()
          .subtract(2, "d")
          .format("YYYY-MM-DDTHH:mm:ss");
      } else {
        nuevo_obj.date = moment().format("YYYY-MM-DDTHH:mm:ss");
      }

      nuevo_obj.items = productos;
      nuevo_obj.expedition_place = codigo_postal;

      /* validar todos los datos */
      const validate = verificarDatosFactura(nuevo_obj);

      console.log(nuevo_obj);
      if (validate.length) {
        setError({ status: true, message: validate[0].message });
        setLoading(false);
        return;
      }
      setError({ status: false, message: "" });

      /* let result = await CrearFactura({
        variables: {
          input: nuevo_obj,
        },
      });
      console.log("result", result); */
      setLoading(false);
      /* setAlert({
        message: `¡Listo! ${result.data.crearFactura.message}`,
        status: "success",
        open: true,
      }); */
      /* limpiarCampos(); */
    } catch (error) {
      console.log(error);
      console.log(error.response);
      setLoading(false);
      if (error.response) {
        setAlert({
          message: error.response,
          status: "error",
          open: true,
        });
      } else if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  return (
    <div>
      <Button
        color="primary"
        startIcon={<DoneIcon />}
        size="large"
        onClick={() => handleClickOpen()}
      >
        Generar CFDI
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <InputsFacturaModal />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          <Button startIcon={<Done />} onClick={() => crearFactura()} color="primary">
            Realizar Factura
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const InputsFacturaModal = () => {
  const { datosFactura, setDatosFactura, error_validation } = useContext(
    FacturacionCtx
  );

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setDatosFactura({
      ...datosFactura,
      [name]: value,
    });
  };

  const obtenerUsoCfdi = (e) => {
    const { name, value } = e.target;
    setDatosFactura({
      ...datosFactura,
      receiver: {
        ...datosFactura.receiver,
        [name]: value,
      },
    });
  };

  return (
    <Box>
      <Box my={1}>
        <Typography>Fecha de facturación</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          name="date"
          error={error_validation.status && !datosFactura.date}
        >
          <Select value={datosFactura.date} name="date" onChange={obtenerDatos}>
            <MenuItem value="">
              <em>Selecciona una fecha</em>
            </MenuItem>
            <MenuItem value="0">{moment().format("LL")}</MenuItem>
            <MenuItem value="1">
              {moment().subtract(1, "d").format("LL")}
            </MenuItem>
            <MenuItem value="2">
              {moment().subtract(2, "d").format("LL")}
            </MenuItem>
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.date
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box my={1}>
        <Typography>Forma de pago</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          name="payment_form"
          error={error_validation.status && !datosFactura.payment_form}
        >
          <Select
            value={datosFactura.payment_form}
            name="payment_form"
            onChange={obtenerDatos}
          >
            <MenuItem value="">
              <em>Selecciona uno</em>
            </MenuItem>
            {formaPago.map((res, index) => (
              <MenuItem
                key={index}
                value={res.Value}
              >{`${res.Value} - ${res.Name}`}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.payment_form
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box my={1}>
        <Typography>Método de pago</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          name="payment_method"
          error={error_validation.status && !datosFactura.payment_method}
        >
          <Select
            value={datosFactura.payment_method}
            name="payment_method"
            onChange={obtenerDatos}
          >
            <MenuItem value="">
              <em>Selecciona uno</em>
            </MenuItem>
            {metodoPago.map((res, index) => (
              <MenuItem
                key={index}
                value={res.Value}
              >{`${res.Value} - ${res.Name}`}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.payment_method
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <Typography>Uso de CFDi</Typography>
        <FormControl
          fullWidth
          size="small"
          variant="outlined"
          fullWidth
          error={error_validation.status && !datosFactura.receiver.CfdiUse}
        >
          <Select
            value={datosFactura.receiver.CfdiUse}
            name="CfdiUse"
            onChange={obtenerUsoCfdi}
          >
            <MenuItem value="">
              <em>Selecciona uno</em>
            </MenuItem>
            {usosCfdi.map((res, index) => (
              <MenuItem
                key={index}
                value={res.Value}
              >{`${res.Value} - ${res.Name}`}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.receiver.CfdiUse
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
};
