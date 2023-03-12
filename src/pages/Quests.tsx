import { useEffect, useState, useRef, useCallback } from "react";
import ReactFlow, {
    ReactFlowProvider,
    ConnectionLineType,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from "reactflow";
import { TraderGraphData, getLayoutedElements } from "../utils/buildQuestNodes";
import QuestNode from "../components/Nodes/QuestNode";
import TraderNode from "../components/Nodes/TraderNode";
import GenericNavbar from "../components/GenericNavbar/GenericNavbar";

import "reactflow/dist/style.css";
import "./styles/quests.scss";
import { database } from "../utils/firebase";
import { goOffline, goOnline } from "firebase/database";
import { Params, useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

export interface IQuestProps {
    traderGraphData: TraderGraphData[];
}

const nodeTypes = { questNode: QuestNode, traderNode: TraderNode };

const getCurrentTrader = (urlParams: Readonly<Params<string>>, traderGraphData: IQuestProps["traderGraphData"]) => {
    const index = _.findIndex(traderGraphData, ({ name }) => _.camelCase(name) === _.camelCase(urlParams["trader"]));
    if (index === -1) return 0;
    return index;
}

const Quests = ({ traderGraphData }: IQuestProps) => {
    const urlParams = useParams();
    const navigate = useNavigate();
    const autoTimeout = useRef<NodeJS.Timeout>();
    const isTimedOut = useRef(false);
    const { setViewport } = useReactFlow();
    const currentTrader = getCurrentTrader(urlParams, traderGraphData);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        traderGraphData[currentTrader]
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    const resetDatabaseConnection = useCallback(() => {
        if (isTimedOut.current) {
            goOnline(database);
            isTimedOut.current = false;
        }
        timeoutFunction();
    }, []);

    useEffect(() => {
        timeoutFunction();
    }, []);

    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(traderGraphData[currentTrader]);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);

        setViewport({ x: 0, y: 0, zoom: 1 });

        resetDatabaseConnection();
    }, [
        currentTrader,
        traderGraphData,
        resetDatabaseConnection,
        setEdges,
        setNodes,
        setViewport,
    ]);

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

    const setCurrentNav = useCallback((val: number) => {
        navigate(`/quests/${traderGraphData[val].name}`)
    }, [traderGraphData])

    return (
        <>
            <GenericNavbar
                navData={traderGraphData.map((trader) => trader.name)}
                currentNav={currentTrader}
                setCurrentNav={setCurrentNav}
            />
            <div className="layoutflow">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={resetDatabaseConnection}
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

const QuestWithProvider = ({ traderGraphData }: IQuestProps) => (
    <ReactFlowProvider>
        <Quests traderGraphData={traderGraphData} />
    </ReactFlowProvider>
);

export default QuestWithProvider;
