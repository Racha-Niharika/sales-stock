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
payloaddata=req.data;
            // Ensure req.data is treated as an array
            const dataArray = Array.isArray(req.data) ? req.data : [req.data];
    
            // Extract unique 'material' values from dataArray
            const matrl = [...new Set(dataArray.map(item => item.material))];
            const SDDocument = [...new Set(dataArray.map(item => item.SDDocument))];
            console.log('Materials:', matrl);
    
            // Query using the unique material values
            // const materialDoc = await materialdocapi.run(
            //     SELECT.from('A_SalesOrderItem')
            //         .columns(['SalesOrder', 'SalesOrderItem'])
            //         .where({ Material: {in :matrl},SalesOrder:{in :SDDocument}})
            // );
    
            // console.log("Retrieved material details:", materialDet);
            // Assuming extsaleorder is an array and we need the first element for merging
const mergedData = { ...payloaddata, ...extsaleorder[0] };
const material = mergedData.material;
console.log('material:',material);
const externalsaleorder = extsaleorder[0].SalesOrder;
console.log(externalsaleorder);


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
  console.log(materialdocqty);
  // Ensure materialdocqty is an array for consistent processing
  const materialDocsArray = Array.isArray(materialdocqty) ? materialdocqty : [materialdocqty];
  
  // Filter the array to only include records with SalesOrder = 969
  const filteredMaterialDocs = materialDocsArray.filter(element => {
    if (element.to_MaterialDocumentItem) {
        const item = element.to_MaterialDocumentItem.find(
            item => 
                item.SalesOrder === '969'
                //item.SpecialStockIdfgSalesOrde === '967' &&
                //item.SpecialStockIdfgSalesOrderItem === '10'
        );
  
      // If an item with SalesOrder 969 is found, map its properties
      if (item) {
        element.SalesOrder = item.SalesOrder;
        element.SalesOrderItem = item.SalesOrderItem;
        element.Material = item.Material;
        element.Plant = item.Plant;
        element.SpecialStockIdfgSalesOrder = item.SpecialStockIdfgSalesOrder;
        element.SpecialStockIdfgSalesOrderItem = item.SpecialStockIdfgSalesOrderItem;
        element.StorageLocation = item.StorageLocation;
        element.GoodsMovementType = item.GoodsMovementType;
        element.CostCenter=item.CostCenter;
        return true; // Include this element in the filtered result
      }
    }
    return false; // Exclude if no matching SalesOrder is found
  });
  
  console.log('Filtered material docs with SalesOrder = 969:', filteredMaterialDocs);
  
    

console.log("Merged Data:", JSON.stringify(mergedData, null, 2));

         
        } catch (error) {
            console.error("Error during ListReporter operation:", error);
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
console.log('soi:',salesOrderItems);
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

            console.log('Filtered Material Details:', filteredMaterialDetails);
            return filteredMaterialDetails;

        } catch (error) {
            console.error('Error in SalesOrder label handler:', error);
            return req.error(500, 'Failed to fetch data for SalesOrder label');
        }
    });
    
});

