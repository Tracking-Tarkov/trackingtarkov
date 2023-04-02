import LinkIcon from '@mui/icons-material/Link';
import { Box, Link, Typography } from '@mui/material';

import './styles/goonInfo.scss';

interface IGoonData {
    name: string;
    img: string;
    url: string;

}

const goonsData: IGoonData[] = [
    {
        name: 'Knight',
        img: 'https://uploads-ssl.webflow.com/62ffc936658cff9b8da61a79/633d18e8fd3a708710c337c8_knight.png',
        url: 'https://escapefromtarkov.fandom.com/wiki/Knight'
    },
    {
        name: 'Big Pipe',
        img: 'https://uploads-ssl.webflow.com/62ffc936658cff9b8da61a79/633d18e806bcd56324ef5b6d_bigpipe.png',
        url: 'https://escapefromtarkov.fandom.com/wiki/Big_Pipe'
    },
    {
        name: 'Birdeye',
        img: 'https://uploads-ssl.webflow.com/62ffc936658cff9b8da61a79/633d18e8275596a62752a5e1_birdeye.png',
        url: 'https://escapefromtarkov.fandom.com/wiki/Birdeye'
    }
];

const GoonInfo = () => {
    return (
        <div className="goon-info-container">
            {goonsData.map(({ img, name, url }) => (
                <Box key={name} display="flex" flexDirection="column" alignItems="center">
                    <img style={{ width: '75%', minWidth: '150px' }} src={img} alt={`Of ${name}`} />
                    <Box display="flex" alignItems="center">
                        <Typography variant="h5">{name}</Typography>
                        <Link href={url} target="_blank" referrerPolicy="no-referrer" sx={{ marginLeft: '5px', textAlign: 'center' }}>
                            <Box display="flex" alignItems="center">
                                <LinkIcon />
                            </Box>
                        </Link>
                    </Box>
                </Box>
            ))}
        </div>
    );
};

export default GoonInfo;
