const cds = require('@sap/cds');
const { c } = require('@sap/cds/lib/utils/tar');


module.exports = cds.service.impl(async function () {
    const {A_SalesOrderItem } = this.entities;
    const materialapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');
    this.on('READ', A_SalesOrderItem, async (req) => {
        try {
            const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
            req.query.SELECT.columns = [{ ref: ['SalesOrder'] }, { ref: ['SalesOrderItem'] },{ref:['Material']}];
            const result = await salesorderapi.run(req.query);
            //console.log('salesorder Data:', result);
            return result;
        } catch (error) {
            console.error('Error fetching data from external service:', error);
            return req.error(500, 'Failed to fetch data from external service');
        }
    });
    
    this.on('READ', 'MaterialDetail', async req => {
        req.query.SELECT.columns = [
            { ref: ['Material'] },
            { ref: ['Plant']},
            { ref: ['StorageLocation']},
            { ref: ['Batch']},
            {ref:['MatlWrhsStkQtyInMatlBaseUnit']}
        ];

        let res = await materialapi.run(req.query);
        return res;
    });
    this.on('label','A_SalesOrderItem', async (req) => {
        console.log('data:',req.params);
        console.log('data req',req.data);
        const materialapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');
        const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
        //console.log(productapi);
       
        
        //const { PurchaseOrder, Forms,PurchaseOrderItem } = this.entities;
        const {SalesOrder,SalesOrderItem } = req.params[0];  
        //const {SalesOrderItem } = req.params[1];  
        console.log('SalesOrder',SalesOrder);
        console.log('salesorderitem:',SalesOrderItem);
        const material = await salesorderapi.run(
            SELECT.from('A_SalesOrderItem').where({ SalesOrder: SalesOrder }).columns(
                'Material'
            )
        );
        console.log(material);
        const {Material } = material[0];
        console.log('material:',Material);
        const materialstock = await materialapi.run(
            SELECT.from('A_MatlStkInAcctMod').where({ Material:Material }).columns(
               'Material',
              
       'Plant' ,
        'StorageLocation',
        'Batch',
        'MatlWrhsStkQtyInMatlBaseUnit'
            )
        );
        console.log('stock:',materialstock);
        return materialstock;
//         console.log(JSON.stringify(materialstock, null, 2));
// jsonData=JSON.stringify(materialstock, null, 2);
// const wrappedJsonData = { materialstock: materialstock };

// const xmlOptions = { compact: true, ignoreComment: true, spaces: 4 };
// const xmlData = json2xml(wrappedJsonData, xmlOptions); // Convert JSON to XML

// console.log("Generated XML:", xmlData);

// const base64EncodedXML = Buffer.from(xmlData).toString('base64');
// console.log("Base64 Encoded XML:", base64EncodedXML);

        /*
        const {ProductLocal}=this.entities
          console.log(req.params);
          console.log(req.data);
          const { Product } = req.params[0];  
          const rowData = await SELECT.one.from(ProductLocal).where({Product: Product});
  
          if (!rowData) {
              return req.error(404,' No data found for Product: ${Product}');
          }
          rowData.state=req.data.state;
          let form = req.data.Forms;
          console.log("Row data:", rowData);
          const xmlfun = (rowData) => {
            const xmlData = json2xml({ Product: rowData }, { header: true });
            return xmlData;
        };
        const callxml = xmlfun(rowData);
        console.log("Generated XML:", callxml);
          const base64EncodedXML = Buffer.from(callxml).toString('base64');
  
          console.log("Base64 Encoded XML:", base64EncodedXML);
          try {
            const authResponse = await axios.get('https://runsimple.authentication.us10.hana.ondemand.com/oauth/token', {
                params: {
                    grant_type: 'client_credentials'
                },
                auth: {
                    username: 'sb-0659fb15-d82d-43fc-9a1a-4ff294ffade6!b33406|ads-xsappname!b65488',
                    password: 'cad88edf-9d4c-4a29-8301-7d89403c35df$xJJn5FeYQgciuMINbDMk86-7AHxHgl2p6n6nijoaCqA='
                }
            });
            const accessToken = authResponse.data.access_token;
            console.log("Access Token:", accessToken);
            const pdfResponse = await axios.post('https://adsrestapi-formsprocessing.cfapps.us10.hana.ondemand.com/v1/adsRender/pdf?templateSource=storageName', {
                xdpTemplate: form,
                xmlData: base64EncodedXML, 
                formType: "print",
                formLocale: "",
                taggedPdf: 1,
                embedFont: 0
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const fileContent = pdfResponse.data.fileContent;
            console.log("File Content:", fileContent);
            return fileContent;
  
        } catch (error) {
            console.error("Error occurred:", error);
            return req.error(500, "An error occurred while processing your request.");
        }
          */
  
         
      });
}
)