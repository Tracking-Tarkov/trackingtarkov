import { useEffect, useState, useRef, useCallback } from "react";

import customs from "../mapimages/Customs/customs.jpg";
import customsGray from "../mapimages/Customs/customsGray.jpg";
import customsSVG from "../mapimages/Customs/Customs.svg";

import shoreline from "../mapimages/Shoreline/shoreline.jpg";
import shorelineSpawn from "../mapimages/Shoreline/shorelineSpawn.jpg";
import shorelineSVG from "../mapimages/Shoreline/Shoreline.svg";

import factory from "../mapimages/Factory/factory.jpg";
import factorySVG from "../mapimages/Factory/Factory.svg";

import woods from "../mapimages/Woods/woods.jpg";
import woodsSVG from "../mapimages/Woods/Woods.svg";

import reserve from "../mapimages/Reserve/reserve.jpg";
import reserveGray from "../mapimages/Reserve/reserveGray.jpg";
import reserveKey from "../mapimages/Reserve/reserveKey.jpg";
import reserveSVG from "../mapimages/Reserve/Reserve.svg";

import interchangeJPG from "../mapimages/Interchange/interchange.jpg";
import interchangeSVG from "../mapimages/Interchange/Interchange.svg";

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

export interface LocationMaps {}

const tarkovMaps = new Map<string, string[]>()
    .set("Customs", [customs, customsGray, customsSVG])
    .set("Shoreline", [shoreline, shorelineSpawn, shorelineSVG])
    .set("Factory", [factory, factorySVG])
    .set("Woods", [woods, woodsSVG])
    .set("Reserve", [reserve, reserveGray, reserveSVG, reserveKey])
    .set("Interchange", [interchangeJPG, interchangeSVG])
    .set("Lighthouse", [lighthouse, lighthouseRotated, lighthouseFlat])
    .set("Labs", [labs, labsExtract, labsHorizontal, labsVertical]);

const getTarkovMaps = (mapName: string) => {
    const map = tarkovMaps.get(mapName);
    if (!map) {
        return "Unknown Map";
    }
    return map;
};

const Maps = () => {
    const [currentMap, setCurrentMap] = useState<number>(0);
    const ref = useRef<ReactZoomPanPinchRef>(null);

    useEffect(() => {
        setTimeout(() => {
            ref?.current?.centerView(0.5, 500, "easeOut");
        }, 300);
    }, [currentMap]);

    return (
        <>
            <GenericNavbar
                navData={mapNames}
                currentNav={currentMap}
                setCurrentNav={setCurrentMap}
            />
            <div className="element">
                <TransformWrapper
                    ref={ref}
                    minScale={0.1}
                    initialScale={0.5}
                    centerZoomedOut
                    centerOnInit
                >
                    <TransformComponent wrapperClass="wrapper">
                        <img
                            width="100%"
                            src={getTarkovMaps(mapNames[currentMap])[0]}
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
