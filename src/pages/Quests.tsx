import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    ConnectionLineType,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
    Position,
} from "reactflow";
import dagre from "dagre";
import { TraderGraphData } from "../utils/buildQuestNodes";
import QuestNode from "../components/Nodes/QuestNode";
import TraderNode from "../components/Nodes/TraderNode";

import "reactflow/dist/style.css";
import "./styles/quests.scss";

export interface IQuestProps {
    traderGraphData: TraderGraphData[];
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

const nodeTypes = { questNode: QuestNode, traderNode: TraderNode };

const getLayoutedElements = (
    { nodes, edges }: { nodes: Node<any>[]; edges: Edge[] },
    direction: string
) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
        dagreGraph.setNode(node.id, {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        });
    });

    edges.forEach((edge: Edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: Node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        node.position = {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };

        return node;
    });

    return { nodes, edges };
};

const Quests = ({ traderGraphData }: IQuestProps) => {
    const [currentTrader, setCurrentTrader] = useState<number>(0);
    const [graphDirection, setGraphDirection] = useState<string>("TB");

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        traderGraphData[currentTrader],
        graphDirection
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(traderGraphData[currentTrader], graphDirection);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [currentTrader, graphDirection]);

    return (
        <div className="layoutflow">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionLineType={ConnectionLineType.SmoothStep}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                nodesConnectable={false}
                fitView
            />
            <div className="controls">
                <button onClick={() => setGraphDirection("TB")}>
                    vertical layout
                </button>
                <button onClick={() => setGraphDirection("LR")}>
                    horizontal layout
                </button>
                <button
                    onClick={() =>
                        setCurrentTrader(
                            currentTrader < 7
                                ? currentTrader + 1
                                : currentTrader
                        )
                    }
                >
                    Increment Trdaer
                </button>
                <button
                    onClick={() =>
                        setCurrentTrader(
                            currentTrader > 0
                                ? currentTrader - 1
                                : currentTrader
                        )
                    }
                >
                    Decrement Trdaer
                </button>
            </div>
        </div>
    );
};

export default Quests;
