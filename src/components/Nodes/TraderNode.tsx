import { Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "reactflow";
import { TraderData } from "../../utils/buildQuestNodes";

import "./styles/tradernode.scss";

export interface ITraderNode extends NodeProps {
    data: TraderData;
}

const TraderNode = ({ data }: ITraderNode) => {
    return (
        <div className="trader-node">
            <img src={data.image} alt="Prapor" />
            <Typography sx={{ fontSize: "12px" }}>{data.name}</Typography>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default TraderNode;
