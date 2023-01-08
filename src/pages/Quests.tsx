import { useEffect, useState, useRef, useCallback } from "react";
import ReactFlow, {
    ConnectionLineType,
    useNodesState,
    useEdgesState,
} from "reactflow";
import { TraderGraphData, getLayoutedElements } from "../utils/buildQuestNodes";
import QuestNode from "../components/Nodes/QuestNode";
import TraderNode from "../components/Nodes/TraderNode";
import GenericNavbar from "../components/GenericNavbar/GenericNavbar";

import "reactflow/dist/style.css";
import "./styles/quests.scss";
import { database } from "../utils/firebase";
import { goOffline, goOnline } from "firebase/database";

export interface IQuestProps {
    traderGraphData: TraderGraphData[];
}

const nodeTypes = { questNode: QuestNode, traderNode: TraderNode };

const Quests = ({ traderGraphData }: IQuestProps) => {
    const [currentTrader, setCurrentTrader] = useState<number>(0);
    const autoTimeout = useRef<NodeJS.Timeout>();
    const isTimedOut = useRef(false);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        traderGraphData[currentTrader]
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        timeoutFunction();
    }, []);

    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(traderGraphData[currentTrader]);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
        // eslint-disable-next-line
    }, [currentTrader]);

    const onNodeClick = useCallback(() => {
        if (isTimedOut.current) {
            goOnline(database);
            isTimedOut.current = false;
        }
        timeoutFunction();
    }, [database]);

    const hourInMilli = 3600000;
    const timeoutFunction = () => {
        if (autoTimeout.current) {
            clearTimeout(autoTimeout.current);
        }
        autoTimeout.current = setTimeout(() => {
            goOffline(database);
            isTimedOut.current = true;
        }, hourInMilli);
    };

    return (
        <>
            <GenericNavbar
                navData={traderGraphData.map((trader) => trader.name)}
                currentNav={currentTrader}
                setCurrentNav={setCurrentTrader}
            />
            <div className="layoutflow">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={onNodeClick}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
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
