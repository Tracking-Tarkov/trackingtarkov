import {
    useState,
    useCallback,
    useEffect,
    useRef,
    MouseEvent
} from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import _ from 'lodash';
import QuestPopover from '../QuestPopover/QuestPopover';
import { QuestData } from '../../utils/buildQuestNodes';
import {
    ref,
    update,
    onValue,
    DataSnapshot
} from 'firebase/database';
import { database } from '../../utils/firebase';
import { getAllQuestPriors, getAllQuestNexts } from '../../utils/common';

import './styles/questnode.scss';
import { Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export interface IQuestNode extends NodeProps {
    data: QuestData;
}

const QuestNode = ({ data }: IQuestNode) => {
    const [openPopover, setOpenPopover] = useState(false);
    const { viewAs, readOnly, user } = useAuth();
    const [isQuestComplete, setIsQuestComplete] = useState<boolean>(false);
    const popoverAnchor = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!viewAs) return;

        // Do we want one listener for the whole node, or one for the completion and one for the objectives?

        const questStateRef = ref(
            database,
            `users/${viewAs}/completedQuests/${data.trader}/${data.dbId}`
        );

        const snapshotCallback = (snapshot: DataSnapshot) => {
            const questState = snapshot.val();
            setIsQuestComplete(!!questState);
        };

        return onValue(questStateRef, snapshotCallback);
    }, [viewAs, data]);

    const closePopover = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();
            setOpenPopover(false);
        },
        [setOpenPopover]
    );

    const updateQuestState = useCallback(() => {
        if (readOnly || !user) return;

        const questRef = ref(
            database,
            `users/${user.uid}/completedQuests/${data.trader}`
        );

        const updatedCompletions = { [data.dbId]: !isQuestComplete };
        if (!isQuestComplete) {
            const priors = getAllQuestPriors(data.dbId, data.traderQuests);
            priors.forEach((prior) => {
                updatedCompletions[prior] = true;
            });
        }
        if (isQuestComplete) {
            const nexts = getAllQuestNexts(data.dbId, data.traderQuests);
            nexts.forEach((next) => {
                updatedCompletions[next] = false;
            });
        }
        update(questRef, updatedCompletions);
    }, [readOnly, isQuestComplete, user, data]);

    return (
        <div
            ref={popoverAnchor}
            className={
                [
                    'quest-node',
                    `${_.kebabCase(data.trader)}-node`,
                    isQuestComplete ? `${_.kebabCase(data.trader)}-completed` : '',
                ].join(' ')
            }
            onClick={() => setOpenPopover(true)}
        >
            <Handle type="target" position={Position.Top} />
            <Typography sx={{ fontSize: '12px' }}>{data.name}</Typography>
            <Handle type="source" position={Position.Bottom} />
            <QuestPopover
                readOnly={readOnly}
                open={openPopover}
                onClose={closePopover}
                questInfo={data}
                completed={isQuestComplete}
                anchor={popoverAnchor}
                updateQuestState={updateQuestState}
            />
        </div >
    );
};

export default QuestNode;
