sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/MessageToast"
], function(Dialog, Button, Table, Column, ColumnListItem, Text, MessageToast) {
    'use strict';

    return {
        input: function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);
            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };
            this.editFlow.invokeAction('salessrv.label', mParameters)
                .then(function(result) {
                    const materialDetailsArray = result.getObject().value;
                    console.log('Material Details:', materialDetailsArray);

                    let oTable = new Table({
                        width: "100%",
                        mode: sap.m.ListMode.SingleSelectLeft,
                        growing: true,
                        selectionChange: function(oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oShowMaterialButton = oDialog.getButtons()[1]; 
                            if (oSelectedItem) {
                                oShowMaterialButton.setEnabled(true);
                            } else {
                                oShowMaterialButton.setEnabled(false);
                            }
                        },
                        columns: [
                            new Column({
                                header: new Text({ text: "Material" })
                            }),
                            new Column({
                                header: new Text({ text: "Plant" })
                            }),
                            new Column({
                                header: new Text({ text: "Storage Location" })
                            }),
                            new Column({
                                header: new Text({ text: "Batch" })
                            }),
                            new Column({
                                header: new Text({ text: "Quantity" })
                            }),
                            new Column({
                                header: new Text({ text: "MaterialBaseUnit" })
                            }),
                            new Column({
                                header: new Text({ text: "SDDocument" })
                            }),
                            new Column({
                                header: new Text({ text: "SDDocumentItem" })
                            })
                        ],
                        items: materialDetailsArray.map(function(detail) {
                            return new ColumnListItem({
                                cells: [
                                    new Text({ text: detail.Material }),
                                    new Text({ text: detail.Plant }),
                                    new Text({ text: detail.StorageLocation }),
                                    new Text({ text: detail.Batch }),
                                    new Text({ text: detail.MatlWrhsStkQtyInMatlBaseUnit }),
                                    new Text({ text: detail.MaterialBaseUnit }),
                                    new Text({ text: detail.SDDocument }),
                                    new Text({ text: detail.SDDocumentItem })
                                ]
                            });
                        })
                    });

                    let oDialog = new Dialog({
                        title: 'Material Details',
                        contentWidth: "600px",
                        contentHeight: "500px",
                        verticalScrolling: true,
                        content: [oTable],
                        buttons: [
                            new Button({
                                text: 'Close',
                                press: function () {
                                    oDialog.close();
                                }
                            }),
                            new Button({
                                text: 'Show Material Number',
                                enabled: false,  
                                press: function () {
                                    var oSelectedItem = oTable.getSelectedItem();
                                    if (oSelectedItem) {
                                        
                                        var oCells = oSelectedItem.getCells();

                                        var rowData = {};
                                        rowData.material = oCells[0].getText();  
                                        rowData.plant = oCells[1].getText();    
                                        rowData.quantity = oCells[4].getText();        
                                        rowData.SDDocument = oCells[6].getText();           
                                       
                                        $.ajax({
                                            url: '/odata/v4/salessrv/material', 
                                            type: 'POST',
                                            contentType: 'application/json',
                                            data: JSON.stringify(rowData), 
                                            success: function (response) {
                                                
                                                MessageToast.show("Data successfully sent to server.");
                                            },
                                            error: function (error) {
                                              
                                                MessageToast.show("Error sending data to server.");
                                            }
                                        });
                                    } else {
                                        MessageToast.show("No material selected!");
                                    }
                                }
                            })
                            
                        ],
                        afterClose: function() {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                });
        }
    };
});