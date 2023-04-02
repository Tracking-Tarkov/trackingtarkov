import React, { useState } from "react";
import { Item } from "../App";
import ItemCard from "../components/ItemCard/ItemCard";

import "./styles/itemsFIR.scss";
import { TextField } from "@mui/material";

export interface ItemsFIRProps {
    items: Item[];
}

const ItemsFIR = ({ items }: ItemsFIRProps) => {
    const [nameFilter, setNameFilter] = useState<string>("");

    return (
        <div className="items-fir-container">
            <div className="items-fir-header">
                <TextField
                    id="outlined-basic"
                    label="Search by item name"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setNameFilter(event.target.value)
                    }
                />
            </div>
            <div className="items-fir-cards">
                {items
                    .filter((item) =>
                        item.name
                            .toLowerCase()
                            .includes(nameFilter.toLowerCase())
                    )
                    .map((item) => (
                        <ItemCard key={item.name} data={item} />
                    ))}
            </div>
        </div>
    );
};

export default ItemsFIR;
