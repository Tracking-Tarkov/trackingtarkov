import { AgGridReact } from "ag-grid-react";
import {
    defaultColDef,
    getRowHeight,
} from "../../utils/itemsFIRFormatterHelper";

import "./styles/generictable.scss";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export interface IGenericTableProps {
    rowData: Array<any>;
    columnDefs: Array<any>;
}

const GenericTable = ({ rowData, columnDefs }: IGenericTableProps) => {
    return (
        <div className="ag-theme-alpine-dark">
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                getRowHeight={getRowHeight}
            />
        </div>
    );
};

export default GenericTable;
