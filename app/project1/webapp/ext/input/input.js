sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/ColumnListItem",
    "sap/m/CheckBox"
], function (MessageToast, JSONModel, Dialog, Button, Table, Column, Text, Label, ColumnListItem, CheckBox) {
    'use strict';

    return {
        input: async function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);

            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };

            this.editFlow.invokeAction('salessrv.label', mParameters)
                .then(function(result) {
                    console.log("res", result.getObject().value);
                    let stockInfo = result.getObject() ? result.getObject().value : [];

                    if (!Array.isArray(stockInfo)) {
                        stockInfo = [];
                    }

                    let oModel = new JSONModel();
                    oModel.setData({ stockInfo: stockInfo });

                    // Create the Table control
                    let oTable = new Table({
                        columns: [
                            new Column({
                                header: new Label({ text: "Select" }),
                                template: new CheckBox({
                                    selected: "{selected}" // Bind to a selected property for checkbox
                                })
                            }),
                            new Column({
                                header: new Label({ text: "Material" }),
                                template: new Text({ text: "{Material}" })
                            }),
                            new Column({
                                header: new Label({ text: "Plant" }),
                                template: new Text({ text: "{Plant}" })
                            }),
                            new Column({
                                header: new Label({ text: "Storage Location" }),
                                template: new Text({ text: "{StorageLocation}" })
                            }),
                            new Column({
                                header: new Label({ text: "Stock Quantity" }),
                                template: new Text({ text: "{MatlWrhsStkQtyInMatlBaseUnit}" })
                            })
                        ]
                    });

                    oTable.setModel(oModel);
                    oTable.bindItems("/stockInfo", new ColumnListItem({
                        cells: [
                            new CheckBox({
                                selected: "{selected}"
                            }),
                            new Text({ text: "{Material}" }),
                            new Text({ text: "{Plant}" }),
                            new Text({ text: "{StorageLocation}" }),
                            new Text({ text: "{MatlWrhsStkQtyInMatlBaseUnit}" })
                        ]
                    }));

                    // Create the Dialog
                    let oDialog = new Dialog({
                        title: 'Material Stock',
                        contentWidth: "600px",
                        contentHeight: "400px",
                        verticalScrolling: true,
                        content: oTable,
                        buttons: [
                            new Button({
                                text: 'Proceed',
                                press: function () {
                                    let aSelectedItems = [];
                                    let aItems = oTable.getItems();

                                    // Collect the selected items
                                    aItems.forEach(function(oItem) {
                                        let oCheckBox = oItem.getCells()[0]; // The checkbox is the first cell
                                        if (oCheckBox.getSelected()) {
                                            let oContext = oItem.getBindingContext();
                                            aSelectedItems.push(oContext.getObject()); // Collect the selected row data
                                        }
                                    });

                                    if (aSelectedItems.length > 0) {
                                        // Proceed to next screen with selected data
                                        console.log("Selected items:", aSelectedItems);
                                        // Here, you can navigate to the next screen or perform any other action.
                                    } else {
                                        MessageToast.show("Please select at least one item.");
                                    }

                                    oDialog.close();
                                }
                            }),
                            new Button({
                                text: 'Close',
                                press: function () {
                                    oDialog.close();
                                }
                            })
                        ],
                        afterClose: function() {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                })
                .catch(function(error) {
                    MessageToast.show('Error occurred while fetching data');
                    console.error("Error:", error);
                });
        }
    };
});
/*sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/ui/core/HTML"
], function (MessageToast, JSONModel, Dialog, Button, HTML) {
    'use strict';

    return {
        input : async function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);
                
            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };

            this.editFlow.invokeAction('salessrv.label', mParameters)
                .then(function(result) {
                    let base64PDF = result.getObject().value;  
                    const byteCharacters = atob(base64PDF);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const pdfUrl = URL.createObjectURL(blob);
                    const oHtml = new HTML({
                        content: `<iframe src="${pdfUrl}" width="100%" height="500px"></iframe>`
                    });
                    let oDialog = new Dialog({
                        title: 'Generated PDF',
                        contentWidth: "600px",
                        contentHeight: "500px",
                        verticalScrolling: true,
                        content: oHtml,
                        buttons: [
                            new Button({
                                text: 'Download',
                                press: function () {
                                    const link = document.createElement('a');
                                    link.href = pdfUrl;
                                    link.download = 'generated_pdf.pdf'; 
                                    link.click();  
                                }
                            }),
                            new Button({
                                text: 'Close',
                                press: function () {
                                    oDialog.close();
                                }
                            })
                        ],
                        afterClose: function() {
                            oDialog.destroy();
                        }
                    });
                    oDialog.open();
                })
                .catch(function(error) {
                    MessageToast.show('Error occurred while converting to XML');
                    console.error("Error:", error);
                });
        }
    };
});
*/
/*sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Input",
    "sap/ui/layout/VerticalLayout"
], function (MessageToast, Dialog, Button, Text, Label, Input, VerticalLayout) {
    'use strict';

    return {
        input: function (oEvent) {
            MessageToast.show("Custom handler invoked.");

            // Create a new dialog if it doesn't exist
            if (!this._oDialog) {
                // Define the layout with input fields for Sales Order and Sales Order Item
                var oDialogContent = new VerticalLayout({
                    content: [
                        new Label({ text: "Sales Order" }),
                        new Input({ placeholder: "Enter Sales Order" }),
                        new Label({ text: "Sales Order Item" }),
                        new Input({ placeholder: "Enter Sales Order Item" })
                    ]
                });

                this._oDialog = new Dialog({
                    title: "Sales Order Entry",
                    content: oDialogContent,
                    beginButton: new Button({
                        text: "Submit",
                        press: function () {
                            // Fetch the entered values
                            var aInputs = oDialogContent.getContent();
                            var sSalesOrder = aInputs[1].getValue();
                            var sSalesOrderItem = aInputs[3].getValue();

                            // Perform actions with the input data, if needed
                            MessageToast.show("Sales Order: " + sSalesOrder + ", Item: " + sSalesOrderItem);

                            // Close dialog
                            this._oDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Close",
                        press: function () {
                            this._oDialog.close();
                        }.bind(this)
                    })
                });

                // Destroy the dialog after it’s closed
                this._oDialog.attachAfterClose(function () {
                    this._oDialog.destroy();
                    this._oDialog = null;
                }.bind(this));
            }

            // Open the dialog
            this._oDialog.open();
        }
    };
});
*/