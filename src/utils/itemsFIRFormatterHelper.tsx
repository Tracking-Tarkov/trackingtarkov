import {
    ColDef,
    ICellRendererParams,
    ITextFilterParams,
    RowHeightParams,
} from "ag-grid-community";
import { Item } from "../App";

import "../pages/styles/itemsFIR.scss";

export const defaultColDef: ColDef = {
    width: 100,
    flex: 1,
};

export const getRowHeight = ({ data }: RowHeightParams<Item>) => {
    const iconHeight = data?.icon.height ?? 0;
    return Math.max(iconHeight, 80);
};

const itemNameFormatter = ({ data }: ICellRendererParams<Item>) => {
    const content = (
        <a href={data?.url} target="_blank" rel="noreferrer">
            <div className="item-name">{data?.name}</div>
        </a>
    );
    return content;
};

const itemKappaFormatter = ({ data }: ICellRendererParams<Item>) => {
    const isKappa = data?.kappa ? "Yes" : "No";
    const content = <div className="item-kappa">{isKappa}</div>;
    return content;
};

const itemIconFormatter = ({ data }: ICellRendererParams<Item>) => {
    const content = (
        <div className="item-image">
            <img src={data?.icon.url} alt={data?.name}></img>
        </div>
    );
    return content;
};

export const itemNameColumn: ColDef = {
    field: "name",
    sortable: true,
    filter: "agTextColumnFilter",
    filterParams: {
        buttons: ["clear", "apply"],
    } as ITextFilterParams,
    cellRenderer: itemNameFormatter,
};

export const itemAmountColumn: ColDef = {
    field: "amount",
    sortable: true,
    filter: "agNumberColumnFilter",
};

export const itemKappaColumn: ColDef = {
    field: "kappa",
    sortable: true,
    cellRenderer: itemKappaFormatter,
};

export const itemIconColumn: ColDef = {
    field: "iconUrl",
    headerName: "Icon",
    cellRenderer: itemIconFormatter,
};
