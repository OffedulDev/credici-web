class ViewSDKClient {
    constructor(id) {
        this.readyPromise = new Promise((resolve) => {
            if (window.AdobeDC) {
                resolve();
            } else {
                document.addEventListener("adobe_dc_view_sdk.ready", () => {
                    resolve();
                });
            }
        });
        this.id = id
        this.adobeDCView = undefined;
    }
    ready() {
        return this.readyPromise;
    }
    previewFile(divId, viewerConfig, url) {
        const config = {
            clientId: this.id //Enter your Client ID here
    };
        if (divId) {
            config.divId = divId;
        }
        this.adobeDCView = new window.AdobeDC.View(config);
        const previewFilePromise = this.adobeDCView.previewFile(
            {
                content: {
                    location: {
                        url: url
                    }
                },
                metaData: {
                    fileName: "Documento.pdf",
                    id: "6d07d124-ac85–43b3-a867–36930f502ac6"
                }
    },
        viewerConfig
    );
        return previewFilePromise;
    }
    previewFileUsingFilePromise(divId, filePromise, fileName) {
        this.adobeDCView = new window.AdobeDC.View({
            clientId: this.id, //Enter your Client ID here
        divId
    });
        this.adobeDCView.previewFile(
            {
                content: {
                    promise: filePromise
                },
                metaData: {
                    fileName: fileName
                }
            }
        );
    }
    registerSaveApiHandler() {
        const saveApiHandler = (metaData, content, options) => {
            console.log(metaData, content, options);
            return new Promise((resolve) => {
                setTimeout(() => {
                    const response = {
                        code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                        data: {
                            metaData: Object.assign(metaData, {
                                updatedAt: new Date().getTime()
                            })
                        }
                    };
                    resolve(response);
                }, 2000);
            });
        };
        this.adobeDCView.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.SAVE_API,
            saveApiHandler,
            {}
        );
    }
    registerEventsHandler() {
        this.adobeDCView.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            (event) => {
                console.log(event);
            },
            {
                enablePDFAnalytics: true
            }
        );
    }
}
export default ViewSDKClient;