sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project1/test/integration/FirstJourney',
		'project1/test/integration/pages/A_SalesOrderItemList',
		'project1/test/integration/pages/A_SalesOrderItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, A_SalesOrderItemList, A_SalesOrderItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project1') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheA_SalesOrderItemList: A_SalesOrderItemList,
					onTheA_SalesOrderItemObjectPage: A_SalesOrderItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);