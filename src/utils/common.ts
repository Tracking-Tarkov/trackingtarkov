/** @module Common Utils */
import { Quests } from "./buildQuestNodes";

const getQuestPriors = (
    quest: string,
    quests: Quests,
    priors: Array<String>
) => {
    priors.push(quest);
    if (!quests[quest] || !quests[quest].prior) return;
    quests[quest].prior.forEach((prior) => {
        getQuestPriors(prior, quests, priors);
    });
};

const getQuestNexts = (quest: string, quests: Quests, nexts: Array<String>) => {
    nexts.push(quest);
    if (!quests[quest] || !quests[quest].next) return;
    quests[quest].next.forEach((next) => {
        getQuestNexts(next, quests, nexts);
    });
};

export const getAllQuestPriors = (
    questName: string,
    traderQuests: Quests
): Array<string> => {
    const priors: Array<string> = [];
    getQuestPriors(questName, traderQuests, priors);
    return priors;
};

export const getAllQuestNexts = (
    questName: string,
    traderQuests: Quests
): Array<string> => {
    const nexts: Array<string> = [];
    getQuestNexts(questName, traderQuests, nexts);
    return nexts;
};
