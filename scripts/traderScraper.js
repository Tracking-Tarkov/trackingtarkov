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
          _.set(res, `${trader}.Quests.${title}.Kappa`, true);
        } else if (kappa === "No") {
          _.set(res, `${trader}.Quests.${title}.Kappa`, false);
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
            prior.push(_.camelCase($(el).text().replace("(quest)", "")));
          }
        });
        if (prior.length > 0) {
          _.set(res, `${trader}.Quests.${title}.Prior`, prior);
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
            next.push(_.camelCase($(el).text().replace("(quest)", "")));
          }
        });
        if (next.length > 0) {
          _.set(res, `${trader}.Quests.${title}.Next`, next);
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
              _.set(res, `${trader}.Quests.${title}`, {});
              _.set(res, `${trader}.Quests.${title}.Name`, text);
              _.set(res, `${trader}.Quests.${title}.Link`, link);

              const prom = getPriorNext(res, trader, title, link);
              promises.push(prom);

              break;
            case 1:
              _.set(res, `${trader}.Quests.${title}.Type`, text);
              break;
            case 2:
              const objectives = [];
              const lisOb = $(td).children().children();
              $(lisOb).each((_idx, obj) => {
                objectives.push($(obj).text().replace(/\n+/g, ""));
              });
              _.set(res, `${trader}.Quests.${title}.Objectives`, objectives);
              break;
            case 3:
              const rewards = [];
              const lisRe = $(td).children().children();
              $(lisRe).each((_idx, rew) => {
                rewards.push($(rew).text().replace(/\n+/g, ""));
              });
              _.set(res, `${trader}.Quests.${title}.Rewards`, rewards);
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
  let traderQuestsDatabase = {};
  await database
    .ref("traderQuests")
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        traderQuestsDatabase = snapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.log("Erroring getting trader quests" + error);
    });

  if (traderQuestsDatabase?.lastUpdated) {
    delete traderQuestsDatabase.lastUpdated;
  }

  const traderQuests = await getUrls();
  if (_.isEqual(traderQuests, traderQuestsDatabase)) {
    console.log("Trader data was the same, did not update");
    return;
  }

  _.set(traderQuests, "lastUpdated", Date.now());

  await database.ref("traderQuests").set(traderQuests);
};
