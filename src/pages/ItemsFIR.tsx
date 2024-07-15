import React, { useState } from 'react';
import { Item } from '../App';
import ItemCard from '../components/ItemCard/ItemCard';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Switch,
    TextField,
} from '@mui/material';

import './styles/itemsFIR.scss';

enum Filters {
    Kappa = 'Kappa',
    Craftable = 'Craftable',
    NotCraftable = 'Not Craftable',
}

export interface ItemsFIRProps {
    items: Item[];
}

const ItemsFIR = ({ items }: ItemsFIRProps) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [isHideCompleted, setIsHideCompleted] = useState<boolean>(false);

    const handleFiltersChange = (event: SelectChangeEvent<typeof selectedFilters>) => {
        const {
            target: { value },
        } = event;
        setSelectedFilters(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleIsCompletedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsHideCompleted(event.target.checked);
    };

    const filterItems = (item: Item) => {
        const itemFilterData: string[] = [
            `${item.kappa && Filters.Kappa}`,
            `${item.craft && Filters.Craftable}`,
            `${!item.craft && Filters.NotCraftable}`
        ];

        return (
            item.name.toLowerCase().includes(nameFilter.toLowerCase())
            && selectedFilters.every((filter) => itemFilterData.includes(filter))
        );
    };

    return (
        <div className="items-fir-container">
            <div className="items-fir-header">
                <TextField
                    id="outlined-basic"
                    label="Search by item name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setNameFilter(event.target.value)
                    }
                />
                <FormControl sx={{ width: 300 }}>
                    <InputLabel>Filters</InputLabel>
                    <Select
                        multiple
                        value={selectedFilters}
                        onChange={handleFiltersChange}
                        input={<OutlinedInput label="Filters" />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {Object.values(Filters).map((filter) => (
                            <MenuItem key={filter} value={filter}>
                                <Checkbox checked={selectedFilters.indexOf(filter) > -1} />
                                <ListItemText primary={filter} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    sx={{width: 250}}
                    control={<Switch checked={isHideCompleted} onChange={handleIsCompletedChange}/>} 
                    label="Hide Completed" 
                />
            </div>
            <div className="items-fir-cards">
                {items
                    .filter(filterItems)
                    .map((item) => (
                        <ItemCard key={item.name} data={item} isHideCompleted={isHideCompleted} />
                    ))}
            </div>
        </div>
    );
};

export default ItemsFIR;
