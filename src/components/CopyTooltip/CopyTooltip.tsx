import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';

const CopyTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltipArrow}`]: {
        backgroundColor: theme.palette.success.dark,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.success.dark,
    },
}));

export default CopyTooltip;
