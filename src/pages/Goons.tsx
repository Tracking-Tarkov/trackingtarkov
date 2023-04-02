import { Box, Divider, Typography } from '@mui/material';
import GoonInfo from '../components/GoonInfo/GoonInfo';
import GoonReporter from '../components/GoonReporter/GoonReporter';
import GoonData from '../components/GoonData/GoonData';

const Goons = () => {


    return (
        <Box display="flex" flexDirection="column" alignItems="center" marginTop="20px">
            <Typography variant="h3">Goon Squad</Typography>
            <Divider sx={{ width: '75%', height: '5px', marginBottom: '10px', padding: '10px' }} />
            <GoonData />
            <Divider sx={{ width: '75%', height: '5px', marginBottom: '10px', padding: '10px' }} />
            <Typography variant="h5" marginBottom="3px" >Where did you see the goons?</Typography>
            <GoonReporter />
            <Divider sx={{ width: '75%', height: '5px', marginBottom: '10px', padding: '10px' }} />
            <Typography variant="h5" marginBottom="3px" >Who are the goons?</Typography>
            <GoonInfo />
        </Box>
    );
};

export default Goons;
