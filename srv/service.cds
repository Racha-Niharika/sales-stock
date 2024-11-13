using { API_SALES_ORDER_SRV as external } from './external/API_SALES_ORDER_SRV';
using {API_MATERIAL_STOCK_SRV as materialapi} from './external/API_MATERIAL_STOCK_SRV';
service salessrv{
   action label(
      name: String(80) @Common.Label: 'name',
      amount: String(80) @Common.Label: 'amount'
   ) returns String;
entity A_SalesOrderItem as projection on external.A_SalesOrderItem actions{
    

      action label(
           
            // Forms: String(80) @Common.Label: 'Forms' @Common.ValueList: {
            //   CollectionPath: 'Forms', 
            //   Label: 'Label',
            //   Parameters: [
            //     {
            //       $Type: 'Common.ValueListParameterInOut',
            //       LocalDataProperty: 'Forms',  
            //       ValueListProperty: 'FormName'    
            //     }
            //   ]
            // }
            ) returns String;
  
  };
  
  entity MaterialDetail as projection on materialapi.A_MatlStkInAcctMod{
        key Material,
        Plant,
        StorageLocation,
        Batch,
        MatlWrhsStkQtyInMatlBaseUnit
    }
}

annotate salessrv.A_SalesOrderItem with @(
    UI.LineItem:[
        {
            $Type:'UI.DataField',
            Value: SalesOrder
        },
        {
            $Type:'UI.DataField',
            Value: SalesOrderItem
        }
    ]
);
//annotate Product with @odata.draft.enabled;

annotate salessrv.A_SalesOrderItem with @(
    UI.SelectionFields: [ SalesOrder , SalesOrderItem],  
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
        }
            
        ]
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        }
    ]
);