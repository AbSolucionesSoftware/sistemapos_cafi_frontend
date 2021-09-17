import React, { Fragment } from 'react';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import ReactExport from 'react-export-excel'; //LIBRERIA EXCEL
import { withRouter } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
const ExcelFile = ReactExport.ExcelFile; //ARCHIVO DE EXCEL
const ExcelSheet = ReactExport.ExcelSheet; //HOJA DE EXCEL
const ExcelColumn = ReactExport.ExcelColumn; //COLUMNA DE EXCEL

//Este componente requiere el ArrayData, ArrayColumn, fileName
function ExportarExcel(props) {
	return (
		<Fragment>
            <Grid>
                <Grid item>
                <ExcelFile
					element={
						<Button size="large" color="primary" variant="contained" startIcon={<DescriptionOutlinedIcon />}>
							Exportar Excel
						</Button>
					}
					filename={props.fileName}
				>
					<ExcelSheet data={props.data} name={props.fileName}>
                        {props.columnName.map((element) => {
                            return(
                                <ExcelColumn label={element.label} value={element.id} />
                            )
                        }
                        )}
					
					</ExcelSheet>
				</ExcelFile>
                </Grid>
            </Grid>
		</Fragment>
	);
}

export default withRouter(ExportarExcel);