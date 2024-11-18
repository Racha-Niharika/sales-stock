const cds = require('@sap/cds');
const axios = require('axios');
require('dotenv').config(); 
module.exports = cds.service.impl(async function () {   
    const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
    const materialdocapi = await cds.connect.to('API_MATERIAL_DOCUMENT_SRV_0001');
    const materialapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');
let extsaleorder;
let mergedData;
    this.on('READ', 'SalesOrder', async req => {
        req.query.SELECT.columns = [{ ref: ['SalesOrder'] },{ ref: ['PurchaseOrderByCustomer'] },{ref:['SoldToParty']},{ ref: ['to_Item'], expand: ['*'] }];
        try {           
            let res = await salesorderapi.run(req.query);
            if (!Array.isArray(res)) {
                res = [res];
            }
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
this.on('READ', 'MaterialDetail', async req => {
        req.query.SELECT.columns = [{ ref: ['Material'] },{ ref: ['Plant'] },{ ref: ['StorageLocation'] },{ ref: ['Batch'] },{ ref: ['MatlWrhsStkQtyInMatlBaseUnit'] }  ];
        try {
            let res = await materialapi.run(req.query);
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
        const dataArray = Array.isArray(req.data) ? req.data : [req.data];
        const matrl = [...new Set(dataArray.map(item => item.material))];
        //const SDDocument = [...new Set(dataArray.map(item => item.SDDocument))];
        console.log('Materials:', matrl);
        mergedData = { ...payloaddata, ...extsaleorder[0] };
        console.log('Merged data:', mergedData);
        const material = mergedData.material;
        requestedQuantity = mergedData.RequestedQuantity; 
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
        const filteredMaterialDocs = new Map();
        materialDocsArray.forEach(element => {
            if (element.to_MaterialDocumentItem) {
                const item = element.to_MaterialDocumentItem.find(item => item.SalesOrder === mergedData.SalesOrder);
                if (item) {
                    const uniqueKey = `${item.SalesOrder}-${item.SalesOrderItem}-${item.Material}-${item.Plant}-${item.SpecialStockIdfgSalesOrder}`;
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
//const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: 'https://my401292-api.s4hana.cloud.sap',
    auth: {
        username: 'USER_NNRG',
        password: 'FMesUvVB}JhYD9nVbDfRoVcdEffwmVNJJScMzuzx',
    },
    headers: {
        'Content-Type': 'application/json',
    },
});
async function processMaterialDocs(filteredMaterialDocs, material) {
    try {
        console.log('Fetching CSRF Token...');
        const tokenResponse = await axiosInstance.get(
            '/sap/opu/odata/sap/API_MATERIAL_DOCUMENT_SRV/',
            {
                headers: {
                    'x-csrf-token': 'Fetch',
                },
            }
        );
        const csrfToken = tokenResponse.headers['x-csrf-token'];
        const cookies = tokenResponse.headers['set-cookie'];
        console.log('Fetched CSRF Token:', csrfToken);
        axiosInstance.defaults.headers.common['x-csrf-token'] = csrfToken;
        axiosInstance.defaults.headers.common['Cookie'] = cookies.join('; ');
    console.log('filteredMaterialDocs',filteredMaterialDocs.values());
        for (let doc of filteredMaterialDocs.values()) {
            const {Material} = doc;
            if (material === Material) {
                const postData = { 
                    "DocumentDate": "2024-11-14T00:00:00", 
                    "PostingDate": "2024-11-14T00:00:00", 
                    "GoodsMovementCode": "04", 
                    "to_MaterialDocumentItem":
                    [ { 
                    "GoodsMovementType": "413", 
                    "Material": mergedData.material, 
                    "Plant": mergedData.plant,
                    "StorageLocation": "FG01", 
                    "QuantityInEntryUnit":"1", 
                    "EntryUnit": "PC",
                    "Batch": "",
                    "InventorySpecialStockType": "E", 
                    "IssgOrRcvgMaterial": "ASLP", 
                    "IssuingOrReceivingPlant": "1001", 
                    "IssuingOrReceivingStorageLoc": "FG01",
                    "IssgOrRcvgBatch": "",
                    "IssuingOrReceivingValType": "", 
                    "SalesOrder": mergedData.SalesOrder,
                    "SalesOrderItem": mergedData.SalesOrderItem, 
                    "SpecialStockIdfgSalesOrder": mergedData.SDDocument,
                    "SpecialStockIdfgSalesOrderItem": "10",
                    "CostCenter":"10000"
                    } ] 
                    }
                console.log('Post Data:', postData);
                try {
                    console.log('Making POST request...');
                    const response = await axiosInstance.post(
                        '/sap/opu/odata/sap/API_MATERIAL_DOCUMENT_SRV/A_MaterialDocumentHeader',
                        postData
                    );

                    console.log('API Response:', response.data);
                } catch (error) {                   
                    if (error.response) {
                        console.error('Error Response Data:', error.response.data);
                    } else {
                        console.error('Error Message:', error.message);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error Fetching CSRF Token:', error.message);
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
        }
    }
}
(async () => {
    await processMaterialDocs(filteredMaterialDocs, material, requestedQuantity);
})();
    } catch (error) {
        console.error("Error during material update operation:", error);
        req.error(500, 'Error during data fetch and upsert operation');
    }
});

this.on('label', 'SalesOrder', async req => {
        try {
            const salesOrderId = req.params[0].SalesOrder;
            console.log('params:', req.params);
            extsaleorder=req.params;      
            const salesOrderItems = await salesorderapi.run(
                SELECT.from('A_SalesOrderItem').columns(['SalesOrder', 'Material']).where({ SalesOrder: salesOrderId })
            );
            if (!salesOrderItems || salesOrderItems.length === 0) {
                console.log('No items found for SalesOrder');
                return [];
            }
            const materials = [...new Set(salesOrderItems.map(item => item.Material))];
            console.log('Materials:', materials);
            let materialDetails = [];
            if (materials.length > 0) {
                materialDetails = await materialapi.run(
                    SELECT.from('A_MatlStkInAcctMod').columns(['Material', 'Plant', 'Batch', 'StorageLocation', 'MatlWrhsStkQtyInMatlBaseUnit', 'SDDocument', 'SDDocumentItem', 'MaterialBaseUnit'])
                        .where({ Material: { in: materials } })
                );
            }
            const filteredMaterialDetails = [];
            for (const detail of materialDetails) {
                const saleOrder = detail.SDDocument;
                const orderDetails = await salesorderapi.run(
                    SELECT.from('A_SalesOrder').columns(['SoldToParty']).where({ SalesOrder: saleOrder })
                );
                if (orderDetails.length > 0 && orderDetails[0].SoldToParty === '1000003' && detail.MatlWrhsStkQtyInMatlBaseUnit > 0) {
                    filteredMaterialDetails.push(detail);
                }
            }
            return filteredMaterialDetails;
        } catch (error) {
            console.error('Error in SalesOrder label handler:', error);
            return req.error(500, 'Failed to fetch data for SalesOrder label');
        }
    });   
});

