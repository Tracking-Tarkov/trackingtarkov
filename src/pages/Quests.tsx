import { useEffect, useState, MouseEvent } from "react";
import ReactFlow, {
    ConnectionLineType,
    useNodesState,
    useEdgesState,
    Node,
} from "reactflow";
import { TraderGraphData, getLayoutedElements } from "../utils/buildQuestNodes";
import QuestNode from "../components/Nodes/QuestNode";
import TraderNode from "../components/Nodes/TraderNode";
import TraderBar from "../components/TraderBar/TraderBar";

import "reactflow/dist/style.css";
import "./styles/quests.scss";

export interface IQuestProps {
    traderGraphData: TraderGraphData[];
}

const nodeTypes = { questNode: QuestNode, traderNode: TraderNode };

// const onNodeClick = (event: MouseEvent, node: Node) =>
//     console.log("click node", node, event);

const Quests = ({ traderGraphData }: IQuestProps) => {
    const [currentTrader, setCurrentTrader] = useState<number>(0);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        traderGraphData[currentTrader]
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(traderGraphData[currentTrader]);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
        // eslint-disable-next-line
    }, [currentTrader]);

    return (
        <>
            <TraderBar
                traders={traderGraphData}
                currentTrader={currentTrader}
                setCurrentTrader={setCurrentTrader}
            />
            <div className="layoutflow">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    // onNodeClick={onNodeClick}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    minZoom={0.3}
                    maxZoom={3}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    proOptions={{ hideAttribution: true }}
                    zoomOnDoubleClick={false}
                />
            </div>
        </>
    );
};

export default Quests;
