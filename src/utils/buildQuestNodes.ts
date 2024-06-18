import { ConnectionLineType, Edge, Node } from 'reactflow';
import dagre from 'dagre';
import _ from 'lodash';

export type Traders = Record<string, FirebaseTrader>;
export type Quests = Record<string, QuestData>;

export interface FirebaseTrader {
    image: string;
    quests: Quests;
}

export interface TraderData {
    name: string;
    quests: Quests;
    image: string;
}

export interface QuestData {
    kappa: boolean;
    link: string;
    name: string;
    objectives: string[];
    rewards: string[];
    prior: string[];
    next: string[];
    trader: string;
    dbId: string;
    traderQuests: Quests;
}

export interface QuestNode extends Node {
    data: QuestData;
}

export interface TraderNode extends Node {
    data: TraderData;
}

export interface QuestEdge {
    id: string;
    source: string;
    target: string;
    type?: string;
    animated: boolean;
}

export interface TraderGraphData {
    name: string;
    nodes: QuestNode[];
    edges: QuestEdge[];
}

const transformFirebaseTraderData = (
    firebasesTraderData: Traders
): TraderData[] => {
    const data = Object.entries(firebasesTraderData).map(
        ([trader, data]): TraderData => {
            return {
                name: trader,
                quests: data.quests,
                image: data.image,
            };
        }
    );
    return data;
};

const generateTraderNodes = (trader: TraderData): Node[] => {
    const rootNode: TraderNode = {
        id: 'root',
        type: 'traderNode',
        // Needs QuestNode data
        data: trader,
        position: { x: 0, y: 0 },
    };
    const questNodes = Object.entries(trader.quests).map(
        ([quest, data]): QuestNode => {
            return {
                id: quest,
                type: 'questNode',
                data: {
                    ...data,
                    next: data.next ?? [],
                    prior: data.prior ?? [],
                    trader: trader.name,
                    dbId: quest,
                    traderQuests: trader.quests,
                },
                position: { x: 0, y: 0 },
            };
        }
    );
    return [rootNode, ...questNodes];
};

const generateTraderEdges = (quests: Quests): QuestEdge[] => {
    const edgeType = ConnectionLineType.Bezier;
    const [childrenQeusts, parentQuests] = _.partition(
        Object.entries(quests),
        ([_quest, data]) => {
            if (!data.prior) return false;
            const priorQuests = data.prior.filter((priorQuest) => {
                return !!quests[priorQuest];
            });
            return priorQuests.length;
        }
    );

    childrenQeusts.sort(([_questA, dataA], [_questB, dataB]) => {
        return dataA.prior.length - dataB.prior.length;
    });

    const questEdges = childrenQeusts.map(([quest, data]): QuestEdge[] => {
        const priorEdges: QuestEdge[] = data.prior.map((priorQuest) => {
            return {
                id: `${priorQuest}-${quest}`,
                source: priorQuest,
                target: quest,
                animated: false,
                type: edgeType,
            };
        });
        return priorEdges;
    });

    const rootEdges: QuestEdge[] = parentQuests.map(
        ([quest]): QuestEdge => {
            return {
                id: `root-${quest}`,
                source: 'root',
                target: quest,
                animated: false,
                type: edgeType,
            };
        }
    );

    return [...rootEdges, ...questEdges.flat()];
};

const generateTraderGraphData = (firebaseTraderData: Traders) => {
    const allTraderData = transformFirebaseTraderData(firebaseTraderData);
    const allTraderQuestNodes: TraderGraphData[] = allTraderData.map(
        (trader): TraderGraphData => {
            const questNodes = generateTraderNodes(trader);
            const questEdges = generateTraderEdges(trader.quests);

            return {
                name: trader.name,
                nodes: questNodes,
                edges: questEdges,
            };
        }
    );

    // The database is sorted in alphabetical order, this just reverses that order as it makes more sense for the trader bar
    return allTraderQuestNodes.reverse();
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

export const getLayoutedElements = ({
    nodes,
    edges,
}: {
    nodes: Node<unknown>[];
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

    const centerOfScreen = window.innerWidth / 2;
    const rootFromCenter = nodes[0].position.x - centerOfScreen;

    nodes.forEach((node: Node) => {
        node.position = {
            x: node.position.x - rootFromCenter - NODE_WIDTH / 2,
            y: node.position.y + 100,
        };

        return node;
    });

    return { nodes, edges };
};

export default generateTraderGraphData;
