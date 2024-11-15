const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { SalesOrder } = this.entities;
    const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
    const materialdocapi = await cds.connect.to('API_MATERIAL_DOCUMENT_SRV_0001');
    const materialapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');
let extsaleorder;
let payloaddata;
    // SalesOrder Read Handler
    this.on('READ', 'SalesOrder', async req => {
        req.query.SELECT.columns = [
            { ref: ['SalesOrder'] },
            { ref: ['PurchaseOrderByCustomer'] },
            {ref:['SoldToParty']},
            { ref: ['to_Item'], expand: ['*'] }
        ];

        try {
            // Fetching sales orders
            let res = await salesorderapi.run(req.query);

            // Check if res is an array, if not, wrap it in an array
            if (!Array.isArray(res)) {
                res = [res];
            }

            // Process each sales order item
            res.forEach(element => {
                if (element.to_Item) {
                    const item = element.to_Item.find(item => item.SalesOrder === element.SalesOrder);
                    if (item) {
                        element.SalesOrderItem = item.SalesOrderItem;
                        element.Material = item.Material;
                        element.RequestedQuantityUnit=item.RequestedQuantityUnit;
                        element.RequestedQuantity=item.RequestedQuantity;

                    }
                }
            });
//console.log(res);
            return res;
        } catch (error) {
            console.error('Error reading SalesOrder:', error);
            return req.error(500, 'Failed to fetch data from SalesOrder service');
        }
    });

    // Material Detail Read Handler
    this.on('READ', 'MaterialDetail', async req => {
        req.query.SELECT.columns = [
            { ref: ['Material'] },
            { ref: ['Plant'] },
            { ref: ['StorageLocation'] },
            { ref: ['Batch'] },
            { ref: ['MatlWrhsStkQtyInMatlBaseUnit'] }
        ];

        try {
            let res = await materialapi.run(req.query);

            // Check if res is an array, if not, wrap it in an array
            if (!Array.isArray(res)) {
                res = [res];
            }

            return res;
        } catch (error) {
            console.error('Error reading MaterialDetail:', error);
            return req.error(500, 'Failed to fetch data from MaterialDetail service');
        }
    });

    this.on('material', async (req) => {
        try {
            console.log("Received data:", req.data);
            const payloaddata = req.data;
    
            // Ensure req.data is treated as an array
            const dataArray = Array.isArray(req.data) ? req.data : [req.data];
    
            // Extract unique 'material' and 'SDDocument' values
            const matrl = [...new Set(dataArray.map(item => item.material))];
            const SDDocument = [...new Set(dataArray.map(item => item.SDDocument))];
            console.log('Materials:', matrl);
    
            // Assume extsaleorder is an array and we need the first element for merging
            const mergedData = { ...payloaddata, ...extsaleorder[0] };
            console.log('Merged data:', mergedData);
    
            const material = mergedData.material;
            console.log('Material:', material);
            const requestedQuantity = mergedData.RequestedQuantity; // Extract RequestedQuantity
            const externalSalesOrder = extsaleorder[0].SalesOrder;
            console.log('External SalesOrder:', externalSalesOrder);
    
            const materialdocqty = await materialdocapi.run(
                SELECT.from('A_MaterialDocumentHeader').columns([
                    'DocumentDate',
                    'PostingDate',
                    'GoodsMovementCode',
                    {
                        ref: ['to_MaterialDocumentItem'],
                        expand: ['*']
                    }
                ]).where({ DocumentDate: '2024-11-14', PostingDate: '2024-11-14' })
            );
    
            const materialDocsArray = Array.isArray(materialdocqty) ? materialdocqty : [materialdocqty];
    
            // Using a Map for unique matching (keyed by composite of matching fields)
            const filteredMaterialDocs = new Map();
    
            materialDocsArray.forEach(element => {
                if (element.to_MaterialDocumentItem) {
                    const item = element.to_MaterialDocumentItem.find(
                        item => item.SalesOrder === mergedData.SalesOrder
                    );
    
                    // If an item with matching SalesOrder is found, map its properties
                    if (item) {
                        const uniqueKey = `${item.SalesOrder}-${item.SalesOrderItem}-${item.Material}-${item.Plant}-${item.SpecialStockIdfgSalesOrder}`;
    
                        // Add to the Map if unique
                        if (!filteredMaterialDocs.has(uniqueKey)) {
                            filteredMaterialDocs.set(uniqueKey, {
                                ...element,
                                SalesOrder: item.SalesOrder,
                                SalesOrderItem: item.SalesOrderItem,
                                Material: item.Material,
                                Plant: item.Plant,
                                SpecialStockIdfgSalesOrder: item.SpecialStockIdfgSalesOrder,
                                QuantityInEntryUnit: item.QuantityInEntryUnit,
                            });
                        }
                    }
                }
            });

    
            console.log('Filtered unique material docs:', Array.from(filteredMaterialDocs.values()));
    
            // Start a transaction to update the database
            const tx = cds.transaction(req);
    
            // Loop through filteredMaterialDocs and update QuantityInEntryUnit
            for (const doc of filteredMaterialDocs.values()) {
                if (
                    doc.Material === mergedData.material &&
                    doc.Plant === mergedData.Plant &&
                    doc.SpecialStockIdfgSalesOrder === mergedData.SDDocument &&
                    doc.SalesOrder === mergedData.SalesOrder &&
                    doc.SalesOrderItem === mergedData.SalesOrderItem
                ) {
                    console.log(`Updating QuantityInEntryUnit for SalesOrder ${doc.SalesOrder}`);
    
                    // Calculate the new QuantityInEntryUnit by subtracting the requested quantity
                    const newQuantity = doc.QuantityInEntryUnit - requestedQuantity;
                    console.log(`Decreasing QuantityInEntryUnit by ${requestedQuantity}, New Value: ${newQuantity}`);
    
                    // Prepare the data for updating the document's QuantityInEntryUnit
                    await tx.run(
                        UPDATE('A_MaterialDocumentHeader')
                            .set({
                                QuantityInEntryUnit: newQuantity // Set the decreased quantity
                            })
                            .where({
                                Material: doc.Material,
                                Plant: doc.Plant,
                                SpecialStockIdfgSalesOrder: doc.SpecialStockIdfgSalesOrder,
                                SalesOrder: doc.SalesOrder,
                                SalesOrderItem: doc.SalesOrderItem
                            }) // Ensure the update is for the correct matching fields
                    );
    
                    console.log('Updated QuantityInEntryUnit for SalesOrder ${doc.SalesOrder}: ${newQuantity}');
                }
                //console.log('doc:',doc);
            }
            
    
            await tx.commit(); // Commit the transaction
            
    
        } catch (error) {
            console.error("Error during material update operation:", error);
            req.error(500, 'Error during data fetch and upsert operation');
        }
    });
    
    
    // Register the StatusReporter handler
    

    // Custom label handler for SalesOrder

    this.on('label', 'SalesOrder', async req => {
        try {
            const salesOrderId = req.params[0].SalesOrder;
            console.log('params:', req.params);
            extsaleorder=req.params;
            //console.log('filtered:',filteredMaterialDetails);
            // Fetch SalesOrder items to get unique materials
            const salesOrderItems = await salesorderapi.run(
                SELECT.from('A_SalesOrderItem')
                    .columns(['SalesOrder', 'Material'])
                    .where({ SalesOrder: salesOrderId })
            );
//console.log('soi:',salesOrderItems);
            if (!salesOrderItems || salesOrderItems.length === 0) {
                console.log('No items found for SalesOrder');
                return [];
            }

            // Extract unique materials
            const materials = [...new Set(salesOrderItems.map(item => item.Material))];
            console.log('Materials:', materials);

            // Fetch material details only if materials list is non-empty
            let materialDetails = [];
            if (materials.length > 0) {
                materialDetails = await materialapi.run(
                    SELECT.from('A_MatlStkInAcctMod')
                        .columns(['Material', 'Plant', 'Batch', 'StorageLocation', 'MatlWrhsStkQtyInMatlBaseUnit', 'SDDocument', 'SDDocumentItem', 'MaterialBaseUnit'])
                        .where({ Material: { in: materials } })
                );
            }

            // Filter materialDetails based on SoldToParty for corresponding SDDocument
            const filteredMaterialDetails = [];
            for (const detail of materialDetails) {
                const saleOrder = detail.SDDocument;

                // Fetch SoldToParty for each SDDocument (Sales Order)
                const orderDetails = await salesorderapi.run(
                    SELECT.from('A_SalesOrder')
                        .columns(['SoldToParty'])
                        .where({ SalesOrder: saleOrder })
                );

                // Include detail if SoldToParty is 1000003 and quantity is non-zero
                if (orderDetails.length > 0 && orderDetails[0].SoldToParty === '1000003' && detail.MatlWrhsStkQtyInMatlBaseUnit > 0) {
                    filteredMaterialDetails.push(detail);
                }
            }

            //console.log('Filtered Material Details:', filteredMaterialDetails);
            return filteredMaterialDetails;

        } catch (error) {
            console.error('Error in SalesOrder label handler:', error);
            return req.error(500, 'Failed to fetch data for SalesOrder label');
        }
    });
    
});

