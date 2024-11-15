using { API_SALES_ORDER_SRV as external } from './external/API_SALES_ORDER_SRV';
using {API_MATERIAL_STOCK_SRV as materialapi} from './external/API_MATERIAL_STOCK_SRV';
using {API_MATERIAL_DOCUMENT_SRV_0001 as materialdocapi} from './external/API_MATERIAL_DOCUMENT_SRV_0001';

service salessrv{
    action material(material: String,plant: String,quantity: String,SDDocument: String ) returns String;
  entity SalesOrder as projection on external.A_SalesOrder{
        key SalesOrder,
        
        to_Item,
         SoldToParty,

         key null as RequestedQuantity:String(50),
        null as PurchaseOrderByCustomer:String(50),
        key null as SalesOrderItem:String(50),
        null as Material:String(50)
        
    }
    actions{
    

      action label(
           
          
            ) returns String;
    }

entity A_SalesOrderItem as projection on external.A_SalesOrderItem{
        SalesOrder,
        SalesOrderItem,
        Material,
        RequestedQuantityUnit,
        RequestedQuantity

    };

            
  entity MaterialDetail as projection on materialapi.A_MatlStkInAcctMod{
        key Material,
        Plant,
        StorageLocation,
        Batch,
        MatlWrhsStkQtyInMatlBaseUnit
    }

    entity A_MaterialDocumentHeader as projection on materialdocapi.A_MaterialDocumentHeader{
        key DocumentDate,
        key PostingDate,
        key GoodsMovementCode,
        to_MaterialDocumentItem,
    }
  };
  
  
//annotate salessrv.SalesOrder with @odata.draft.enabled;

annotate salessrv.SalesOrder with @(
    UI.LineItem:[
        {
            $Type:'UI.DataField',
            Value: SalesOrder
        },
        {
            $Type:'UI.DataField',
            Value: SalesOrderItem
        },
        {
            $Type:'UI.DataField',
            Value: Material
        },
        {
            $Type:'UI.DataField',
            Value: PurchaseOrderByCustomer
        },
        {
            $Type:'UI.DataField',
            Value: SoldToParty
        },
        {
            $Type:'UI.DataField',
            Value: RequestedQuantity
        }
    ]
);
//annotate Product with @odata.draft.enabled;

annotate salessrv.SalesOrder with @(
    UI.SelectionFields: [ SalesOrder , SalesOrderItem,PurchaseOrderByCustomer,SoldToParty],  
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
          {
            $Type:'UI.DataField',
            Value: SalesOrder
        },
        {
            $Type:'UI.DataField',
            Value: SalesOrderItem
        },
        {
            $Type:'UI.DataField',
            Value: Material
        },
        {
            $Type:'UI.DataField',
            Value: PurchaseOrderByCustomer
        },
        {
            $Type:'UI.DataField',
            Value: SoldToParty
        },
        {
            $Type:'UI.DataField',
            Value: RequestedQuantity
        }
            
        ]
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Sales order Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        }
    ]
);