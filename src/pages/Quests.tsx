import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    ConnectionLineType,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
    FitView,
} from "reactflow";
import dagre from "dagre";
import { TraderGraphData } from "../utils/buildQuestNodes";
import QuestNode from "../components/Nodes/QuestNode";
import TraderNode from "../components/Nodes/TraderNode";
import TraderBar from "../components/TraderBar/TraderBar";
import Box from "@mui/material/Box";

import "reactflow/dist/style.css";
import "./styles/quests.scss";

export interface IQuestProps {
    traderGraphData: TraderGraphData[];
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

const nodeTypes = { questNode: QuestNode, traderNode: TraderNode };

const getLayoutedElements = ({
    nodes,
    edges,
}: {
    nodes: Node<any>[];
    edges: Edge[];
}) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({});

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
        node.position = {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };

        return node;
    });

    const rootFromCenter = nodes[0].position.x - window.innerWidth / 2;

    nodes.forEach((node: Node) => {
        node.position = {
            x: node.position.x - rootFromCenter - NODE_WIDTH / 2,
            y: node.position.y + 100,
        };

        return node;
    });

    return { nodes, edges };
};

const onNodeClick = (event: any, node: Node) => console.log("click node", node);

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
    }, [currentTrader]);

    return (
        <div>
            <TraderBar
                traders={traderGraphData}
                currentTrader={currentTrader}
                setCurrentTrader={setCurrentTrader}
            />
            <div
                className="layoutflow"
                style={{ width: window.innerWidth, height: window.innerHeight }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    minZoom={0}
                    maxZoom={1}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                />
            </div>
        </div>
    );
};

export default Quests;
