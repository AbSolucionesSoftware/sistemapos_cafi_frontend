import React, { useState, useEffect } from "react";
import useStyles from "../styles";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
// import tarjetaIcon from "../../../icons/ventas/tarjeta-de-credito.svg";
import { FcDonate, FcShop } from "react-icons/fc";
// import { Search } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import CreditCardIcon from '@material-ui/icons/CreditCard';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

import ClearIcon from '@material-ui/icons/Clear';

import { Edit, ImportExport } from "@material-ui/icons";

import { FcBusinessman, FcSalesPerformance } from "react-icons/fc";
// import { parse } from "graphql";
import { numerosRandom } from '../../../config/reuserFunctions';
import { formaPago } from '../../../pages/sucursales/Facturacion/catalogos';

import { CREAR_VENTA } from '../../../gql/Ventas/ventas_generales'; 
import { useMutation } from "@apollo/client";
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CerrarVenta() {
  const classes = useStyles();
  const [cambio, setCambio] = useState(false);

  const abrirCajon = () => {
    setCambio(!cambio);
  };
  const [open, setOpen] = useState(false);

  const [openModalDescuento, setOpenModalDescuento] = useState(false);

  const [totalVenta, setTotalVenta] = useState(0);
  const [montoPagado, setMontoPagado] = useState(0);
  const [cambioVenta, setCambioVenta] = useState(0);
  const [datosCliente, setDatosCliente] = useState({});
  const [monedero, setMonedero] = useState(0);
  const [descuentoVenta, setDescuentoVenta] = useState(0);


  const [fechaVencimientoDate, setfechaVencimientoDate] = useState('');

  const [valorPuntoProducto, setValorPuntoProducto] = useState(0.5);

  
  const [monederoTotal, setMonederoTotal] = useState(0);
  const [ventaActual, setVentaActual] = useState(0);

  const [editableClient, setEditableClient] = useState(true);

  const [visible, setVisible] = useState(false);


  //States de los montos a pagar

  const [efectivo, setEfectivo] = useState(0);
  const [tarjeta, setTarjeta] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [transferencia, setTransferencia] = useState(0);
  const [cheque, setCheque] = useState(0);

  const [createVenta] = useMutation(CREAR_VENTA);

  const handleClickOpen = () => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    setVentaActual(venta);
    const total = venta === null ? 0 : venta.total;
    const monederoVenta = venta === null ? 0 : venta.monedero;
    const cliente = venta === null ? {} : venta.cliente;
    console.log(monederoVenta);
    // console.log(venta);
    setTotalVenta(total.toFixed(2));
    setEfectivo(total.toFixed(2));
    setOpen(!open);
    setDatosCliente(cliente);
    setMonedero(parseFloat(monederoVenta));
    setMonederoTotal(cliente.monedero_electronico === null ? parseFloat(monederoVenta) : parseFloat(cliente.monedero_electronico) + parseFloat(monederoVenta))
    
  };

  function funcion_tecla(event) {
    const tecla_escape = event.keyCode;
    if (tecla_escape === 27) {
      handleClickOpen();
    }
  }

  const handleClickFinishVenta = async () => {
    try {
      const sesion = JSON.parse(localStorage.getItem("turnoEnCurso"));
      const usuario = JSON.parse(localStorage.getItem('sesionCafi'));

      const ventaFinal = {...ventaActual};

      //Generar folio
      const folio = numerosRandom(100000000000,999999999999);
      console.log(folio);
      //Agregar los montos en caja
      const montosEnCaja = {
        monto_efectivo: {
          monto: efectivo,
          metodo_pago: formaPago[0].Value
        },
        monto_tarjeta_debito: {
          monto: tarjeta,
          metodo_pago: formaPago[3].Value
        },
        monto_tarjeta_credito: {
          monto: 0,
          metodo_pago: formaPago[3].Value
        },
        monto_creditos: {
          monto: 0,
          metodo_pago: ""
        },
        monto_monedero: {
          monto: puntos,
          metodo_pago: formaPago[4].Value
        },
        monto_transferencia: {
          monto: transferencia,
          metodo_pago: formaPago[2].Value
        },
        monto_cheques: {
          monto: cheque,
          metodo_pago: formaPago[1].Value
        },
        monto_vales_despensa: {
          monto: 0,
          metodo_pago: formaPago[6].Value
        }
      };
      ventaFinal.folio = `${folio}`;
      //Credito a credito false
      ventaFinal.credito = false;
      //Agregar descuentos de ventas
      ventaFinal.descuento_general_activo = false;
      ventaFinal.decuento_general = null;
      //Declarar dias de credito como false
      ventaFinal.dias_de_credito_venta = null;
      ventaFinal.fecha_de_vencimiento_credito = null;
      ventaFinal.fecha_vencimiento_cotizacion = null;
      //Enviar los datos

      console.log(ventaFinal);

      const venta_realizada = await createVenta({
        variables: {
            input: ventaFinal,
            empresa: sesion.empresa,
            sucursal: sesion.sucursal,
            usuario: usuario._id,
            caja: sesion.id_caja
        }
      });

      console.log(venta_realizada);

      //Mandar mensaje de cambio en dado caso de ser correcto

      //Mandar mensaje de error en dado caso de ser incorrecto

      //Quitar informacion de localstorage de ventas (Resetear)

      //cerrar modal de de finalizar venta

      console.log(ventaActual);
    } catch (error) {
      console.log(error);
      if(error.networkError.result){
				console.log(error.networkError.result.errors);
			}else if(error.graphQLErrors){
				console.log(error.graphQLErrors.message);
			}
    }
  }

  const handlerChangeValue = (e, location) => {
    switch (location) {
      case "EFECTIVO":
        setEfectivo(e.target.value);
        break;
      case "TARJETA":
        setTarjeta(e.target.value);
        break;

      case "PUNTOS":
        const valor = e.target.value != "" ? parseInt(e.target.value) : 0;
        console.log(e.target.value, valor);
        if(valor <= monederoTotal){
          const valor2 = valorPuntoProducto * parseFloat(valor);
          setPuntos(valor);
          setValorPuntoProducto(valor2);
          console.log("valor2 >>" , valor2)
        }
        break;
      case "TRANSFERENCIA":
        setTransferencia(e.target.value);
        break;
      case "CHEQUE":
        setCheque(e.target.value);
        break;
      default:
        return alert("Error de pago");
    }
  };

  window.onkeydown = funcion_tecla;

  console.log(fechaVencimientoDate);

  useEffect(() => {
    setfechaVencimientoDate(moment().add(datosCliente.dias_credito ? parseInt(datosCliente.dias_credito) : 0,'days').format('YYYY-MM-DD'));
  }, [datosCliente, datosCliente.dias_credito]);


  

  useEffect(() => {
    setMontoPagado(
      parseFloat(efectivo) +
        parseFloat(tarjeta) +
        parseFloat(puntos) +
        parseFloat(transferencia) +
        parseFloat(cheque)
    );
  }, [efectivo, tarjeta, puntos, transferencia, cheque]);

  useEffect(() => {
    setCambioVenta(montoPagado - totalVenta);
  }, [montoPagado]);

  return (
    <>
      <Button className={classes.borderBotonChico} onClick={handleClickOpen}>
        <Box>
          <Box>
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart.svg"
              alt="icono ventas"
              style={{ width: 38 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Pagar</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>ESC</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Grid container item lg={12} >
            <Box display="flex" justifyContent="center" flexGrow={1}>
              <Box>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart.svg"
                  alt="icono ventas"
                  className={classes.iconSizeDialogsPequeno}
                />
              </Box>
              <Box m={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box mt={1} textAlign="center">
                <Typography variant="h4">Ticket</Typography>
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Grid>
          <Grid>
            <div className={classes.formInputFlex}>
              <Box width="25%" textAlign="center">
                <Box>
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/money.svg"
                    alt="icono ventas"
                    className={classes.iconSizeDialogsPequeno}
                    style={{ cursor: "pointer" }}
                  />
                </Box>
                <Typography variant="caption">Efectivo</Typography>
                <Box display="flex">
                  <TextField
                    fullWidth
                    size="small"
                    name="efectivo"
                    id="form-producto-efectivo"
                    variant="outlined"
                    value={efectivo}
                    onChange={(e) => handlerChangeValue(e, "EFECTIVO")}
                  />
                </Box>
              </Box>
              <Box width="25%" textAlign="center">
                <Box>
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/tarjeta-de-credito.svg"
                    alt="icono ventas"
                    className={classes.iconSizeDialogsPequeno}
                    style={{ cursor: "pointer" }}
                  />
                </Box>
                <Typography variant="caption">Tarjeta</Typography>
                <Box display="flex">
                  <TextField
                    fullWidth
                    size="small"
                    name="codigo_barras"
                    id="form-producto-codigo-barras"
                    variant="outlined"
                    value={tarjeta}
                    onChange={(e) => handlerChangeValue(e, "TARJETA")}
                  />
                </Box>
              </Box>
              <Box width="25%" textAlign="center">
                <Box>
                  <FcShop style={{ fontSize: 50, cursor: "pointer" }} />
                </Box>
                <Typography variant="caption">Puntos</Typography>
                <Box display="flex">
                  <TextField
                    fullWidth
                    size="small"
                    name="codigo_barras"
                    id="form-producto-codigo-barras"
                    variant="outlined"
                    value={puntos}
                    onChange={(e) => handlerChangeValue(e, "PUNTOS")}
                  />
                </Box>
              </Box>
              <Box width="25%" textAlign="center">
                <Box p={0}>
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/transferencia-bancaria.svg"
                    alt="icono ventas"
                    className={classes.iconSizeDialogsPequeno}
                    style={{ cursor: "pointer" }}
                  />
                </Box>
                <Typography variant="caption">Transferencia</Typography>
                <Box display="flex">
                  <TextField
                    fullWidth
                    size="small"
                    name="codigo_barras"
                    id="form-producto-codigo-barras"
                    variant="outlined"
                    value={transferencia}
                    onChange={(e) => handlerChangeValue(e, "TRANSFERENCIA")}
                  />
                </Box>
              </Box>
              <Box width="25%" textAlign="center">
                <Box p={0}>
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/cheque.png"
                    alt="icono ventas"
                    className={classes.iconSizeDialogsPequeno}
                    style={{ cursor: "pointer" }}
                  />
                </Box>
                <Typography variant="caption">Cheque</Typography>
                <Box display="flex">
                  <TextField
                    fullWidth
                    size="small"
                    name="codigo_barras"
                    id="form-producto-codigo-barras"
                    variant="outlined"
                    value={cheque}
                    onChange={(e) => handlerChangeValue(e, "CHEQUE")}
                  />
                </Box>
              </Box>
            </div>
            <div className={classes.formInputFlex}>
              <Box width="70%" textAlign="left">
                <Box display="flex">
                  <Box display="flex" alignItems={"center"} mr={2}>
                    <Box mt={0.5} mr={0.5}>
                      <FcBusinessman style={{ fontSize: 19 }} />
                    </Box>
                    <Typography variant="subtitle1">
                      <b>Cliente:</b>
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1">
                    {datosCliente ? datosCliente.nombre_cliente : "Sin cliente"}
                  </Typography>
                </Box>

                <Box display="flex">
                  <Box display="flex" alignItems={"center"} mr={2}>
                    <Box mt={0.5} mr={0.5}>
                      <FcSalesPerformance style={{ fontSize: 19 }} />
                    </Box>
                    <Typography variant="subtitle1">
                      <b>Puntos Generados:</b>
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1">{monedero}</Typography>
                </Box>

                <Box display="flex">
                  <Box display="flex" alignItems={"center"} mr={2}>
                    <Box mt={0.5} mr={0.5}>
                      <FcSalesPerformance style={{ fontSize: 19 }} />
                    </Box>
                    <Typography variant="subtitle1">
                      <b>Puntos Disponibles:</b>
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1">{!datosCliente.monedero_electronico ? 0 : datosCliente.monedero_electronico}</Typography>
                </Box>

                <Box display="flex">
                  <Box display="flex" alignItems={"center"} mr={2}>
                    <Box mt={0.5} mr={0.5}>
                      <FcSalesPerformance style={{ fontSize: 19 }} />
                    </Box>
                    <Typography variant="subtitle1">
                      <b>Total puntos:</b>
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1">{monederoTotal}</Typography>
                </Box>
              </Box>

              <Box width="45%" textAlign="right">
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Typography style={{ fontSize: "17px" }}>
                    <b>Monto pagado:</b>
                  </Typography>
                  <Typography variant="h6">
                    $ {montoPagado.toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Typography style={{ fontSize: "17px" }}>
                    <b>Total:</b>
                  </Typography>
                  <Typography variant="h6">$ {totalVenta}</Typography>
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Typography style={{ fontSize: "17px" }}>
                    <b>Descuento:</b>
                  </Typography>
                  <Typography variant="h6">
                    $ {descuentoVenta.toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Typography style={{ fontSize: "17px" }}>
                    <b>Cambio:</b>
                  </Typography>
                  <Typography variant="h6">
                    $ {cambioVenta.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </div>



            <div style={{ display: visible ? "block" : "none"}}>
              <div className={classes.formInputFlex}>
                <Box width="20%">
                  <Typography variant="caption">
                    <b>Dias de Crédito:</b>
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      name="codigo_barras"
                      id="form-producto-codigo-barras"
                      variant="outlined"
                      value={datosCliente.dias_credito === null ? 0 : datosCliente.dias_credito}
                      onChange={e => setDatosCliente({...datosCliente, dias_credito: e.target.value})}
                      disabled={editableClient}
                    />
                  </Box>
                </Box>
                <Box width="20%">
                  <Typography variant="caption">
                    <b>Límite de Crédito:</b>
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      name="codigo_barras"
                      id="form-producto-codigo-barras"
                      variant="outlined"
                      value={datosCliente.limite_credito === null ? 0 : datosCliente.limite_credito }
                      disabled={editableClient}
                    />
                  </Box>
                </Box>
                <Box width="20%">
                  <Typography variant="caption">
                    <b>Crédito Disponible:</b>
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      name="codigo_barras"
                      id="form-producto-codigo-barras"
                      variant="outlined"
                      value={datosCliente.credito_disponible === null ? 0 : datosCliente.credito_disponible}
                      disabled={editableClient}
                    />
                  </Box>
                </Box>

                <Box>
                  <Box width="100%" mt={2.5}>
                    <Button
                      color="primary"
                      variant="outlined"
                      size="large"
                      startIcon={<Edit />}
                      onClick={() => setEditableClient(!editableClient)}
                    >
                      Editar
                    </Button>
                  </Box>
                </Box>
              </div>
              <div className={classes.formInputFlex}>
                <Box width="20%">
                  <Typography variant="caption">
                    <b>Total a Crédito:</b>
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      name="codigo_barras"
                      id="form-producto-codigo-barras"
                      variant="outlined"
                      disabled={editableClient}
                      value={totalVenta}
                    />
                  </Box>
                </Box>

                <Box width="20%">
                  <Typography variant="caption">
                    <b>Fecha de Vencimiento:</b>
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      name="codigo_barras"
                      id="form-producto-codigo-barras"
                      variant="outlined"
                      type="date"
                      value={fechaVencimientoDate}
                      onChange={(e) => {
                        const modelDate = moment(e.target.value).add(1,"days");
                        const hoy = moment();
                        const diasDiff = modelDate.diff(hoy, 'days');
                        setfechaVencimientoDate(e.target.value);
                        setDatosCliente({...datosCliente, dias_credito: diasDiff});
                      }}
                      disabled={editableClient}
                    />
                  </Box>
                </Box>
              </div>
            </div>

          </Grid>
        </DialogContent>

        <DialogActions style={{justifyContent: "space-between"}} >
          <Box display={"flex"} justifyContent="flex-start" >
              <Box pr={1}>
                {
                  visible ? (
                    <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setVisible(!visible);
                      setEditableClient(!editableClient);
                    }}
                    startIcon={
                      <ClearIcon style={{fontSize: "28px"}} />
                    }
                  >
                    Cancelar
                  </Button>
                  ) : (
                    <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => setVisible(!visible)}
                    startIcon={
                      <CreditCardIcon style={{fontSize: "28px"}} />
                    }
                  >
                    Credito
                  </Button>
                  )
                }

              </Box>

              <Box>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  startIcon={
                    <LocalOfferIcon style={{fontSize: "28px"}}  />
                  }
                >
                  Descuento
                </Button>
              </Box>
            </Box>
          <Button
            onClick={() => {
              handleClickFinishVenta();
            }}
            size="large"
            variant="contained"
            color="primary"
            autoFocus
          >
            Terminar
          </Button>

        </DialogActions>

      </Dialog>

      <Dialog
        open={openModalDescuento}
        onClose={abrirCajon}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Box textAlign="center">
            <Box>
              <FcDonate style={{ fontSize: 80 }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h5">Su cambio</Typography>
            </Box>
          </Box>
          <Grid item lg={12}>
            <Paper elevation={3}>
              <Box p={3} width="100%" textAlign="center">
                <Typography variant="h3" style={{ color: "red" }}>
                  $150.000
                </Typography>
                <Typography variant="caption">
                  (CIENTO CICUENTA PESOS 00/100 MNX)
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            size="large"
            color="primary"
            autoFocus
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={cambio}
        onClose={abrirCajon}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Box textAlign="center">
            <Box>
              <FcDonate style={{ fontSize: 80 }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h5">Su cambio</Typography>
            </Box>
          </Box>
          <Grid item lg={12}>
            <Paper elevation={3}>
              <Box p={3} width="100%" textAlign="center">
                <Typography variant="h3" style={{ color: "red" }}>
                  $150.000
                </Typography>
                <Typography variant="caption">
                  (CIENTO CICUENTA PESOS 00/100 MNX)
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            size="large"
            color="primary"
            autoFocus
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
