import React, { useState, useEffect } from "react";
import "./Modal.css"
const ExportModal = ({ maps,setDisplay}) => {
    const [exportMap, setExportMap] = useState("");
    useEffect(() => {
        let rs="<!-- Image Map Generated by http://www.image-map.net/ -->\n<img src='x.png' usemap='#image-map'>\n\n <map name='image-map'>"

        
        maps.forEach(map => {
            let e='\t<area target="'+map.target+'" alt="'+map.title+'" title="'+map.title+'" coords="'+map.flattenedPoints+'" shape="poly">'
            // <area target="_parent" alt="xxx" title="xxx" href="x" coords="542,976,477,1023,528,1120,786,1123,1045,1065,1078,976,1010,876,900,874" shape="poly">
            rs=rs+"\n"+e
        });
        rs=rs+"\n</map>"
        setExportMap(rs)
    }, []);
    return (
        <div className="modal" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{display: "block",backgroundColor:"rgb(217 217 217 / 70%)"}}>
            <div className="modal-dialog modal-md" style={{maxWidth:"1050px"}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Generated Image Map Output</h5>
                        <button type="button" className="btn-close" data-dismiss="modal" onClick={(e) => { setDisplay(false) }}>×</button>

                    </div>
                    <div className="modal-body">
                        
                        
                            <div className="row col-12 col-lg-12" >

                                <textarea value={exportMap} className="form-control form-control-lg"  rows="10" style={{height:"500px",width:"1500px",overflow:"scroll"}}></textarea>
                         
                            </div>

                       
                            {/* <!-- Image Map Generated by http://www.image-map.net/ -->
                            <img src="x.png" usemap="#image-map">

                            <map name="image-map">
                                <area target="_parent" alt="xxx" title="xxx" href="x" coords="542,976,477,1023,528,1120,786,1123,1045,1065,1078,976,1010,876,900,874" shape="poly">
                            </map> */}

                    </div>
                    <div className="modal-footer">                       
                        <button type="button" className="btn btn-light" data-dismiss="modal" onClick={(e) => { setDisplay(false) }}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;