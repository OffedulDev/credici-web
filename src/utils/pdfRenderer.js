import React from "react";
import ViewSDKClient from "./viewSDKClient.js";

const pdfRenderer = ({ url }) => {
    const loadPDF = () => {
        const viewSDKClient = new ViewSDKClient(
            window.location.origin.includes("localhost") ? "9b31a172a582483eb234d05100237afa" : "b6ad021ebd714923b37af540927e82b7"
        );
        viewSDKClient.ready().then(() => {
            viewSDKClient.previewFile(
                "pdf-div",
            {
                showAnnotationTools: false,
                showLeftHandPanel: false,
                showPageControls: false,
                showDownloadPDF: false,
                showPrintPDF: false,
                defaultViewMode: "FIT_PAGE"
            },
            url
        );
        });
    };
    return (
        <div
            id="pdf-div"
            className="full-window-div"
            style={{
                width: "100%",
                height: "75vh"
            }}
            onDocumentLoad={loadPDF()}
            >

        </div>
    );
};
export default pdfRenderer;