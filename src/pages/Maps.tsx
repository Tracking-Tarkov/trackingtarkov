import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { tarkovMaps } from "../utils/getMaps";
import DropdownMenu, {
    DropdownElement,
} from "../components/DropdownMenu/DropdownMenu";
import {
    TransformWrapper,
    TransformComponent,
    ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import "./styles/maps.scss";

const buildTarkovMapMenuItems = (): DropdownElement[] => {
    const dropDownElements = Object.entries(tarkovMaps).map(
        ([map, data]): DropdownElement => {
            return {
                label: map,
                menuItems: Object.keys(data.subMaps),
            };
        }
    );
    return dropDownElements;
};

const Maps = () => {
    const { map = "", subMap = "" } = useParams();

    const ref = useRef<ReactZoomPanPinchRef>(null);

    useEffect(() => {
        setTimeout(() => {
            ref?.current?.centerView(0.5, 500, "easeOut");
        }, 300);
    }, [subMap]);

    return (
        <>
            <DropdownMenu navData={buildTarkovMapMenuItems()} />

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
                            src={tarkovMaps[map].subMaps[subMap]}
                            alt={"Map"}
                            loading="eager"
                        />
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </>
    );
};

export default Maps;
