import { useState, useCallback, useEffect, useRef, MouseEvent } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import QuestPopover from "../QuestPopover/QuestPopover";
import { QuestData, TraderGraphData } from "../../utils/buildQuestNodes";
import {
    ref,
    update,
    onValue,
    DataSnapshot,
} from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../../utils/firebase";
import _ from "lodash";

import "./styles/questnode.scss";
import { getAllQuestPriors } from "../../utils/common";

export interface IQuestNode extends NodeProps {
    data: QuestData;
}

const QuestNode = ({ data }: IQuestNode) => {
    const [openPopover, setOpenPopover] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [isQuestComplete, setIsQuestComplete] = useState<boolean>(false);
    const popoverAnchor = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        // Do we want one listener for the whole node, or one for the completion and one for the objectives?

        const questStateRef = ref(
            database,
            `users/${user.uid}/completedQuests/${data.trader}/${data.dbId}`
        );

        const snapshotCallback = (snapshot: DataSnapshot) => {
            const questState = snapshot.val();
            setIsQuestComplete(!!questState);
        };

        onValue(questStateRef, snapshotCallback);
    }, [user, data]);

    const closePopover = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();
            setOpenPopover(false);
        },
        [setOpenPopover]
    );

    const updateQuestState = useCallback(() => {
        if (!user) return;

        const questRef = ref(
            database,
            `users/${user.uid}/completedQuests/${data.trader}`
        );

        const updatedCompletions = { [data.dbId]: !isQuestComplete };
        if (!isQuestComplete) {
            const priors = getAllQuestPriors(data.dbId, data.traderQuests);
            priors.forEach(prior => {
                updatedCompletions[prior] = true;
            });
        }
        update(questRef, updatedCompletions);
    }, [isQuestComplete, user, data]);

    return (
        <div
            ref={popoverAnchor}
            className={`quest-node ${data.trader.toLowerCase()}-node ${isQuestComplete && data.trader.toLowerCase()
                }-completed`}
            onClick={() => setOpenPopover(true)}
        >
            <Handle type="target" position={Position.Top} />
            {data.name}
            <Handle type="source" position={Position.Bottom} />
            <QuestPopover
                open={openPopover}
                onClose={closePopover}
                questInfo={data}
                completed={isQuestComplete}
                anchor={popoverAnchor}
                updateQuestState={updateQuestState}
            />
        </div>
    );
};

export default QuestNode;
