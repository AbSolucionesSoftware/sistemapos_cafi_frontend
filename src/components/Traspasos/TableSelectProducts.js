import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid,Box, TextField } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel} from '@material-ui/core';
import {Toolbar, Typography, Paper, IconButton, Tooltip} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

// function createData(name, cantidad, precio) {
//   return { name, cantidad, precio };
// }

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Nombre' },
  { id: 'cantidad', numeric: true, disablePadding: false, label: 'Cantidad' },
  { id: 'precio', numeric: true, disablePadding: false, label: 'Precio' },
  
];

function EnhancedTableHead(props) {
  const { classes,  order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
     
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  // productSelected: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [cantidadTo, setCantidadTo] = React.useState('');
   const [arrayTo, setArrayTo] = React.useState(null);
  const { productSelected } = props;

const setValueToTrans =() =>{
  try {
    
    let prodSet =  [] ;
    if(arrayTo !== null){
      prodSet = arrayTo;
    }
    prodSet.push({name: productSelected, cantidad:' ', precio:' '})
    
    setArrayTo(prodSet)
  } catch (error) {

  }
}
React.useEffect(() => {
  try {
   
    if(arrayTo!== null){
     props.setProductosTras(arrayTo);
     }
  } catch (error) {

  }
}, [arrayTo])

function onlyNumbers(value){
    const onlyNums = value.toString().replace(/[^0-9]/g, '');
    const intValue = parseInt(onlyNums);
    setCantidadTo(intValue);
}
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: productSelected.length > 0,
      })}
    >
      {productSelected.length > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {productSelected} 
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {props.title}
        </Typography>
      )}

      {productSelected.length > 0 ? (
        <Grid>  
            
            {(props.add) ?
                    <Box width="280px">
                        <Typography color="primary">Cantidad</Typography>
                        <TextField
                            className={classes.input}
                            size="small"
                            name="cantidad"
                            variant="outlined"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            value={cantidadTo}
                            onChange={(value) => onlyNumbers(value.target.value)}
                            
                        />
                    
                        <Tooltip title="Agregar">
                            <IconButton aria-label="add" onClick={() => setValueToTrans()} >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    :
                    <Box width="100%">
                        <Tooltip title="Eliminar">
                            <IconButton aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
                
          
        </Grid>
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

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

const useStyles = makeStyles((theme) => ({
  root: {
    width: '47%',
    marginLeft:theme.spacing(2),
    marginRight:theme.spacing(2),
   
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 400,
   
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    // let newSelected = [];
    if(selectedIndex === 0){
        setSelected([]);
    }else{
        setSelected(name);
    }
    
  };
    
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.data.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar productSelected={selected} title={props.title} add={props.add} productosTras ={props.productosTras} setProductosTras={props.setProductosTras} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              productSelected={selected}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.data.length}
            />
            <TableBody>
              {stableSort(props.data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                    
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.cantidad}</TableCell>
                      <TableCell align="right">{row.precio}</TableCell>
                     
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
    </div>
  );
}