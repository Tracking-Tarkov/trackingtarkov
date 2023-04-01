import { Box, Divider, Typography } from "@mui/material";
import GoonInfo from "../components/GoonInfo/GoonInfo";
import GoonReporter from "../components/GoonReporter/GoonReporter";

const Goons = () => {
    // Connect to database and get goons information.
    return (
        <Box display="flex" height="100vh" flexDirection="column" alignItems="center" marginTop="20px">
            <Typography variant="h3">Goon Squad</Typography>
            <Divider sx={{ width: "75%", height: "5px", marginBottom: "10px" }} />
            <Typography variant="h6">Current Location: COMING SOON</Typography>
            <Typography variant="h6">Last reported time: COMING SOON</Typography>
            <Typography variant="h6">Previous Location: COMING SOON</Typography>
            <Divider sx={{ width: "75%", height: "5px", marginBottom: "10px" }} />
            <Typography variant="h5" marginBottom="3px" >Where did you see the goons?</Typography>
            <GoonReporter />
            <Divider sx={{ width: "75%", height: "5px", marginBottom: "10px" }} />
            <Typography variant="h5" marginBottom="3px" >Who are the goons?</Typography>
            <GoonInfo />
        </Box>
    );
}

export default Goons;
