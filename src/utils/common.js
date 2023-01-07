/** @module Common Utils */
import _ from "lodash";

export const getAllTruthyValues = (quests) => {
    return Object.fromEntries(
        Object.entries(quests).filter((val) => Boolean(val[1]))
    );
};

export const getDoneCount = (completedQuestsTrader, traderQuests) => {
    const user = Object.keys(completedQuestsTrader);
    const trader = Object.keys(traderQuests);
    return user.filter((x) => trader.includes(x)).length;
};

export const getAllPreviousQuests = (questName, traderQuests, priors) => {
    const currentQuest = traderQuests[questName];
    if (currentQuest?.Prior) {
        currentQuest.Prior.forEach((quest) => {
            if (traderQuests[quest]) {
                _.set(priors, quest, true);
                getAllPreviousQuests(quest, traderQuests, priors);
            }
        });
    } else {
        return;
    }
};
