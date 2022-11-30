import React, { useState, useEffect } from "react";
import "./Modal.css"
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState ,convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
const EditTitleModal = ({ map, setDisplay ,onChange}) => {

 
    const [ title, setTitle] = useState(textToEdit(map.title));
    function onChangeEditInput(e,att){
        if(att=="title"){
            setTitle(e);
        }
    }
    function save() {
        onChange(draftToHtml(convertToRaw(title.getCurrentContent())),map._id,"title")
    }
    function textToEdit(text){
        if(text!==null&&text!=undefined){
            // const blocksFromHTML = convertFromHTML(text);
            // console.log(blocksFromHTML);
            const state = ContentState.createFromBlockArray(htmlToDraft(text));
            return EditorState.createWithContent(state);
        }
        
    }
    return (
        <div className="modal modal-save" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgb(217 217 217 / 70%)" }}>
            <div className="modal-dialog modal-md" style={{ maxWidth: "1200px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">EDIT TITLE</h5>
                        <button type="button" className="btn-close" data-dismiss="modal" onClick={(e) => { setDisplay(false) }}>×</button>
                    </div>
                    <div className="modal-body">
                        
                        <Editor
                            editorState={title}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                          
                            onEditorStateChange={(e) => { onChangeEditInput(e, "title") }}
                        />
                    </div>


                    <div className="modal-footer">
                        <button type="button" style={{ width: "70px" }} className="btn btn-primary" data-dismiss="modal" onClick={(e) => { save();setDisplay(false) }}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTitleModal;