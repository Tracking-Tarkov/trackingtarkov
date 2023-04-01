import { FormControlLabel, Radio, RadioGroup } from "@mui/material";


const GoonReporter = () => {
    // On change, update reports database with the reported location and time.
    return (
        <RadioGroup
            name="goons-radio-group"
            row
        >
            <FormControlLabel value="customs" control={<Radio />} label="Customs" labelPlacement="top" />
            <FormControlLabel value="shoreline" control={<Radio />} label="Shoreline" labelPlacement="top" />
            <FormControlLabel value="woods" control={<Radio />} label="Woods" labelPlacement="top" />
            <FormControlLabel value="lighthouse" control={<Radio />} label="Lighthouse" labelPlacement="top" />
        </RadioGroup>
    )
}

export default GoonReporter;
