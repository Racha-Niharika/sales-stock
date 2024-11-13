sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'project1',
            componentId: 'A_SalesOrderItemObjectPage',
            contextPath: '/A_SalesOrderItem'
        },
        CustomPageDefinitions
    );
});