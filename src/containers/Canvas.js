import React, { useMemo, useRef, useState, useEffect } from "react";
import PolygonAnnotation from "components/PolygonAnnotation";
import { Stage, Layer, Image } from "react-konva";
import Button from "components/Button";
const videoSource = "https://wallpaper.dog/large/20471384.png";
const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    // backgroundColor: "aliceblue",
};
const columnStyle = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    // marginTop: 20,
    backgroundColor: "#e8e8e8",
};
const Canvas = () => {
    const [image, setImage] = useState();
    const imageRef = useRef(null);
    const dataRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [size, setSize] = useState({});
    const [flattenedPoints, setFlattenedPoints] = useState();
    const [position, setPosition] = useState([0, 0]);
    const [isMouseOverPoint, setMouseOverPoint] = useState(false);
    const [isPolyComplete, setPolyComplete] = useState(false);
    const videoElement = useMemo(() => {
        const element = new window.Image();
        // element.width = 650;
        // element.height = 302;
        element.src = videoSource;
        return element;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoSource]); //it may come from redux so it may be dependency that's why I left it as dependecny...
    useEffect(() => {

        setSize({
            width: videoElement.width,
            height: videoElement.height,
        });
        setImage(videoElement);
        imageRef.current = videoElement;


    }, [videoElement]);
    const getMousePos = (stage) => {
        return [(stage.getPointerPosition().x - state.stageX) / state.stageScale, (stage.getPointerPosition().y - state.stageY) / state.stageScale];
    };
    //drawing begins when mousedown event fires.
    const handleMouseDown = (e) => {
        if (isPolyComplete) return;
        const stage = e.target.getStage();
        const mousePos = getMousePos(stage);
        if (isMouseOverPoint && points.length >= 3) {
            setPolyComplete(true);
        } else {
            setPoints([...points, mousePos]);
        }
    };
    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const mousePos = getMousePos(stage);
        setPosition(mousePos);
    };
    const handleMouseOverStartPoint = (e) => {
        console.log("3");
        if (isPolyComplete || points.length < 3) return;
        e.target.scale({ x: 3, y: 3 });
        setMouseOverPoint(true);
    };
    const handleMouseOutStartPoint = (e) => {
        console.log("4");
        e.target.scale({ x: 1, y: 1 });
        setMouseOverPoint(false);
    };
    const handlePointDragMove = (e) => {
        console.log("5");
        const stage = e.target.getStage();
        const index = e.target.index - 1;
        // console.log(stage);

        const pos = [(e.target._lastPos.x - state.stageX) / state.stageScale, (e.target._lastPos.y - state.stageY) / state.stageScale];
        // if (pos[0] < 0) pos[0] = 0;
        // if (pos[1] < 0) pos[1] = 0;
        // if (pos[0] > stage.width()) pos[0] = stage.width();
        // if (pos[1] > stage.height()) pos[1] = stage.height();
        setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
    };
    useEffect(() => {
        setFlattenedPoints(
            points
                .concat(isPolyComplete ? [] : position)
                .reduce((a, b) => a.concat(b), [])
        );
    }, [points, isPolyComplete, position]);
    const handleGroupDragEnd = (e) => {
        //drag end listens other children circles' drag end event
        //...that's, why 'name' attr is added, see in polygon annotation part
        if (e.target.name() === "polygon") {
            let result = [];
            let copyPoints = [...points];

            copyPoints.map((point) =>
                result.push([point[0] + e.target.x(), point[1] + e.target.y()])
            );
            e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
            setPoints(result);
        }
    };


    const undo = () => {
        setPoints(points.slice(0, -1));
        setPolyComplete(false);
        setPosition(points[points.length - 1]);
    };
    const reset = () => {
        setPoints([]);
        setPolyComplete(false);
    };
    const [state, setState] = useState({
        stageScale: 1,
        stageX: 0,
        stageY: 0
    });
    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.2;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        setState({
            stageScale: newScale,
            stageX:
                -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            stageY:
                -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        });
    };


    return (
        <div>
            <div style={wrapperStyle}>
                <div style={columnStyle}>
                    <Stage
                        width={1200}
                        height={550}
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onWheel={handleWheel}
                        scaleX={state.stageScale}
                        scaleY={state.stageScale}
                        x={state.stageX}
                        y={state.stageY}

                    >
                        <Layer>


                            <Image
                                ref={imageRef}
                                image={image}
                                x={0}
                                y={0}
                                width={size.width}
                                height={size.height}
                            />
                            <PolygonAnnotation
                                points={points}
                                flattenedPoints={flattenedPoints}
                                handlePointDragMove={handlePointDragMove}
                                handleGroupDragEnd={handleGroupDragEnd}
                                handleMouseOverStartPoint={handleMouseOverStartPoint}
                                handleMouseOutStartPoint={handleMouseOutStartPoint}
                                isFinished={isPolyComplete}
                            />
                        </Layer>
                    </Stage>

                </div>

            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button name="Undo" onClick={undo} />
                <Button name="Reset" onClick={reset} />
            </div>
            <div

                style={{

                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    ref={dataRef}
                    style={{
                        width: 1200,
                        height: 302,
                        border:"1px solid gray"
                        
                       
                    }}
                >
                    <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(position)}</pre>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(points)
                        // .replaceAll('[',"").replaceAll("]","")
                    }</pre>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
