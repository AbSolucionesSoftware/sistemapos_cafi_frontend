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
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
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
  },
}));

export default function EnhancedTable({
  newProductoVentas,
  setNewProductoVentas,
  setDatosVentasActual,
}) {
  const classes = useStyles();
  const [ selected, setSelected ] = useState([]);

  const { setProductoCambioPrecio } = useContext(VentasContext);

  const [datosTabla, setDatosTabla] = useState([]);

  useEffect(() => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    setDatosTabla(venta === null ? [] : venta.productos);
  }, [newProductoVentas]);

  const handleClick = (name) => {
    let newSelected = [];
    const exist = selected.indexOf(name) !== -1;
    if(exist){
      newSelected = [];
    }else{
      newSelected = newSelected.concat([], name);
    }
    console.log(name);
    setProductoCambioPrecio(name);
    setSelected(newSelected);
  };

  const TwoClickInRowTableBuy = (e, producto) => {
    try {
      let timer;
      clearTimeout(timer);
      if (e.detail === 2) {
        handleClick(producto);
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
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 25 }}></TableCell>
                <TableCell style={{ width: 25 }}>Cantidad</TableCell>
                <TableCell style={{ width: 330 }}>Descripcion</TableCell>
                <TableCell style={{ width: 100 }}>Existencias</TableCell>
                <TableCell style={{ width: 100 }}>% Desc</TableCell>
                <TableCell style={{ width: 100 }}>Receta</TableCell>
                <TableCell style={{ width: 100 }}>U. Venta</TableCell>
                <TableCell style={{ width: 100 }}>Precio U</TableCell>
                <TableCell key={1} align="center" style={{ width: 35 }}>
                  Eliminar
                </TableCell>
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
                    setNewProductoVentas={setNewProductoVentas}
                    newProductoVentas={newProductoVentas}
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
  setNewProductoVentas,
  newProductoVentas,
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
  const textfield = useRef(null);
  const [value] = useDebounce(newCantidadProduct, 500);


  useEffect(() => {
    setNewCantidadProduct(producto.cantidad_venta);
  }, [producto.cantidad_venta]);

  useEffect(() => {
    CalculeDataPricing(value);
  }, [value]);

  const CalculeDataPricing = async (new_cant) => {
    if (new_cant === "") {
      setNewCantidadProduct(producto.cantidad_venta);
    } else {
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
            }
          : venta;
      //Calculos de impuestos que se van a restar de la venta;
      let calculoResta = {};
      //Calculos de impuestos que se van a sumar a la venta
      let calculoSuma = {};
      //Buscar y obtener ese producto en el array de ventas
      const producto_encontrado = await findProductArray(
        productosVentas,
        producto
      );

      if (producto_encontrado.found) {
        const { cantidad_venta, ...newP } =
          producto_encontrado.producto_found.producto;
        //Sacar los impuestos que se van a restar
        calculoResta = await calculatePrices(
          newP,
          cantidad_venta,
          newP.granelProducto
        );
        // console.log(calculoResta);
        //Sacar los impuestos que se van a sumar
        calculoSuma = await calculatePrices(
          newP,
          new_cant,
          newP.granelProducto
        );
        newP.cantidad_venta = parseInt(new_cant);
        newP.precio_a_vender = calculoSuma.totalCalculo;
        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );
        // console.log(calculoSuma);
      } else {
        console.log("El producto no existe");
      }
      //Crear copia y guardar los impuestos a sumar
      const CalculosData = {
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
      };
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
      setNewProductoVentas(!newProductoVentas);
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
            onChange={(e) => setNewCantidadProduct(e.target.value)}
            value={newCantidadProduct}
            type="number"
            name="cantidad_venta"
          />
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.nombre_comercial}
        </TableCell>
        <TableCell>
          {producto.concepto === "medida"
            ? producto.cantidad
            : producto.inventario_general.map(
                (existencia) => `${existencia.cantidad_existente}`
              )}
        </TableCell>
        <TableCell>
          %{" "}
          {producto.descuento_activo === true
            ? producto.descuento.porciento
            : 0}
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.receta_farmacia === true
            ? "Si"
            : "No"}
        </TableCell>
        <TableCell>
          {producto.inventario_general.map(
            (existencia) => `${existencia.unidad_inventario}`
          )}
        </TableCell>
        <TableCell>
          $ {producto.precio_a_vender.toFixed(2)}
          {/* {producto.descuento_activo === true
            ? producto.descuento.precio_con_descuento
            : producto.precio} */}
        </TableCell>
        <TableCell>
          <EliminarProductoVenta
            producto={producto}
            setNewProductoVentas={setNewProductoVentas}
            newProductoVentas={newProductoVentas}
            setDatosVentasActual={setDatosVentasActual}
          />
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
