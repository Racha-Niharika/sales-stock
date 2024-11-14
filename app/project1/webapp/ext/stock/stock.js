sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageToast"
], function (Dialog, Button, Text, MessageToast) {
    "use strict";

    return {
        stock: async function(aSelectedContexts) {
            // Debugging: Log aSelectedContexts to check its value
            console.log("aSelectedContexts: ", aSelectedContexts);

            // Check if aSelectedContexts is valid and has at least one element
            

            const oDialog = new Dialog({
                title: "Confirmation",
                content: new Text({ text: "Are you sure you want to proceed?" }),
                buttons: [
                    new Button({
                        text: "Confirm",
                        press: (function() {
                            externalfunction();
                            // let mParameters = {
                            //     contexts: aSelectedContexts[0],  // Access the first element safely
                            //     label: 'Confirm',
                            //     invocationGrouping: true    
                            // };

                            // Ensure editFlow is defined and invoke the action
                            // if (this.editFlow) {
                            //     this.editFlow.invokeAction("salessrv.stock", mParameters)
                            //         .then(() => {
                            //             MessageToast.show("Confirmed!");
                            //             oDialog.close();
                            //         })
                            //         .catch((error) => {
                            //             MessageToast.show("Error occurred while invoking action");
                            //             console.error("Error:", error);
                            //         });
                            // } else {
                            //     console.error("editFlow is not defined");
                            //     MessageToast.show("Internal error occurred");
                            // }
                        }).bind(this)  // Bind `this` to ensure context
                    }),
                    new Button({
                        text: "Cancel",
                        press: function() {
                            oDialog.close();
                        }
                    })
                ],
                afterClose: function() {
                    oDialog.destroy();
                }
            });
            console.log(aSelectedContexts);

            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };

            this.editFlow.invokeAction('salessrv.stock', mParameters)
            // Open the dialog
            oDialog.open();
        }
    };
});
