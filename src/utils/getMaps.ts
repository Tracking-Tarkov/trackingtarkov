import customs from "../mapimages/Customs/customs.jpg";
import customsGray from "../mapimages/Customs/customsGray.jpg";

import shoreline from "../mapimages/Shoreline/shoreline.jpg";
import shorelineSpawn from "../mapimages/Shoreline/shorelineSpawn.jpg";

import factory from "../mapimages/Factory/factory.jpg";

import woods from "../mapimages/Woods/woods.jpg";

import reserve from "../mapimages/Reserve/reserve.jpg";
import reserveGray from "../mapimages/Reserve/reserveGray.jpg";
import reserveKey from "../mapimages/Reserve/reserveKey.jpg";

import interchangeJPG from "../mapimages/Interchange/interchange.jpg";

import lighthouse from "../mapimages/Lighthouse/lighthouse.jpg";
import lighthouseRotated from "../mapimages/Lighthouse/lighthouseRotated.jpg";
import lighthouseFlat from "../mapimages/Lighthouse/lighthouseFlat.jpg";

import streets3d from "../mapimages/Streets/streets3d.jpg";
import streets2d from "../mapimages/Streets/streets2d.jpg";

import labs from "../mapimages/Labs/labs.jpg";
import labsExtract from "../mapimages/Labs/labsExtract.jpg";
import labsHorizontal from "../mapimages/Labs/labsHorizontal.jpg";
import labsVertical from "../mapimages/Labs/labsVertical.jpg";

export type Maps = Record<string, TarkovMap>;

export interface TarkovMap {
    subMaps: Record<string, string>;
    playerCount: number;
    duration: number;
}

export interface TarkovSubMap {
    name: string;
    path: string;
}

export const tarkovMaps: Maps = {
    customs: {
        subMaps: {
            "customs-3d-night": customs,
            "customs-3d": customsGray,
        },
        playerCount: 16,
        duration: 35,
    },
    shoreline: {
        subMaps: {
            "shoreline-2d": shoreline,
            "shoreline-3d": shorelineSpawn,
        },
        playerCount: 16,
        duration: 35,
    },
    factory: {
        subMaps: {
            "factory-3d": factory,
        },
        playerCount: 16,
        duration: 35,
    },
    woods: {
        subMaps: {
            "woods-2d": woods,
        },
        playerCount: 16,
        duration: 35,
    },
    reserve: {
        subMaps: {
            "reserve-3d-night": reserve,
            "reserve-3d-gray": reserveGray,
            "reserve-3d-keys": reserveKey,
        },
        playerCount: 16,
        duration: 35,
    },
    interchange: {
        subMaps: {
            "interchange-2d": interchangeJPG,
        },
        playerCount: 16,
        duration: 35,
    },
    labs: {
        subMaps: {
            "labs-2d": labs,
            "labs-3d-extracts": labsExtract,
            "labs-3d-horizontal": labsHorizontal,
            "labs-3d-vertical": labsVertical,
        },
        playerCount: 16,
        duration: 35,
    },
    lighthouse: {
        subMaps: {
            "lighthouse-3d": lighthouse,
            "lighthouse-3d-side": lighthouseRotated,
            "lighthouse-2d": lighthouseFlat,
        },
        playerCount: 16,
        duration: 35,
    },
    streets: {
        subMaps: {
            "streets-2d": streets2d,
            "streets-3d": streets3d,
        },
        playerCount: 16,
        duration: 35,
    },
};
