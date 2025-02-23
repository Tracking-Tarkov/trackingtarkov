import {
    onChildAdded,
    onChildRemoved,
    push,
    ref,
    remove,
    update
} from 'firebase/database';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import shortUuid from 'short-uuid';
import { database } from '../utils/firebase';

export type Point = {
    x: number;
    y: number;
}

export type Line = {
    color: string;
    width: number;
    points: Point[];
};

export type DBLine = {
    color: string;
    width: number;
    points: string;
}

const SERIAL_RADIX = 36;

const parsePoints = (serializedPoints: string): Point[] => {
    const result: Point[] = [];
    const points = serializedPoints.split(',');
    for (let index = 0; index < points.length; index += 2) {
        const x = Number.parseInt(points[index], SERIAL_RADIX);
        const y = Number.parseInt(points[index + 1], SERIAL_RADIX);
        result.push({ x, y });
    }
    return result;
};

const parseLine = (line: DBLine): Line => {
    return { color: line.color, width: line.width, points: parsePoints(line.points) };
};

const serializeLine = (line: Line): DBLine => {
    const onlyPoints = line.points.flatMap((point) =>
        [Math.trunc(point.x).toString(SERIAL_RADIX), Math.trunc(point.y).toString(SERIAL_RADIX)]);
    return {
        color: line.color,
        width: line.width,
        points: onlyPoints.join(',')
    };
};

export const useMapRoom = () => {
    const { map = '', subMap = '' } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [mapLines, setMapLines] = useState<Record<string, Line[]>>({});

    const roomId = searchParams.get('mapRoomId');
    const roomPath = `/mapRooms/${roomId}`;
    const linePath = `${roomPath}/${map}/${subMap}/lines`;
    const mapKey = `${map}-${subMap}`;

    useEffect(() => {
        if (!roomId) return;
        const cleanup = onChildAdded(ref(database, linePath), (snapshot) => {
            if (snapshot.exists()) {
                const parsedLine = parseLine(snapshot.val());
                setMapLines(prev => ({
                    ...prev,
                    [mapKey]: (prev[mapKey] ?? []).concat(parsedLine)
                }));
            }
        });
        return () => {
            cleanup();
            setMapLines(prev => ({ ...prev, [mapKey]: [] }));
        };
    }, [roomId, map, subMap]);

    useEffect(() => {
        if (!roomId) return;
        const cleanup = onChildRemoved(ref(database, linePath), () => {
            setMapLines(prev => ({ ...prev, [mapKey]: [] }));
        });
        return () => {
            cleanup();
            setMapLines(prev => ({ ...prev, [mapKey]: [] }));
        };
    }, [roomId, map, subMap]);

    const saveLine = (line: Line) => {
        setMapLines(prev => ({ ...prev, [mapKey]: (prev[mapKey] ?? []).concat(line) }));
        if (!roomId) return;
        update(ref(database, roomPath), { lastUpdated: Date.now() });
        push(ref(database, linePath), serializeLine(line));
    };

    const clearMap = () => {
        setMapLines(prev => ({ ...prev, [mapKey]: [] }));
        if (!roomId) return;
        remove(ref(database, linePath));
    };

    const startMapRoom = (): string => {
        if (!roomId) {
            const id = shortUuid.generate();
            searchParams.set('mapRoomId', id);
            setSearchParams(searchParams);
            setMapLines({});
        }

        return window.location.href;
    };

    const leaveMapRoom = () => {
        searchParams.delete('mapRoomId');
        setSearchParams(searchParams);
        setMapLines({});
    };

    return {
        roomId,
        map,
        subMap,
        lines: mapLines[mapKey] ?? [],
        startMapRoom,
        leaveMapRoom,
        saveLine,
        clearMap
    };
};
