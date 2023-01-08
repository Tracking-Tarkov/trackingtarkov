/** @module Common Utils */
import { Quests } from "./buildQuestNodes";

const getQuestPriors = (
    quest: string,
    quests: Quests,
    priors: Array<String>
) => {
    priors.push(quest);
    if (!quests[quest] || !quests[quest].prior) return;
    quests[quest].prior.forEach(prior => {
        getQuestPriors(prior, quests, priors);
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
