import React, { useState, useEffect, Fragment, useRef, useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Input from "@material-ui/core/Input";
import EliminarProductoVenta from "./EliminarProductoVenta";

import { useDebounce } from "use-debounce";
import {
  findProductArray,
  calculatePrices,
  verifiPrising,
} from "../../config/reuserFunctions";
import { VentasContext } from '../../context/Ventas/ventasContext';


const headCells = [
  {
    id: "Cantidad",
    numeric: false,
    disablePadding: true,
    label: "Cantidad",
    width: 25,
  },
  {
    id: "Descripcion",
    numeric: true,
    disablePadding: false,
    label: "Descripcion",
    width: 330,
  },
  {
    id: "Existencias",
    numeric: true,
    disablePadding: false,
    label: "Existencias",
    width: 100,
  },
  {
    id: "% Desc",
    numeric: true,
    disablePadding: false,
    label: "% Desc",
    width: 100,
  },
  {
    id: "U. Venta",
    numeric: true,
    disablePadding: false,
    label: "U. Venta",
    width: 100,
  },
  {
    id: "Precio U",
    numeric: true,
    disablePadding: false,
    label: "Precio U",
    width: 100,
  },
  {
    id: "Eliminar",
    numeric: true,
    disablePadding: false,
    label: "Eliminar",
    width: 100,
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 7
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  container: {
<<<<<<< HEAD
    height: "60vh",
=======
    maxHeight: "60vh",
>>>>>>> c41abf451eee8747498f22488e5c2f575717cf81
    '& ::-webkit-scrollbar': {
      display: 'none'
    }
  },
  table: {
    minWidth: 750,
    minHeight: "50vh",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  }
}));

export default function EnhancedTable({
  setDatosVentasActual,
}) {
  const classes = useStyles();
  const [ selected, setSelected ] = useState([]);

  const { setProductoCambioPrecio, setPrecioSelectProductoVenta, updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);

  const [datosTabla, setDatosTabla] = useState([]);

  useEffect(() => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    setDatosTabla(venta === null ? [] : venta.productos);
  }, [updateTablaVentas]);

  const handleClick = (name) => {
    // console.log("name",name);
    let newSelected = [];
    const exist = selected.indexOf(name) !== -1;
    if(exist){
      newSelected = [];
    }else{
      newSelected = newSelected.concat([], name);
    }
    // console.log("selected",selected);
    // console.log("newSelected",newSelected);
    const producto = name.id_producto.precios.precios_producto.filter((p) => p.precio_neto === name.precio_actual_producto);
    // console.log("producto",producto);
   
    if(producto.length > 0){
      // console.log(producto);
      setPrecioSelectProductoVenta(producto);
    }
    setProductoCambioPrecio(name);
    // console.log(name.id_producto.precios.precios_producto[0]);
    setSelected(newSelected);
  };

  const TwoClickInRowTableBuy = (e, producto) => {
    try {
      let timer;
      clearTimeout(timer);
      if (e.detail === 2) {
        handleClick(producto);
        // console.log(producto);
        setProductoCambioPrecio(producto);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const isSelected = (name) => {
    return selected.indexOf(name) !== -1;
  };

  return (
    <div className={classes.root}>
      <Paper>
        <TableContainer className={classes.container} >
          <Table
            stickyHeader
            className={classes.table}
            size="small"
            aria-labelledby="tableTitle"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 25, textAlign:"center" }}></TableCell>
                <TableCell style={{ width: 25, textAlign:"center" }}>Cantidad</TableCell>
                <TableCell style={{ width: 340 }}>Descripcion</TableCell>
                <TableCell style={{ width: 40, textAlign:"center" }}>Exis.</TableCell>
                <TableCell style={{ width: 50, textAlign:"center" }}><b>% Desct.</b></TableCell>
                <TableCell style={{ width: 40, textAlign:"center" }}>Rx.</TableCell>
                <TableCell style={{ width: 50, textAlign:"center" }}>U. Venta</TableCell>
                <TableCell style={{ width: 100, textAlign:"center" }}>Precio U</TableCell>
                <TableCell align="center" style={{ width: 10 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {datosTabla?.map((producto, index) => {
                const isItemSelected = isSelected(producto);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <RenderTableRows
                    key={index}
                    producto={producto}
                    setUpdateTablaVentas={setUpdateTablaVentas}
                    updateTablaVentas={updateTablaVentas}
                    setDatosVentasActual={setDatosVentasActual}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                    selected={selected}
                    TwoClickInRowTableBuy={TwoClickInRowTableBuy}
                    setSelected={setSelected}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const RenderTableRows = ({
  producto,
  setUpdateTablaVentas,
  updateTablaVentas,
  setDatosVentasActual,
  TwoClickInRowTableBuy,
  handleClick,
  isItemSelected,
  labelId,
  setSelected,
  selected
}) => {
  // const [actuallyProduct, setActuallyProduct] = useState(producto);
  const [newCantidadProduct, setNewCantidadProduct] = useState(
    producto.cantidad_venta
  );
  
  const [ tempAmount, setTempAmount ] = useState(producto.cantidad_venta);

  const textfield = useRef(null);
  const [value] = useDebounce(newCantidadProduct, 500);


  useEffect(() => {
    setTempAmount(producto.cantidad_venta);
  }, [producto.cantidad_venta]);

  useEffect(() => {
    CalculeDataPricing(value);
  }, [value]);

  const calculateNewPricingAmount = (cantidad) => {
    try {
      setTempAmount(cantidad);
      setNewCantidadProduct(cantidad);
      // console.log("cantidad",cantidad);
    } catch (error) {
      return false;
    }
  }

  const CalculeDataPricing = async (new_cant) => {
    if(new_cant === "" || new_cant == 0){
      setTempAmount(producto.cantidad_venta);
    }else{
      // console.log("entro a tabla");
      let venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let productosVentas = venta === null ? [] : venta.productos;
      const venta_actual = venta === null ? [] : venta;
      let productosVentasTemp = productosVentas;
      let venta_existente =
        venta === null
          ? {
              subTotal: 0,
              total: 0,
              impuestos: 0,
              iva: 0,
              ieps: 0,
              descuento: 0,
              monedero: 0
            }
          : venta;
      //Calculos de impuestos que se van a restar de la venta;
      let calculoResta = {};
      //Calculos de impuestos que se van a sumar a la venta
      let calculoSuma = {};

      let CalculosData = {};

      //Buscar y obtener ese producto en el array de ventas
      const producto_encontrado = await findProductArray(
        productosVentas,
        producto
      );
        // console.log(new_cant);
      if (producto_encontrado.found) {
        // console.log("se encontro");
        const { cantidad_venta, ...newP } =
          producto_encontrado.producto_found.producto;
        newP.cantidad_venta = new_cant
        // newP.precio_actual_producto = newP.descuento_activo ? newP.descuento.precio_con_descuento :  newP.precio;
        // newP.precio_actual_producto = newP.descuento_activo ? newP.descuento.precio_con_descuento :  newP.precio;
        // console.log(newP);
        const verify_prising = await verifiPrising(newP);
        // console.log(verify_prising);
        // console.log("llego linea 434");
        if (verify_prising.found) {
          // console.log("llego linea 436");
          // console.log(verify_prising);
          calculoResta = await calculatePrices(
            newP,
            cantidad_venta,
            newP.granel_producto,
            newP.precio_actual_producto,
            "TABLA"
          );
          // console.log(verify_prising.pricing);
          //Sacar los impuestos que se van a sumar
          calculoSuma = await calculatePrices(
            newP,
            new_cant,
            newP.granel_producto,
            verify_prising.pricing,
            "TABLA"
          );

          // console.log(calculoSuma);
          // console.log(calculoResta);
  
          newP.precio_a_vender = calculoSuma.totalCalculo;
          newP.precio_anterior = newP.precio_actual_porducto;
          newP.precio_actual_producto = verify_prising.pricing;
          productosVentasTemp.splice(
            producto_encontrado.producto_found.index,
            1,
            newP
          );
          
  
          CalculosData = {
            subTotal:
              parseFloat(venta_existente.subTotal) -
              parseFloat(calculoResta.subtotalCalculo) +
              calculoSuma.subtotalCalculo,
            total:
              parseFloat(venta_existente.total) -
              parseFloat(calculoResta.totalCalculo) +
              calculoSuma.totalCalculo,
            impuestos:
              parseFloat(venta_existente.impuestos) -
              parseFloat(calculoResta.impuestoCalculo) +
              calculoSuma.impuestoCalculo,
            iva:
              parseFloat(venta_existente.iva) -
              parseFloat(calculoResta.ivaCalculo) +
              calculoSuma.ivaCalculo,
            ieps:
              parseFloat(venta_existente.ieps) -
              parseFloat(calculoResta.iepsCalculo) +
              calculoSuma.iepsCalculo,
            descuento:
              parseFloat(venta_existente.descuento) -
              parseFloat(calculoResta.descuentoCalculo) +
              calculoSuma.descuentoCalculo,
            monedero:
              parseFloat(venta_existente.monedero) -
              parseFloat(calculoResta.monederoCalculo) +
              calculoSuma.monederoCalculo,
          };
        }else{
          //Sacar los impuestos que se van a restar
          // console.log("Entro a cantidad", newP.cantidad_venta);
          calculoResta = await calculatePrices(
            newP,
            cantidad_venta,
            newP.granel_producto,
            newP.precio_actual_producto,
            "TABLA"
          );
          // console.log(calculoResta);
          //Sacar los impuestos que se van a sumar
          calculoSuma = await calculatePrices(
            newP,
            new_cant,
            newP.granel_producto,
            newP.precio_actual_producto,
            "TABLA"
          );
          newP.cantidad_venta = parseInt(new_cant);
          newP.precio_anterior = newP.precio_actual_producto;
          newP.precio_a_vender = calculoSuma.totalCalculo;
          productosVentasTemp.splice(
            producto_encontrado.producto_found.index,
            1,
            newP
          );

          CalculosData = {
            subTotal:
              parseFloat(venta_existente.subTotal) -
              parseFloat(calculoResta.subtotalCalculo) +
              calculoSuma.subtotalCalculo,
            total:
              parseFloat(venta_existente.total) -
              parseFloat(calculoResta.totalCalculo) +
              calculoSuma.totalCalculo,
            impuestos:
              parseFloat(venta_existente.impuestos) -
              parseFloat(calculoResta.impuestoCalculo) +
              calculoSuma.impuestoCalculo,
            iva:
              parseFloat(venta_existente.iva) -
              parseFloat(calculoResta.ivaCalculo) +
              calculoSuma.ivaCalculo,
            ieps:
              parseFloat(venta_existente.ieps) -
              parseFloat(calculoResta.iepsCalculo) +
              calculoSuma.iepsCalculo,
            descuento:
              parseFloat(venta_existente.descuento) -
              parseFloat(calculoResta.descuentoCalculo) +
              calculoSuma.descuentoCalculo,
            monedero: parseFloat(venta_existente.monedero) - parseFloat(calculoResta.monederoCalculo) +
            calculoSuma.monederoCalculo,
          };
        }
        // console.log(calculoSuma);
      } else {
        console.log("El producto no existe");
      }
      //Crear copia y guardar los impuestos a sumar
      // console.log("Datos de tabla",CalculosData);
      localStorage.setItem(
        "DatosVentas",
        JSON.stringify({
          ...CalculosData,
          cliente:
            venta_actual.venta_cliente === true ? venta_actual.cliente : {},
          venta_cliente:
            venta_actual.venta_cliente === true
              ? venta_actual.venta_cliente
              : false,
          productos: productosVentasTemp,
        })
      );
      setDatosVentasActual(CalculosData);
      //Recargar la tabla de los productos
      setUpdateTablaVentas(!updateTablaVentas);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={producto._id}
        selected={isItemSelected}
        hover
        onClick={(e) => TwoClickInRowTableBuy(e,producto)}
      >
        <TableCell padding="checkbox">
          <Checkbox
            onClick={(event) => {
              if(selected.length > 0) setSelected([]);
              handleClick(producto);
            }}
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell>
          <Input
            inputRef={textfield}
            onChange={(e) => calculateNewPricingAmount(e.target.value)}
            value={tempAmount}
            type="number"
            name="cantidad_venta"
          />
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.nombre_comercial}
        </TableCell>
        <TableCell  style={{ textAlign:"center"}} >
          {producto.concepto === "medida"
            ? producto.cantidad
            : producto.inventario_general.map(
                (existencia) => `${existencia.cantidad_existente}`
              )}
        </TableCell>
        <TableCell  style={{ textAlign:"center"}} >
          %{" "}
          {producto.descuento_activo === true
            ? producto.descuento.porciento
            : 0}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          {producto.id_producto.datos_generales.receta_farmacia === true
            ? "Si"
            : "No"}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          {producto.inventario_general.map(
            (existencia) => `${existencia.unidad_inventario}`
          )}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          $ { producto.precio_actual_producto % 1 === 0 ? producto.precio_actual_producto : producto.precio_actual_producto.toFixed(4)}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          <EliminarProductoVenta
            producto={producto}
            setDatosVentasActual={setDatosVentasActual}
          />
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
