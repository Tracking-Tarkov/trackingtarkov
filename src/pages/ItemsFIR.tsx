import { Item } from "../App";
import GenericTable from "../components/GenericTable/GenericTable";
import {
    itemAmountColumn,
    itemIconColumn,
    itemKappaColumn,
    itemNameColumn,
} from "../utils/itemsFIRFormatterHelper";

import "./styles/attributions.scss";

export interface ItemsFIRProps {
    itemData: Item[];
}

const columns = [
    itemIconColumn,
    itemNameColumn,
    itemAmountColumn,
    itemKappaColumn,
];

const ItemsFIR = ({ itemData }: ItemsFIRProps) => {
    return (
        <div className="credits">
            <GenericTable rowData={itemData} columnDefs={columns} />
        </div>
    );
};

export default ItemsFIR;
