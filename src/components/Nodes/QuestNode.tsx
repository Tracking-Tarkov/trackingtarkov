import { useState, useEffect } from "react";
import { Handle, Node, NodeProps, Position } from "reactflow";
import { QuestData } from "../../utils/buildQuestNodes";

import "./styles/questnode.scss";

export interface IQuestNode extends NodeProps {
    data: QuestData;
}

const QuestNode = ({ data }: IQuestNode) => {
    return (
        <div className={`quest-node ${data.trader.toLowerCase()}-node`}>
            <Handle type="target" position={Position.Top} />
            <div>{data.name}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default QuestNode;
