import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    ChangeEvent
} from 'react';
import {
    Box,
    Button,
    styled,
    Tooltip,
    Typography,
    Zoom
} from '@mui/material';
import { tarkovMaps } from '../utils/getMaps';
import DropdownMenu, { DropdownElement } from '../components/DropdownMenu/DropdownMenu';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Point, useMapRoom } from '../hooks/useMapRoom';
import DrawableMap from '../components/DrawableMap/DrawableMap';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Slider from '@mui/material/Slider';
import Popover from '@mui/material/Popover';
import { HexColorPicker } from 'react-colorful';
import { Settings, Share, PanToolAlt } from '@mui/icons-material';
import CopyTooltip from '../components/CopyTooltip/CopyTooltip';

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

const LineWeightSlider = styled(Slider)(() => ({
    color: '#ffffff',
    height: 5,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 12,
        width: 12,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&::before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        color: 'black',
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#ffffff',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&::before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
}));

const generateRandomHexColor = () => '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

const Maps = () => {
    const { 
        drawingDatabaseDisabled, 
        roomId, 
        map, 
        subMap,
        lines, 
        saveLine, 
        startMapRoom, 
        leaveMapRoom, 
        clearMap 
    } = useMapRoom();
    const [lineWeight, setLineWeight] = useState<number>(5);
    const [lineColor, setLineColor] = useState<string>(generateRandomHexColor());
    const [showCopied, setShowCopied] = useState(false);
    const [isDrawMode, setIsDrawMode] = useState(false);
    const [openPopover, setOpenPopover] = useState(false);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const popoverAnchor = useRef(null);
    const ref = useRef<ReactZoomPanPinchRef>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        new ResizeObserver(() => {
            if (!imgRef.current) return;
            setImgSize({
                width: imgRef.current.width,
                height: imgRef.current.height,
            });
        }).observe(document.body);
    }, []);

    const handleClosePopover = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();
            setOpenPopover(false);
        },
        [setOpenPopover]
    );

    const handleImageLoad = (event: ChangeEvent<HTMLImageElement>) => {
        const { width, height } = event.target;
        setImgSize({ width, height });
    };

    const handleToggleDrawMode = () => setIsDrawMode(!isDrawMode);

    const handleOpenPopover = () => setOpenPopover(true);

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

    useEffect(() => {
        ref?.current?.resetTransform();
    }, [subMap]);

    useEffect(() => {
        if (showCopied) {
            setTimeout(() => setShowCopied(false), 1000);
        }
    }, [showCopied]);

    const savePath = (path: Point[]) => {
        saveLine({
            color: lineColor,
            width: lineWeight,
            points: path,
        });
    };

    return (
        <>
            <DropdownMenu navData={buildTarkovMapMenuItems()} />
            <Box >
                <Popover
                    open={openPopover}
                    onClose={handleClosePopover}
                    anchorEl={popoverAnchor.current}
                    anchorOrigin={{ horizontal: -15, vertical: 'center' }}
                    transformOrigin={{ horizontal: 'right', vertical: 'center' }}
                >
                    <div className='popover-container'>
                        <Box
                            width='100%'
                            flexGrow={1}
                            display='flex'
                            flexDirection='column'
                            justifyContent='space-between'
                            alignItems='center'
                            gap={2}
                        >
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignItems='center'
                                width='75%'
                            >
                                <Button variant='outlined' onClick={clearMap}> Reset </Button>
                                <Button disabled={!roomId} variant='outlined' onClick={leaveMapRoom}> Leave </Button>
                            </Box>
                            <Box
                                display='flex'
                                flexDirection='column'
                                justifyContent='center'
                                alignItems='center'
                                width='75%'
                            >
                                <LineWeightSlider
                                    defaultValue={5}
                                    aria-label="Default"
                                    max={20}
                                    min={1}
                                    valueLabelDisplay="auto"
                                    value={lineWeight}
                                    onChange={(e, newValue) => setLineWeight(newValue as number)}
                                />
                                <Typography variant='button'> Line weight </Typography>
                            </Box>
                        </Box>
                        <HexColorPicker color={lineColor} onChange={setLineColor} />
                    </div>
                </Popover >
                {!drawingDatabaseDisabled && (
                    <CopyTooltip
                        title="Copied"
                        open={showCopied}
                        arrow
                        placement='top'
                        TransitionComponent={Zoom}>
                        <Tooltip
                            title={<Typography color="inherit"> Share this room to draw with others </Typography>}
                            arrow
                            placement='left'
                        >
                            <Fab
                                sx={{
                                    position: 'absolute',
                                    bottom: 156,
                                    right: 16,
                                }}
                                color='default'
                                onClick={() => navigator.clipboard
                                    .writeText(startMapRoom())
                                    .then(() => setShowCopied(true))
                                }
                            >
                                <Share />
                            </Fab>
                        </Tooltip>

                    </CopyTooltip>
                )}
                <Tooltip
                    title={<Typography color="inherit"> Enter {isDrawMode ? 'move' : ' draw' } mode</Typography>}
                    arrow
                    placement='left'
                >
                    <Fab
                        sx={{
                            position: 'absolute',
                            bottom: 86,
                            right: 16,
                        }}
                        color='default'
                        onClick={handleToggleDrawMode}
                    >
                        {isDrawMode ? <PanToolAlt /> : <EditIcon />}
                    </Fab>
                </Tooltip>
                <Tooltip
                    title={<Typography color="inherit"> Open settings </Typography>}
                    arrow
                    placement='left'
                >
                    <Fab
                        ref={popoverAnchor}
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                        }}
                        color='default'
                        onClick={handleOpenPopover}
                    >
                        <Settings />
                    </Fab>
                </Tooltip>

            </Box >
            <div className="display-wrapper">
                <TransformWrapper
                    ref={ref}
                    initialScale={1}
                    centerOnInit
                    wheel={{ step: 0.2 }}
                    panning={{
                        disabled: isDrawMode
                    }}
                >
                    <TransformComponent>
                        <div className="map-image-wrapper" id='observe-resize'>
                            {imgRef.current ? (
                                <DrawableMap
                                    lineWidth={lineWeight}
                                    lineColor={lineColor}
                                    lines={lines}
                                    savePath={savePath}
                                    width={imgSize.width}
                                    height={imgSize.height}
                                    disabled={!isDrawMode}
                                />
                            ) : null}
                            <img
                                ref={imgRef}
                                alt={'Map'}
                                loading="lazy"
                                className="map-image"
                                src={tarkovMaps[map].subMaps[subMap]}
                                onLoad={handleImageLoad}
                            />
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </>
    );
};

export default Maps;
