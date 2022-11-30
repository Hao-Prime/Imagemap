import React, { useState, useEffect } from "react";
import { Line, Circle, Group } from "react-konva";
import { minMax, dragBoundFunc } from "utils";
/**
 *
 * @param {minMaxX} props
 * minMaxX[0]=>minX
 * minMaxX[1]=>maxX
 *
 */
const PolygonAnnotation = (props) => {
    const [hoverPointer, setHoverPointer] = useState(false); 
    const [minMaxX, setMinMaxX] = useState([0, 0]); //min and max in x axis
    const [minMaxY, setMinMaxY] = useState([0, 0]); //min and max in y axis
    const [flattenedPoint, setFlattenedPoint] = useState(); //min and max in x axis
    const {
        imap,
        setPointDelete,
        flattenedPoints,
        isFinished,
        points,
        position,
        state,
        setMaps,
        listMap,
        indexMap,
        edit,
        setChangePoint,
        setMouseOverPoint
    } = props;
    const vertexRadius = 6;

    const [stage, setStage] = useState();
    const handleGroupMouseOver = (e) => {
        // console.log("8");
        if (isFinished) return;
        if(!hoverPointer) {
            e.target.getStage().container().style.cursor = "move";
        }else {e.target.getStage().container().style.cursor = "grab";

        }
        setStage(e.target.getStage());
    };
    const handleGroupMouseOut = (e) => {
        // console.log("9");
        e.target.getStage().container().style.cursor = "crosshair";
    };

    const handleGroupDragStart = (e) => {
        console.log("7");
        // let arrX = points?.map((p) => p[0]);
        // let arrY = points?.map((p) => p[1]);
        // setMinMaxX(minMax(arrX));
        // setMinMaxY(minMax(arrY));
        setMouseOverPoint(true);

    };
    const groupDragBound = (pos) => {
        // console.log("8");
        // let { x, y } = pos;
        // const sw = stage.width();
        // const sh = stage.height();
        // if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
        // if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
        // if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
        // if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
        // return { x, y };
    };
    const handleMouseOverPoint = (e) => {
        console.log("3");
        if (isFinished) return;
        let scale=e.target.attrs.scaleX+0.3
        e.target.scale({ x: scale, y: scale });
        setHoverPointer(true)
        setPointDelete([e.target.attrs.x,e.target.attrs.y])
        
    };
    const handleMouseOverStartPoint = (e) => {
        // let scale=e.target.attrs.scaleX+0.3
        console.log("7.1");
        // if (!isFinished || points.length < 3) e.target.scale({ x: scale, y: scale });
        setHoverPointer(true)
        setMouseOverPoint(true);
    };
    const handleMouseOutStartPoint = (e) => {
        console.log("4");
        let scale=state.scale
        e.target.scale({ x: scale, y: scale});
        setMouseOverPoint(false);
        setHoverPointer(false)
        setPointDelete(null)
    };
    const handlePointDragMove = (e) => {
        setChangePoint(true)
        console.log("5");
        // setMouseOverPoint(true);
        const stage = e.target.getStage();
        const index = e.target.index - 1;
        // console.log(stage);
        const pos = [Math.round((e.target._lastPos.x - state.stageX) / state.stageScale),
        Math.round((e.target._lastPos.y - state.stageY) / state.stageScale)
        ];
        // if (pos[0] < 0) pos[0] = 0;
        // if (pos[1] < 0) pos[1] = 0;
        // if (pos[0] > stage.width()) pos[0] = stage.width();
        // if (pos[1] > stage.height()) pos[1] = stage.height();
        let rs = []
        listMap.forEach(map => {
            if (map._id == imap._id) {
                let p = [...imap.points.slice(0, index), pos, ...imap.points.slice(index + 1)]
                rs.push({
                    ...imap,
                    points: p,
                    flattenedPoints: p.concat(!isFinished ? [] : position).reduce((a, b) => a.concat(b), [])
                })
            } else {
                rs.push(map)
            }
        });
        setMaps(rs);
    };
    const handlePointDragEnd = (e) => {
        setChangePoint(false)
        console.log("5.1");
        // setMouseOverPoint(true);
        const stage = e.target.getStage();
        const index = e.target.index - 1;
        // console.log(stage);

        const pos = [Math.round((e.target._lastPos.x - state.stageX) / state.stageScale),
        Math.round((e.target._lastPos.y - state.stageY) / state.stageScale)
        ];
        // if (pos[0] < 0) pos[0] = 0;
        // if (pos[1] < 0) pos[1] = 0;
        // if (pos[0] > stage.width()) pos[0] = stage.width();
        // if (pos[1] > stage.height()) pos[1] = stage.height();
        let rs = []
        listMap.forEach(map => {
            if (map._id == imap._id) {
                let p = [...imap.points.slice(0, index), pos, ...imap.points.slice(index + 1)]
                rs.push({
                    ...imap,
                    points: p,
                    flattenedPoints: p.concat(!isFinished ? [] : position).reduce((a, b) => a.concat(b), [])
                })
            } else {
                rs.push(map)
            }
        });
        setMaps(rs);
    };
    // useEffect(() => {
    //     setFlattenedPoint(points.concat(isFinished ? [] : position).reduce((a, b) => a.concat(b), []))
    // }, [points]);
    const handleGroupDragEnd = (e) => {

        console.log("10");
        //drag end listens other children circles' drag end event
        //...that's, why 'name' attr is added, see in polygon annotation part
        if (e.target.name() === "polygon") {
            let result = [];
            let copyPoints = [...points];

            copyPoints.map((point) =>
                result.push([Math.round(point[0] + e.target.x()), Math.round(point[1] + e.target.y())])
            );
            e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)


            let rs = []
            listMap.forEach(map => {
                if (map._id == imap._id) {
                    rs.push({
                        ...imap, points: result, flattenedPoints: result.concat(!isFinished ? [] : position).reduce((a, b) => a.concat(b), [])
                    })
                } else {
                    rs.push(map)
                }
            });
            setMaps(rs);
            setMouseOverPoint(false);
        }
    };
    return (
        <Group
            name="polygon"
            draggable={!isFinished || edit}
            onDragStart={handleGroupDragStart}
            onDragEnd={handleGroupDragEnd}
            dragBoundFunc={groupDragBound}
            onMouseOver={handleGroupMouseOver}
            onMouseOut={handleGroupMouseOut}
        >
            <Line
                points={imap.flattenedPoints}
                stroke="#00F1FF60"
                strokeWidth={3}
                closed={true}
                fill={imap.color+"80"}
            />
            {(!isFinished || edit) && points.map((point, index) => {
                const x = point[0] - vertexRadius / 2;
                const y = point[1] - vertexRadius / 2;
                const startPointAttr =
                    index === 0
                        ? {
                            hitStrokeWidth: 12,
                            onMouseOver: !isFinished ? handleMouseOverStartPoint : handleMouseOverPoint,
                            onMouseOut: handleMouseOutStartPoint,
                        }
                        : {
                            hitStrokeWidth: 12,
                            onMouseOver: handleMouseOverPoint,
                            onMouseOut: handleMouseOutStartPoint
                        };
                return (
                    <Circle
                        key={index}
                        x={x+3}
                        y={y+3}
                        radius={vertexRadius}
                        scaleX={state.scale}
                        scaleY={state.scale}
                        fill="#FF019A90"
                        stroke="#00F1FF90"
                        strokeWidth={2}
                        draggable
                        onDragMove={handlePointDragMove}
                        onDragEnd={handlePointDragEnd}
                        dragBoundFunc={(pos) =>
                            dragBoundFunc(stage?.width(), stage?.height(), vertexRadius, pos)
                        }
                        {...startPointAttr}
                    />
                );
            })}
        </Group>
    );
};

export default PolygonAnnotation;
