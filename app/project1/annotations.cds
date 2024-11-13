using salessrv as service from '../../srv/service';
annotate service.A_SalesOrderItem with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrder',
                Value : SalesOrder,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrderItem',
                Value : SalesOrderItem,
            },
            {
                $Type : 'UI.DataField',
                Label : 'HigherLevelItem',
                Value : HigherLevelItem,
            },
            {
                $Type : 'UI.DataField',
                Label : 'HigherLevelItemUsage',
                Value : HigherLevelItemUsage,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrderItemCategory',
                Value : SalesOrderItemCategory,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrderItemText',
                Value : SalesOrderItemText,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PurchaseOrderByCustomer',
                Value : PurchaseOrderByCustomer,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PurchaseOrderByShipToParty',
                Value : PurchaseOrderByShipToParty,
            },
            {
                $Type : 'UI.DataField',
                Label : 'UnderlyingPurchaseOrderItem',
                Value : UnderlyingPurchaseOrderItem,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ExternalItemID',
                Value : ExternalItemID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Material',
                Value : Material,
            },
            {
                $Type : 'UI.DataField',
                Label : 'MaterialByCustomer',
                Value : MaterialByCustomer,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PricingDate',
                Value : PricingDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PricingReferenceMaterial',
                Value : PricingReferenceMaterial,
            },
            {
                $Type : 'UI.DataField',
                Label : 'BillingPlan',
                Value : BillingPlan,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedQuantity',
                Value : RequestedQuantity,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedQuantityUnit',
                Value : RequestedQuantityUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedQuantitySAPUnit',
                Value : RequestedQuantitySAPUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedQuantityISOUnit',
                Value : RequestedQuantityISOUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OrderQuantityUnit',
                Value : OrderQuantityUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OrderQuantitySAPUnit',
                Value : OrderQuantitySAPUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OrderQuantityISOUnit',
                Value : OrderQuantityISOUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ConfdDelivQtyInOrderQtyUnit',
                Value : ConfdDelivQtyInOrderQtyUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemGrossWeight',
                Value : ItemGrossWeight,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemNetWeight',
                Value : ItemNetWeight,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemWeightUnit',
                Value : ItemWeightUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemWeightSAPUnit',
                Value : ItemWeightSAPUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemWeightISOUnit',
                Value : ItemWeightISOUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemVolume',
                Value : ItemVolume,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemVolumeUnit',
                Value : ItemVolumeUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemVolumeSAPUnit',
                Value : ItemVolumeSAPUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemVolumeISOUnit',
                Value : ItemVolumeISOUnit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TransactionCurrency',
                Value : TransactionCurrency,
            },
            {
                $Type : 'UI.DataField',
                Label : 'NetAmount',
                Value : NetAmount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TotalSDDocReferenceStatus',
                Value : TotalSDDocReferenceStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SDDocReferenceStatus',
                Value : SDDocReferenceStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'MaterialSubstitutionReason',
                Value : MaterialSubstitutionReason,
            },
            {
                $Type : 'UI.DataField',
                Label : 'MaterialGroup',
                Value : MaterialGroup,
            },
            {
                $Type : 'UI.DataField',
                Label : 'MaterialPricingGroup',
                Value : MaterialPricingGroup,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AdditionalMaterialGroup1',
                Value : AdditionalMaterialGroup1,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AdditionalMaterialGroup2',
                Value : AdditionalMaterialGroup2,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AdditionalMaterialGroup3',
                Value : AdditionalMaterialGroup3,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AdditionalMaterialGroup4',
                Value : AdditionalMaterialGroup4,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AdditionalMaterialGroup5',
                Value : AdditionalMaterialGroup5,
            },
            {
                $Type : 'UI.DataField',
                Label : 'BillingDocumentDate',
                Value : BillingDocumentDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ContractAccount',
                Value : ContractAccount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AdditionalValueDays',
                Value : AdditionalValueDays,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ServicesRenderedDate',
                Value : ServicesRenderedDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Batch',
                Value : Batch,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductionPlant',
                Value : ProductionPlant,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OriginalPlant',
                Value : OriginalPlant,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AltvBsdConfSubstitutionStatus',
                Value : AltvBsdConfSubstitutionStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StorageLocation',
                Value : StorageLocation,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DeliveryGroup',
                Value : DeliveryGroup,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ShippingPoint',
                Value : ShippingPoint,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ShippingType',
                Value : ShippingType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DeliveryPriority',
                Value : DeliveryPriority,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DeliveryDateQuantityIsFixed',
                Value : DeliveryDateQuantityIsFixed,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DeliveryDateTypeRule',
                Value : DeliveryDateTypeRule,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IncotermsClassification',
                Value : IncotermsClassification,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IncotermsTransferLocation',
                Value : IncotermsTransferLocation,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IncotermsLocation1',
                Value : IncotermsLocation1,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IncotermsLocation2',
                Value : IncotermsLocation2,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TaxAmount',
                Value : TaxAmount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification1',
                Value : ProductTaxClassification1,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification2',
                Value : ProductTaxClassification2,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification3',
                Value : ProductTaxClassification3,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification4',
                Value : ProductTaxClassification4,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification5',
                Value : ProductTaxClassification5,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification6',
                Value : ProductTaxClassification6,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification7',
                Value : ProductTaxClassification7,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification8',
                Value : ProductTaxClassification8,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductTaxClassification9',
                Value : ProductTaxClassification9,
            },
            {
                $Type : 'UI.DataField',
                Label : 'MatlAccountAssignmentGroup',
                Value : MatlAccountAssignmentGroup,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CostAmount',
                Value : CostAmount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerPaymentTerms',
                Value : CustomerPaymentTerms,
            },
            {
                $Type : 'UI.DataField',
                Label : 'FixedValueDate',
                Value : FixedValueDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerGroup',
                Value : CustomerGroup,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SalesDocumentRjcnReason',
                Value : SalesDocumentRjcnReason,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ItemBillingBlockReason',
                Value : ItemBillingBlockReason,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SlsDocIsRlvtForProofOfDeliv',
                Value : SlsDocIsRlvtForProofOfDeliv,
            },
            {
                $Type : 'UI.DataField',
                Label : 'WBSElement',
                Value : WBSElement,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProfitCenter',
                Value : ProfitCenter,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AccountingExchangeRate',
                Value : AccountingExchangeRate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ReferenceSDDocument',
                Value : ReferenceSDDocument,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ReferenceSDDocumentItem',
                Value : ReferenceSDDocumentItem,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SDProcessStatus',
                Value : SDProcessStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DeliveryStatus',
                Value : DeliveryStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OrderRelatedBillingStatus',
                Value : OrderRelatedBillingStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Subtotal1Amount',
                Value : Subtotal1Amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Subtotal2Amount',
                Value : Subtotal2Amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Subtotal3Amount',
                Value : Subtotal3Amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Subtotal4Amount',
                Value : Subtotal4Amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Subtotal5Amount',
                Value : Subtotal5Amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Subtotal6Amount',
                Value : Subtotal6Amount,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'SalesOrderItem',
            Value : SalesOrderItem,
        },
        {
            $Type : 'UI.DataField',
            Label : 'SalesOrder',
            Value : SalesOrder,
        },
        {
            $Type : 'UI.DataField',
            Label : 'HigherLevelItem',
            Value : HigherLevelItem,
        },
        {
            $Type : 'UI.DataField',
            Label : 'HigherLevelItemUsage',
            Value : HigherLevelItemUsage,
        },
        {
            $Type : 'UI.DataField',
            Label : 'SalesOrderItemCategory',
            Value : SalesOrderItemCategory,
        },
    ],
);

