import React, { useMemo, useRef, useState, useEffect } from "react";
import PolygonAnnotation from "components/PolygonAnnotation";
import { useLocation } from 'react-router-dom';
import { Stage, Layer, Image } from "react-konva";
import { collection, addDoc, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import ExportModal from "components/ExportModal";
import ReviewModal from "components/ReviewModal";
import SaveModal from "components/SaveModal";
import { async } from "@firebase/util";

var videoSource = window.location.href + "default.jpg";

const Canvas = () => {

    const imageRef = useRef(null);
    const dataRef = useRef(null);
    const [maps, setMaps] = useState([{ _id: (new Date()).getTime() + "", points: [], flattenedPoints: [], isFinished: false, edit: true, link: "", color: "#8c1eff", target: "", title: "" }]);
    const [history, setHistory] = useState([maps]);
    const [size, setSize] = useState({});
    const [colorDefault, setColorDefault] = useState("#8c1eff");
    const [changePoint, setChangePoint] = useState(true);
    const [pointDelete, setPointDelete] = useState(null);
    const [position, setPosition] = useState([0, 0]);
    const [isMouseOverPoint, setMouseOverPoint] = useState(false);
    const [displayModalExport, setDisplayModalExport] = useState(false);
    const [displayModalReview, setDisplayModalReview] = useState(false);
    const [displayModalSave, setDisplayModalSave] = useState(false);
    const [picture, setPicture] = useState("");
    const location = useLocation();
    const [idSave, setIDSave] = useState(new URLSearchParams(location.search).get("id"));
    const [videoElement, setVideoElement] = useState();
    // const [isFinished, setPolyComplete] = useState(false);
    const [imgUrl, setImgUrl] = useState(null);
    const [fileImage, setFileImage] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    useEffect(() => {
        const element = new window.Image();
        if (picture != "") {
            element.src = picture;
            setChangePoint(false)
        } else {
            element.src = ""
            setChangePoint(true)
        }
        element.onload = () => {
            setVideoElement(element)

        };

        // console.log(imageRef);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [picture]); //it may come from redux so it may be dependency that's why I left it as dependecny...

    useEffect(() => {
        if (videoElement != undefined) {
            setSize({
                width: videoElement.width,
                height: videoElement.height,
            });
            // imageRef.current = videoElement;
            let scale = (1 / (1000 / videoElement.width)) + 0.2
            setState({
                stageScale: 1000 / videoElement.width,
                stageX: 0,
                stageY: 0,
                height: videoElement.height * 1000 / videoElement.width,
                scale: scale > 1.5 ? 1.5 + (scale - 1.5) / 3 : scale
            })
        }


    }, [videoElement]);
    useEffect(() => {
        if (idSave != null) {
            fetchPost()
        }
    }, []);
    const fetchPost = async () => {
        await getDoc(doc(db, "maps", idSave))
            .then((querySnapshot) => {
                if (querySnapshot.data() == undefined) {
                    window.location.href = "/"
                    alert("Link not found")
                } else {
                    setPicture(querySnapshot.data().image)
                    setMaps(JSON.parse(querySnapshot.data().points))
                }
            })
    }
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

        //không tìm thấy map , đang ở nút ,chưa import hình, chưa đc chọn edit
        if (imap == undefined || isMouseOverPoint || changePoint || imap.isFinished) {
            console.log("imap:" + imap + "isMouseOverPoint:" + isMouseOverPoint + "changePoint:" + changePoint + "imap.isFinished:" + imap.isFinished);
            return
        }
        // console.log("1");

        let rs = []
        maps.forEach(map => {
            if (map?._id == imap?._id) {
                //xóa nút hay thêm nút
                let p
                let flatt
                //thêm
                if (pointDelete == null) {
                    p = [...imap.points, mousePos]
                    flatt = [...p.concat(imap.isFinished ? [] : position).reduce((a, b) => a.concat(b), [])]
                } else {
                    //xóa
                    // console.log(imap.flattenedPoints)
                    p = [...imap.points.filter(x => !(x[0] == pointDelete[0] && x[1] == pointDelete[1]))]
                    flatt = [...p.reduce((a, b) => a.concat(b), [])]
                    // console.log(flatt)
                }
                // console.log(p);
                setPointDelete(null)
                rs.push({
                    ...imap,
                    points: p,
                    flattenedPoints: flatt
                })
            } else {
                rs.push(map)
            }
        });

        setMaps(rs);


    };
    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const mousePos = getMousePos(stage);
        setPosition(mousePos);
    };

    //lịch sử
    useEffect(() => {
        if (!history.includes(maps) && !changePoint) {
            if (maps.length == 0) {
                return
            }
            if (maps[maps.length - 1].changeHistory == false) {

                maps[maps.length - 1].changeHistory = true


            } else {
                setHistory([...history, maps])
            }

        }
    }, [maps]);
    const undo = () => {
        if (history.length > 1) {
            setMaps(history[history.length - 2])
        }
        setHistory([...history.slice(0, history.length - 1)])

    };
    const addMap = () => {
        setChangePoint(false)
        let rs = []
        maps.forEach(map => {
            rs.push({ ...map, isFinished: true, edit: false })
        });
        setMaps([...rs, { _id: (new Date()).getTime() + "", points: [], flattenedPoints: [], isFinished: false, edit: true, link: "", color: colorDefault, target: "", title: "" }])
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
    const duplicateMap = (_id) => {
        let rs = []
        maps.forEach(map => {
            if (_id == map._id) {
                rs.push({ ...map, isFinished: true, edit: false })
                rs.push({ ...map, isFinished: false, edit: true , _id: (new Date()).getTime() + ""})
            }else {
                rs.push({ ...map, isFinished: true, edit: false })
            }
        });
        setMaps(rs)
        dataRef.current.scrollTop = 0
    };
    async function saveMap(urlImage) {
       
        setDisplayModalSave(true)
        try {
            if (idSave != null) {
                const docRef = await setDoc(doc(db, "maps", idSave), {
                    points: JSON.stringify(maps),
                    image: urlImage,
                });
            } else {
                const docRef = await addDoc(collection(db, "maps"), {
                    points: JSON.stringify(maps),
                    image: urlImage,
                });
                setIDSave(docRef.id);
            }
            // if(docRef.id!=undefined){
            // fetchPost()
            // }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    const saveImage = async (e) => {
        e.preventDefault();
        setDisplayModalSave(true)
        try {
            if (idSave != null) {
                setProgresspercent(100)
                saveMap(picture)
            } else {
                const storageRef = ref(storage, `files/${fileImage.name}`);
                const uploadTask = uploadBytesResumable(storageRef, fileImage);
                uploadTask.on("state _changed",
                    (snapshot) => {
                        const progress =
                            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setProgresspercent(progress);
                        console.log(progress);
                    },
                    (error) => {
                        alert(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setImgUrl(downloadURL)
                            setPicture(downloadURL)
                            saveMap(downloadURL)
                        });
                    }
                );
            }

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    const reset = () => {
        setMaps([{ _id: (new Date()).getTime() + "", points: [], flattenedPoints: [], isFinished: false, edit: true, link: "", color: colorDefault, target: "", title: "" }]);
        // setPolyComplete(false);
    };
    const newProject = () => {
        if (window.confirm("Are you sure you want to exit the current project?") == true) {
            window.location.href = "/"
        } else {

        }
    };
    const exportMap = () => {
        setDisplayModalExport(true)
    };
    const review = () => {
        setDisplayModalReview(true)
    };
    const [state, setState] = useState({
        stageScale: 0.6,
        stageX: 0,
        stageY: 0,
        height: 500
    });
    function sortMaps() {
        let list = [...maps]
        list.sort((a, b) => a._id - b._id);
        return list.reverse()
    }
    //zoom
    const handleWheel = (e) => {
        e.evt.preventDefault();
        setChangePoint(false)
        const scaleBy = 1.2;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        // console.log("===="+((1/newScale)+0.2));
        let scale = (1 / newScale) + 0.2
        if (newScale > ((1000 / videoElement?.width))) {
            setState({
                stageScale: newScale,
                stageX: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
                stageY: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
                height: state.height,
                scale: scale
            });
        } else {
            setState({
                stageScale: ((1000 / videoElement?.width)),
                stageX: 0,
                stageY: 0,
                height: state.height,
                scale: scale > 1.7 ? scale - 0.7 : scale
            });
        }

    };
    function onChange(e, id, arr) {
        let rs = []
        maps.forEach(map => {
            if (map._id == id) {
                let newMap = map;
                if (arr == "link") {
                    newMap.link = e.target.value
                } else if (arr == "title") {
                    newMap.title = e.target.value
                } else if (arr == "target") {
                    if (e.target.value != "null") {
                        newMap.target = e.target.value
                    }
                } else if (arr == "color") {
                    newMap.color = e.target.value
                    setColorDefault(e.target.value)
                    newMap.changeHistory = false
                }
                rs.push(newMap)
            } else {
                if (arr == "color") {
                    map.changeHistory = false
                }
                rs.push(map)
            }
        });

        setMaps(rs);
        // console.log(e.target.value);
    }
    function saveFile(file) {
        setFileImage(file)
        getBase64(file).then(base64 => {
            setPicture(base64);
        });
    }
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
    const fileUpload = useRef(null);

    return (
        <>

            <div className="row justify-content-md-center div-contaner" style={{ background: "url('" + window.location.origin + "/bg.png')" }}>

                {displayModalExport && <ExportModal maps={maps} setDisplay={setDisplayModalExport} />}
                {displayModalReview && <ReviewModal maps={maps} setDisplay={setDisplayModalReview} picture={picture} />}
                {displayModalSave && <SaveModal setDisplay={setDisplayModalSave} idSave={idSave} progresspercent={progresspercent}/>}
                <div className="col-12 wrapperStyle-header row justify-content-md-center">
                    <h3 className="text-anim"><b>IMAGE MAP VNPT LONG AN</b></h3>
                </div>
                {/* layer */}
                <div className="col-12 wrapperStyle-imgae mt-2">
                    <div className="columnStyle">
                        <div className={picture == "" ? " centered" : ""} >
                            {/* <div className=""></div> */}
                            {/* {videoElement.src} */}
                            {true &&
                                <Stage
                                    width={1000}
                                    height={state.height < 500 ? 500 : state.height}
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
                                            onRef={r => { imageRef.current = r.current }}
                                            image={videoElement}
                                            x={0}
                                            y={0}
                                            width={size.width}
                                            height={size.height}
                                        />
                                        {maps.map((imap, index) =>
                                            <PolygonAnnotation
                                                setPointDelete={setPointDelete}
                                                position={position}
                                                key={imap._id}
                                                points={imap.points}
                                                imap={imap}
                                                indexMap={index}
                                                state={state}
                                                listMap={maps}
                                                setChangePoint={setChangePoint}
                                                setMaps={setMaps}
                                                setMouseOverPoint={setMouseOverPoint}
                                                flattenedPoints={imap.flattenedPoints}
                                                isFinished={imap.isFinished}
                                                edit={imap.edit}
                                            />)}
                                    </Layer>
                                </Stage>
                            }

                        </div>
                    </div>


                </div>
                <div className="col-12 row justify-content-md-center div-container-2">
                    {/* button */}
                    <div className="col-12 wrapperStyle-edit row justify-content-md-center">
                        <div className="list-btn">
                            {/* <Button name="Undo" onClick={undo} /> */}
                            {picture == "" ?
                                // <input type="file" className="custom-file-input"
                                //     onChange={(e) => { saveFile(e.target.files[0]) }}
                                //     accept=".jpg, .jpeg, .png,"
                                <>
                                    <input
                                        type="file"
                                        ref={fileUpload}
                                        onChange={(e) => { saveFile(e.target.files[0]) }}
                                        accept=".jpg, .jpeg, .png,"
                                        style={{ display: "none" }}
                                    />
                                    <button className="btn-grad-import" onClick={() => fileUpload.current.click()}>Upload Picture</button>
                                </> :
                                <>
                                    <button className="btn-grad" onClick={addMap} >Add</button>
                                    <button className="btn-grad" onClick={undo} >Undo</button>
                                    <button className="btn-grad" onClick={review}>Review</button>
                                    <button className="btn-grad" onClick={exportMap}>Export</button>
                                    <button className="btn-grad-save" onClick={saveImage} >SAVE</button>
                                    &emsp;|&emsp;
                                    <button className="btn-grad-reset" onClick={reset}>RESET</button>
                                    <button className="btn-grad-reset" onClick={newProject}>NEW PROJECT</button>
                                </>}

                        </div>


                    </div>
                    {/* list */}
                    <div className="col-12 wrapperStyle-table">
                        <div
                            className="table-map"
                            ref={dataRef}

                        >
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Active</th>
                                        <th>Color</th>
                                        <th>Shape</th>
                                        <th>Link</th>
                                        <th>Title</th>
                                        <th>Target</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortMaps().map((imap, index) =>
                                        <tr key={imap._id} className={!imap.isFinished &&"tr-select"}>
                                            <td> <button className={!imap.isFinished ? "btn btn-stt btn-primary" : "btn btn-stt btn-outline-primary"} onClick={(e) => edit(imap._id)} >{maps.length - (index)}</button></td>
                                            <td> <input type="color" className="form-control form-control-color" value={imap.color} onChange={(e) => { onChange(e, imap._id, "color"); }} /></td>
                                            <td>
                                                <select className="form-control" defaultValue={"poly"} aria-label="Default select example">
                                                    {/* <option selected value="">...</option> */}
                                                    <option value="poly">Poly</option>
                                                    {/* <option value="2">Two</option>
                                            <option value="3">Three</option> */}
                                                </select>
                                            </td>
                                            <td> <input type="text" defaultValue={imap.link} placeholder="link" className="form-control" onChange={(e) => { onChange(e, imap._id, "link") }} /></td>
                                            <td> <input type="text" defaultValue={imap.title} placeholder="title" className="form-control" onChange={(e) => { onChange(e, imap._id, "title") }} /></td>
                                            <td>
                                                <select className="form-control" defaultValue={imap.target = "" ? "null" : imap.target} aria-label="Default select example" onChange={(e) => { onChange(e, imap._id, "target") }}>
                                                    <option value="null">...</option>
                                                    <option value="_blank">_blank</option>
                                                    <option value="_parent">_parent</option>
                                                    <option value="_seft">_seft</option>
                                                    <option value="_top">_top</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-info btn-img" onClick={(e) => duplicateMap(imap._id)} ><img className="img-btn" src={window.location.origin+"/icons8-duplicate-48.png"}></img></button>
                                                <button className="btn btn-outline-danger ms-2" onClick={(e) => deleteMap(imap._id)} ><b>✖</b></button>
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

                <div className="col-12 wrapperStyle-footer">
                    <p>Copyright © VNPT Long An 2022</p>
                </div>
            </div>

        </>

    );
};

export default Canvas;
