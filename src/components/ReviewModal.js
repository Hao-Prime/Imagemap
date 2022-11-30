import React, { useState, useEffect } from "react";
import "./Modal.css"
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Fragment } from "react/cjs/react.production.min";
const ReviewModal = ({ maps, setDisplay, picture }) => {
    const [exportMap, setExportMap] = useState("");
    useEffect(() => {

        setExportMap("1")
    }, []);
    return (
        <div className="modal" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgb(217 217 217 / 70%)" }}>
            <HelmetProvider>
                <Helmet><script src='./mapster.js' /></Helmet>
            </HelmetProvider>
            <div className="modal-dialog modal-md" style={{ maxWidth: "1150px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Review Image Map</h4>

                        <button type="button" className="btn-close" data-dismiss="modal" onClick={(e) => { setDisplay(false) }}>×</button>

                    </div>
                    <div className="modal-body" >

                        <div className="div-review wrapperStyle">
                            {/* <div className="review" dangerouslySetInnerHTML={{ __html: exportMap }} /> */}


                            <img src={picture} useMap="#image-map"
                                className="maparea" />
                            <map name="image-map" id="image-map">
                                {
                                    maps.map(map =>
                                        <Fragment key={map._id}>
                                            {map.flattenedPoints.length>0&&
                                            <area 
                                                className="tool"
                                                target=""
                                                href=''
                                                data-key={'{"fillColor": "' + map.color?.replace("#", "") + '","strokeColor": "' + map.color?.replace("#", "") + '"}'}
                                                title={map.title}
                                                coords={map.flattenedPoints} shape='poly' />}
                                        </Fragment>

                                    )
                                }
                                {/* <area className="tool" target=""

                                    title='<p><b>This text is bold</b></p> <p><i>This text is italic</i></p> <p>This is<sub> subscript</sub> and <sup>superscript</sup></p>'
                                    href='' coords='2141,1663,2209,1821,2143,1848,2076,1691,2076,1691' shape='poly' />
                                <area className='tool' target=''

                                    title='<p><b>This text is bold</b></p> <p><i>This text is italic</i></p> <p>This is<sub> subscript</sub> and <sup>superscript</sup></p>'
                                    href='' coords='2140,1663,2208,1635,2277,1793,2210,1819' shape='poly' />
                                <area className='tool' target=''

                                    title='<p><b>This text is bold</b></p> <p><i>This text is italic</i></p> <p>This is<sub> subscript</sub> and <sup>superscript</sup></p>'
                                    href='' coords='2204,1633,2271,1605,2341,1763,2277,1792,2277,1792' shape='poly' />
                                <area className='tool' target=''

                                    title='<p><b>This text is bold</b></p> <p><i>This text is italic</i></p> <p>This is<sub> subscript</sub> and <sup>superscript</sup></p>'
                                    href='' coords='2271,1604,2338,1578,2405,1733,2341,1762,2341,1762' shape='poly' />
                                <area className='tool' target=''
                                    alxt='<p><b>This text is bold</b></p> <p><i>This text is italic</i></p> <p>This is<sub> subscript</sub> and <sup>superscript</sup></p>'

                                    title='<p><b>This text is bold</b></p> <p><i>This text is italic</i></p> <p>This is<sub> subscript</sub> and <sup>superscript</sup></p>'
                                    href='' coords='2336,1578,2403,1547,2470,1706,2405,1732,2405,1732' shape='poly' />
                                <area className='tool' target='' data-key='{"fillColor": "ddde97","strokeColor": "ddde97"}'

                                    title='<p><b>This text is bold</b></p> <p><i>This text is italic</i></p> <p>This is<sub> subscript</sub> and <sup>superscript</sup></p>'
                                    href='' coords='2402,1548,2469,1520,2537,1676,2471,1706,2471,1706' shape='poly' /> */}
                            </map>

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" style={{ width: "70px" }} className="btn btn-primary" data-dismiss="modal" onClick={(e) => { setDisplay(false) }}>OK</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ReviewModal;