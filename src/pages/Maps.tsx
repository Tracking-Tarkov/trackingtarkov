import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { tarkovMaps } from '../utils/getMaps';
import DropdownMenu, { DropdownElement } from '../components/DropdownMenu/DropdownMenu';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import './styles/maps.scss';

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
    const { map = '', subMap = '' } = useParams();

    useEffect(() => {
        let viewableHeight = window.innerHeight - 65;
        if (viewableHeight < 100) {
            viewableHeight = window.innerHeight;
        }

        document.documentElement.style.setProperty(
            '--display-height',
            `${viewableHeight}px`
        );

        const cleanup = () => {
            document.documentElement.style.setProperty(
                '--display-height',
                'auto'
            );
        };

        return cleanup;
    });

    const ref = useRef<ReactZoomPanPinchRef>(null);

    useEffect(() => {
        ref?.current?.resetTransform();
    }, [subMap]);

    return (
        <>
            <DropdownMenu navData={buildTarkovMapMenuItems()} />

            <div className="display-wrapper">
                <TransformWrapper
                    ref={ref}
                    initialScale={1}
                    centerOnInit
                    wheel={{ step: 0.2 }}
                >
                    <TransformComponent>
                        <div className="map-image-wrapper">
                            <img
                                alt={'Map'}
                                loading="lazy"
                                className="map-image"
                                src={tarkovMaps[map].subMaps[subMap]}
                            />
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </>
    );
};

export default Maps;
