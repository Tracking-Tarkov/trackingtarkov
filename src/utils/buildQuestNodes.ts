import ReactFlow, { ConnectionLineType } from "reactflow";
import _ from "lodash";

export interface FirebaseTraderData {
    [name: string]: TraderData;
}

export interface FirebaseQuestsData {
    [name: string]: QuestData;
}

export interface TraderData {
    name: string;
    quests: FirebaseQuestsData;
    image: string;
}

export interface QuestData {
    kappa: boolean;
    link: string;
    name: string;
    objective: string[];
    rewards: string[];
    prior: string[];
    next: string[];
    type: string;
}

export interface QuestNodeData {
    data: string;
}

export interface QuestNode {
    id: string;
    type?: string;
    data: any;
    position: { x: number; y: number };
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
    firebasesTraderData: FirebaseTraderData
): TraderData[] => {
    const data = Object.entries(firebasesTraderData).map(([trader, data]) => {
        return {
            name: trader,
            quests: data.quests,
            image: data.image,
        };
    });
    return data;
};

const generateTraderNodes = (trader: TraderData): QuestNode[] => {
    const rootNode: QuestNode = {
        id: "root",
        type: "input",
        // Needs QuestNode data
        data: { label: trader.name },
        position: { x: 0, y: 0 },
    };
    const questNodes = Object.entries(trader.quests).map(
        ([quest, data]): QuestNode => {
            return {
                id: quest,
                data: { label: data.name },
                position: { x: 0, y: 0 },
            };
        }
    );
    return [rootNode, ...questNodes];
};

const generateTraderEdges = (quests: FirebaseQuestsData): QuestEdge[] => {
    const edgeType = ConnectionLineType.Bezier;
    const [validQuests, invalidQuests] = _.partition(
        Object.entries(quests),
        ([quest, data]) => {
            if (!data.prior) return false;
            const priorQuests = data.prior.filter((priorQuest) => {
                return !!quests[priorQuest];
            });
            return priorQuests.length;
        }
    );

    const questEdges = validQuests.map(([quest, data]): QuestEdge[] => {
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

    const rootEdges: QuestEdge[] = invalidQuests.map(
        ([quest, data]): QuestEdge => {
            return {
                id: `root-${quest}`,
                source: "root",
                target: quest,
                animated: false,
                type: edgeType,
            };
        }
    );

    return [...questEdges, ...rootEdges].flat();
};

const generateTraderGraphData = (
    FirebaseTraderData: FirebaseTraderData | null
) => {
    if (!FirebaseTraderData) return;
    const allTraderData = transformFirebaseTraderData(FirebaseTraderData);
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
    return allTraderQuestNodes;
};

export default generateTraderGraphData;
