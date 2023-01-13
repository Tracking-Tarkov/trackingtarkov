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
            {data.name}
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default TraderNode;
