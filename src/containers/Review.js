import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { collection, addDoc, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import { Fragment } from "react/cjs/react.production.min";
import "../components/Modal.css"
const Review = () => {

    const [maps, setMaps] = useState([])
    const [picture, setPicture] = useState("");
    const location = useLocation();
    const [idSave, setIDSave] = useState(new URLSearchParams(location.search).get("id"));
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
    return (
        <>



            <div className="div-review wrapperStyle">
                {/* <div className="review" dangerouslySetInnerHTML={{ __html: exportMap }} /> */}

                {
                    picture != "" && <>
                        <HelmetProvider>
                            <Helmet><script src='./mapster.js' /></Helmet>
                        </HelmetProvider>
                        <img src={picture} useMap="#image-map"
                            className="maparea" />
                        <map name="image-map" id="image-map">
                            {
                                maps.map(map =>
                                    <Fragment key={map._id}>
                                        {map.flattenedPoints.length > 0 &&
                                            <area
                                                className="tool"
                                                target={map.target}
                                                href={map.link}
                                                data-key={'{"fillColor": "' + map.color?.replace("#", "") + '","strokeColor": "' + map.color?.replace("#", "") + '"}'}
                                                title={map.title}
                                                coords={map.flattenedPoints} 
                                                shape='poly' 
                                                />}
                                    </Fragment>

                                )
                            }
                            
                        </map>

                    </>
                }

            </div>
        </>
    );
};

export default Review;