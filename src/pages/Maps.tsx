import { useEffect, useState, useRef } from "react";

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

import labs from "../mapimages/Labs/labs.jpg";
import labsExtract from "../mapimages/Labs/labsExtract.jpg";
import labsHorizontal from "../mapimages/Labs/labsHorizontal.jpg";
import labsVertical from "../mapimages/Labs/labsVertical.jpg";

import GenericNavbar from "../components/GenericNavbar/GenericNavbar";
import {
    TransformWrapper,
    TransformComponent,
    ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import "./styles/maps.scss";

const mapNames: string[] = [
    "Customs",
    "Shoreline",
    "Factory",
    "Woods",
    "Reserve",
    "Interchange",
    "Lighthouse",
    "Labs",
];

const tarkovMaps = new Map<string, string[]>()
    .set("Customs", [customs, customsGray])
    .set("Shoreline", [shoreline, shorelineSpawn])
    .set("Factory", [factory])
    .set("Woods", [woods])
    .set("Reserve", [reserve, reserveGray, reserveKey])
    .set("Interchange", [interchangeJPG])
    .set("Lighthouse", [lighthouse, lighthouseRotated, lighthouseFlat])
    .set("Labs", [labs, labsExtract, labsHorizontal, labsVertical]);

const getTarkovMaps = (mapName: string) => {
    const map = tarkovMaps.get(mapName);
    if (!map) {
        return [];
    }
    return map;
};

const Maps = () => {
    const [currentMap, setCurrentMap] = useState<number>(0);
    const [currentSubMap, setCurrentSubMap] = useState<number>(0);
    const ref = useRef<ReactZoomPanPinchRef>(null);

    useEffect(() => {
        setTimeout(() => {
            ref?.current?.centerView(0.5, 500, "easeOut");
        }, 300);
    }, [currentMap, currentSubMap]);

    useEffect(() => {
        setCurrentSubMap(0);
    }, [currentMap]);

    return (
        <>
            <GenericNavbar
                navData={mapNames}
                currentNav={currentMap}
                setCurrentNav={setCurrentMap}
            />
            <GenericNavbar
                navData={getTarkovMaps(mapNames[currentMap]).map(
                    (map, index) => {
                        return (index + 1).toString();
                    }
                )}
                currentNav={currentSubMap}
                setCurrentNav={setCurrentSubMap}
            />
            <div className="image-wrapper">
                <TransformWrapper
                    ref={ref}
                    minScale={0.1}
                    initialScale={0.5}
                    centerZoomedOut
                    centerOnInit
                >
                    <TransformComponent wrapperClass="transform-component">
                        <img
                            width="100%"
                            src={
                                getTarkovMaps(mapNames[currentMap])[
                                    currentSubMap
                                ]
                            }
                            alt={mapNames[currentMap]}
                            loading="eager"
                        />
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </>
    );
};

export default Maps;
