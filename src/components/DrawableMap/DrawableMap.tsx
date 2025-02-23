import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Line, Point } from '../../hooks/useMapRoom';

type DrawableMapProps = {
    disabled: boolean;
    width: number;
    height: number;
    savePath: (path: Point[]) => void;
    lineColor: string;
    lineWidth: number;
    lines: Line[];
};

const getTransformedEvent = (event: React.MouseEvent<HTMLCanvasElement>, canvasWidth: number, canvasHeight: number) => {
    const bound = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bound.left) / bound.width) * canvasWidth;
    const y = ((event.clientY - bound.top) / bound.height) * canvasHeight;

    return { x, y };
};

const drawLine = (context: CanvasRenderingContext2D, line: Line): number => {
    let num = 0;
    context.beginPath();
    context.strokeStyle = line.color;
    context.lineWidth = line.width;
    const start = line.points[0];
    context.moveTo(start.x, start.y);
    line.points.forEach(point => {
        context.lineTo(point.x, point.y);
        num += 1;
    });
    const end = line.points[line.points.length - 1];
    context.lineTo(end.x, end.y);
    context.stroke();
    return num;
};

const drawLines = (context: CanvasRenderingContext2D, lines: Line[]) => {
    let num = 0;
    lines.forEach(line => num += drawLine(context, line));
};

const DrawableMap = ({ lineColor, lineWidth, disabled, savePath, lines, width, height }: DrawableMapProps) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [path, setPath] = useState<Point[]>([]);

    const [canvasWidth, canvasHeight] = useMemo(()=> {
        const ratio = width / height;
        const baseValue = 2000;
        return [baseValue, baseValue / ratio];
    }, [width, height]);

    useEffect(() => {
        const context = ref.current?.getContext('2d');
        if (!context) return;
        if (isDrawing) {
            lines.push({
                color: lineColor,
                width: lineWidth,
                points: path,
            });
        }
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawLines(context, lines);
    }, [lines]);

    const onMouseDown: React.MouseEventHandler<HTMLCanvasElement> = useCallback((event) => {
        if (disabled || isDrawing) return;
        const { x, y } = getTransformedEvent(event, canvasWidth, canvasHeight);
        setPath([{ x, y }]);
        setIsDrawing(true);
    }, [isDrawing, disabled, setPath, setIsDrawing]);

    const onMouseUp: React.MouseEventHandler<HTMLCanvasElement> = useCallback((event) => {
        if (disabled || !isDrawing) return;
        setPath([]);
        setIsDrawing(false);
        if (path.length > 1) {
            const { x, y } = getTransformedEvent(event, canvasWidth, canvasHeight);
            const newPath = [...path, { x, y }];
            savePath(newPath);
        }
    }, [path, disabled, savePath, setPath, isDrawing, setIsDrawing]);

    const onMouseMove: React.MouseEventHandler<HTMLCanvasElement> = useCallback((event) => {
        if (disabled || !isDrawing) return;
        const context = ref.current?.getContext('2d');
        if (!context) return;
        const { x, y } = getTransformedEvent(event, canvasWidth, canvasHeight);
        const prev = path[path.length - 1];
        if (Math.sqrt((prev.x - x) ** 2 + (prev.y - y) ** 2) > 15) {
            setPath(prev => {
                const newPath = [...prev, { x, y }];
                drawLine(context, { color: lineColor, width: lineWidth, points: newPath });
                return newPath;
            });

        }
    }, [path, disabled, isDrawing, setPath]);

    return (
        <canvas
            style={{ width, height, border: '1px solid red', position: 'absolute' }}
            width={canvasWidth}
            height={canvasHeight}
            ref={ref}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        />
    );
};

export default DrawableMap;
