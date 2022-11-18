import React, { useMemo, useRef, useState, useEffect } from "react";
import PolygonAnnotation from "components/PolygonAnnotation";
import { Stage, Layer, Image } from "react-konva";
import Button from "components/Button";
import ExportModal from "components/ExportModal";
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
    const [maps, setMaps] = useState([{ _id: (new Date()).getTime()+"", points: [], flattenedPoints: [], isFinished: false, edit: true ,link:"",target:"",title:""}]);
    const [size, setSize] = useState({});
    const [flattenedPoints, setFlattenedPoints] = useState();
    const [position, setPosition] = useState([0, 0]);
    const [isMouseOverPoint, setMouseOverPoint] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    // const [isFinished, setPolyComplete] = useState(false);
    const videoElement = useMemo(() => {
        const element = new window.Image();
        // element.width = 650;
        // element.height = 302;
        element.src = videoSource;
        return element;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoSource]); //it may come from redux so it may be dependency that's why I left it as dependecny...
    useEffect(() => {
        console.log();
        setSize({
            width: videoElement.width,
            height: videoElement.height,
        });
        setImage(videoElement);
        imageRef.current = videoElement;

        setState({
            stageScale: 1200 / videoElement.width,
            stageX: 0,
            stageY: 0,
            height: videoElement.height * 1200 / videoElement.width,
        })


    }, [videoElement]);
    const getMousePos = (stage) => {
        return [Math.round(Number((stage.getPointerPosition().x - state.stageX) / state.stageScale)), Math.round(Number((stage.getPointerPosition().y - state.stageY) / state.stageScale))];
    };
    //drawing begins when mousedown event fires.
    const handleMouseDown = (e) => {

        const stage = e.target.getStage();
        const mousePos = getMousePos(stage);
        let imap
        maps.forEach(map => {
            if (!map.isFinished) {
                imap = map
            } else return
        });


        if (imap == undefined || isMouseOverPoint) {
            return
        }
        console.log("1");
        if (imap.isFinished) return;
        if (isMouseOverPoint && imap.points.length >= 3) {
            let rs = []
            maps.forEach(map => {
                if (map?._id == imap?._id) {
                    rs.push({
                        ...imap,
                        isFinished: true
                    })
                } else {
                    rs.push(map)
                }
            });
            setMaps(rs);
        } else {
            let rs = []
            maps.forEach(map => {
                if (map?._id == imap?._id) {
                   
                    let p = [...imap.points, mousePos]
                    rs.push({
                        ...imap,
                        points: p,
                        flattenedPoints: p.concat(imap.isFinished ? [] : position).reduce((a, b) => a.concat(b), [])
                    })
                } else {
                    rs.push(map)
                }
            });

            setMaps(rs);

        }
    };
    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const mousePos = getMousePos(stage);
        setPosition(mousePos);
    };



    const undo = () => {
        // setPoints(points.slice(0, -1));
        // setPolyComplete(false);
        // setPosition(points[points.length - 1]);
    };
    const addMap = () => {
        let rs = []
        maps.forEach(map => {
            rs.push({ ...map, isFinished: true, edit: false })
        });
        setMaps([...rs, { _id: (new Date()).getTime()+"", points: [], flattenedPoints: [], isFinished: false, edit: true ,link:"",target:"",title:""}])
    };
    const edit = (_id) => {

        let rs = []
        let item
        maps.forEach(map => {
            if (_id == map._id) {
                item = { ...map, isFinished: false, edit: true }
            } else rs.push({ ...map, isFinished: true, edit: false })
        });
        rs.push(item)
        setMaps(rs)
    };
    const deleteMap = (_id) => {
        let rs = []
        maps.forEach(map => {
            if (_id != map._id) {
                rs.push({ ...map, isFinished: true, edit: false })
            }  
        });
        setMaps(rs)
    };
    const reset = () => {
        setMaps([{ _id: "1111", points: [], flattenedPoints: [], isFinished: false, edit: true }]);
        // setPolyComplete(false);
    };
    const exportMap = () => {
        setDisplayModal(true)
    };
    const [state, setState] = useState({
        stageScale: 0.6,
        stageX: 0,
        stageY: 0,
        height: 500
    });
    function sortMaps() {
        let list =[...maps]
        list.sort((a, b) => a._id- b._id);
        return list.reverse()
    }
    //zoom
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
        if (newScale > (1200 / videoElement.width)) {
            setState({
                stageScale: newScale,
                stageX: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
                stageY: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
                height: state.height,
            });
        } else {
            setState({
                stageScale: 1200 / videoElement.width,
                stageX: 0,
                stageY: 0,
                height: state.height,
            });
        }

    };
    function onChange(e,id,arr) {
        let rs=[]
        maps.forEach(map => {
            if(map._id==id){
                let newMap=map;
                if(arr=="link"){
                    newMap.link=e.target.value
                }else if(arr=="title"){
                    newMap.title=e.target.value
                }else if(arr=="target"){
                    if(e.target.value!="null"){
                        newMap.target=e.target.value
                    }
                   
                }
                rs.push(newMap)
            }else {
                rs.push(map)
            }
        });
        setMaps(rs);
        // console.log(e.target.value);
    }


    return (

        <div>
            {displayModal && <ExportModal maps={maps} setDisplay={setDisplayModal} />}
            <div style={wrapperStyle}>
                <div style={columnStyle}>
                    <Stage
                        width={1200}
                        height={state.height}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseDown}
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
                            {maps.map((imap, index) =>
                                <PolygonAnnotation
                                    position={position}
                                    key={imap._id}
                                    points={imap.points}
                                    imap={imap}
                                    indexMap={index}
                                    state={state}
                                    listMap={maps}

                                    setMaps={setMaps}
                                    setMouseOverPoint={setMouseOverPoint}
                                    flattenedPoints={imap.flattenedPoints}
                                    isFinished={imap.isFinished}
                                    edit={imap.edit}
                                />)}
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
                {/* <Button name="Undo" onClick={undo} /> */}
                <Button name="Add" onClick={addMap} />
                <Button name="Export" onClick={exportMap} />
                &emsp;|&emsp;
                <Button name="RESET" onClick={reset} />
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
                        marginBottom: 10,
                        border: "1px solid gray",
                        overflowY:"scroll",
                        maxHeight:300
                    }}
                >
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Active</th>
                                <th>Shape</th>
                                <th>Link</th>
                                <th>Title</th>
                                <th>Target</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortMaps().map((imap, index) =>
                                <tr key={imap._id}>
                                    <td> <button className={!imap.isFinished?"btn btn-primary":"btn btn-outline-primary"} onClick={(e) => edit(imap._id)} >{index + 1}</button></td>
                                    <td>
                                        <select className="form-select"defaultValue={"poly"} aria-label="Default select example">
                                            {/* <option selected value="">...</option> */}
                                            <option  value="poly">Poly</option>
                                            {/* <option value="2">Two</option>
                                            <option value="3">Three</option> */}
                                        </select>
                                    </td>
                                    <td> <input type="text" className="form-control" onChange={(e)=>{onChange(e,imap._id,"link")}}/></td>
                                    <td> <input type="text" className="form-control"  onChange={(e)=>{onChange(e,imap._id,"title")}}/></td>
                                    <td> 
                                        <select className="form-select" defaultValue={"null"} aria-label="Default select example" onChange={(e)=>{onChange(e,imap._id,"target")}}>
                                            <option value="null">...</option>
                                            <option value="_blank">_blank</option>
                                            <option value="_parent">_parent</option>
                                            <option value="_seft">_seft</option>
                                            <option value="_top">_top</option>
                                        </select>
                                        </td>
                                        <td> 
                                        <button className="btn btn-outline-danger" onClick={(e) => deleteMap(imap._id)} >✖</button>
                                        </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div >

                    </div>

                    {/* <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(position)}</pre>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(maps)
                        // .replaceAll('[',"").replaceAll("]","")
                    }</pre> */}
                </div>
            </div>
        </div>
    );
};

export default Canvas;
