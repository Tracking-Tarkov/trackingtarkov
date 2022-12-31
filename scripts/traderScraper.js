/** @module scraper */
import _ from "lodash";
import axios from "axios";
import cheerio from "cheerio";

const getPriorNext = async (res, trader, title, link) => {
    try {
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);
        const prior = [];
        const next = [];
        $(".va-infobox-label").each((_idx, el) => {
            if (
                $(el)
                    .text()
                    .match(/(Required forKappa)(.*)/gs)
            ) {
                let kappa = $(el).next("td").next("td").text();
                if (kappa === "Yes") {
                    _.set(res, `${trader}.quests.${title}.kappa`, true);
                } else if (kappa === "No") {
                    _.set(res, `${trader}.quests.${title}.kappa`, false);
                }
            }
        });
        $(".va-infobox-content").each((_idx, el) => {
            if (
                $(el)
                    .text()
                    .match(/(Previous:)(.*)/gs)
            ) {
                const lisPr = $(el).children();
                $(lisPr).each((_idx, el) => {
                    if ($(el).is("a")) {
                        prior.push(
                            _.camelCase($(el).text().replace("(quest)", ""))
                        );
                    }
                });
                if (prior.length > 0) {
                    _.set(res, `${trader}.quests.${title}.prior`, prior);
                }
            }
            if (
                $(el)
                    .text()
                    .match(/(Leads to:)(.*)/gs)
            ) {
                const li = $(el).children();
                $(li).each((_idx, el) => {
                    if ($(el).is("a")) {
                        next.push(
                            _.camelCase($(el).text().replace("(quest)", ""))
                        );
                    }
                });
                if (next.length > 0) {
                    _.set(res, `${trader}.quests.${title}.next`, next);
                }
            }
        });
        return;
    } catch (error) {
        throw error;
    }
};

const getUrls = async () => {
    try {
        const { data } = await axios.get(
            "https://escapefromtarkov.fandom.com/wiki/Quests"
        );
        const $ = cheerio.load(data);
        const res = {};
        let promises = [];
        $(".dealer-toggle").each((_idx, el) => {
            let image = $(el).children().attr("data-src");
            image = image.replace(/(.*.png)(.*)/, (match, link) => {
                return link;
            });
            const trader = $(el).attr("title");
            _.set(res, trader, { image });
        });

        Object.keys(res).forEach((trader) => {
            const path = `.${trader}-content > tbody > tr`;
            let title = "";
            $(path).each((_idx, tr) => {
                if (_idx === 0 || _idx === 1) {
                    return;
                }
                const tds = $(tr).children();
                $(tds).each((_idx, td) => {
                    const text = $(td).text().replace(/\n+/g, "");
                    switch (_idx) {
                        case 0:
                            title = _.camelCase(text);
                            const link =
                                "https://escapefromtarkov.fandom.com" +
                                $(td).find("a").attr("href");
                            _.set(res, `${trader}.quests.${title}`, {});
                            _.set(res, `${trader}.quests.${title}.name`, text);
                            _.set(res, `${trader}.quests.${title}.link`, link);

                            const prom = getPriorNext(res, trader, title, link);
                            promises.push(prom);

                            break;
                        case 1:
                            _.set(res, `${trader}.quests.${title}.type`, text);
                            break;
                        case 2:
                            const objectives = [];
                            const lisOb = $(td).children().children();
                            $(lisOb).each((_idx, obj) => {
                                objectives.push(
                                    $(obj).text().replace(/\n+/g, "")
                                );
                            });
                            _.set(
                                res,
                                `${trader}.quests.${title}.objectives`,
                                objectives
                            );
                            break;
                        case 3:
                            const rewards = [];
                            const lisRe = $(td).children().children();
                            $(lisRe).each((_idx, rew) => {
                                rewards.push($(rew).text().replace(/\n+/g, ""));
                            });
                            _.set(
                                res,
                                `${trader}.quests.${title}.rewards`,
                                rewards
                            );
                            break;
                        default:
                            break;
                    }
                });
            });
        });
        await Promise.all(promises);
        return res;
    } catch (error) {
        throw error;
    }
};

export const updateTraderData = async (database) => {
    let traders = {};
    await database
        .ref("traders")
        .get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                traders = snapshot.val();
            } else {
                return null;
            }
        })
        .catch((error) => {
            console.log("Erroring getting trader quests" + error);
        });

    if (traders?.lastUpdated) {
        delete traders.lastUpdated;
    }

    const traderQuests = await getUrls();
    if (_.isEqual(traderQuests, traders.quests)) {
        console.log("Trader data was the same, did not update");
        return;
    }

    // _.set(traderQuests, "lastUpdated", Date.now());

    await database
        .ref("traders")
        .set({ quests: traderQuests, lastUpdated: Date.now() });
};
