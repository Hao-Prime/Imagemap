import React, { useState, useEffect } from "react";
import "./Modal.css"
const SaveModal = ({ idSave, setDisplay, progresspercent }) => {
    const [copied, setCopied] = useState(false);
    return (
        <div className="modal modal-save" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgb(217 217 217 / 70%)" }}>
            <div className="modal-dialog modal-md" style={{ maxWidth: "700px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">SAVE SUCCESSFULLY</h5>
                        <button type="button" className="btn-close" data-dismiss="modal" onClick={(e) => { setDisplay(false) }}>×</button>
                    </div>
                    <div className="modal-body">
                        <div style={{ margin: "0px 27px 16px 27px" }}>
                            <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                        </div>
                        {(progresspercent == 100 && idSave != null) &&
                            <>

                                <div className="input-group mb-3 ps-4 pe-4">
                                    <p className="p-save">Link edit: </p>
                                    <input disabled type="text" value={window.location.origin + "/?id=" + idSave} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" />
                                    <button className="btn btn-success" type="button" id="button-addon2" onClick={(e) => { navigator.clipboard.writeText(window.location.origin + "/?id=" + idSave); setCopied(true) }}>COPY</button>

                                </div>
                                <div className="input-group mb-3 ps-4 pe-4">
                                    <p className="p-save" >Link share: </p>
                                    <input disabled type="text" value={window.location.origin + "/share?id=" + idSave} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" />
                                    <button className="btn btn-success" type="button" id="button-addon2" onClick={(e) => { navigator.clipboard.writeText(window.location.origin + "/share?id=" + idSave); setCopied(true) }}>COPY</button>

                                </div>
                            </>
                        }

                        {copied && <p style={{ color: "green", marginLeft: "30px" }}><i>Copied</i></p>}


                    </div>



                </div>
            </div>
        </div>
    );
};

export default SaveModal;