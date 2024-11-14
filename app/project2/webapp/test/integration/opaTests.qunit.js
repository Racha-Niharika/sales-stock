sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project2/test/integration/FirstJourney',
		'project2/test/integration/pages/SalesOrderList',
		'project2/test/integration/pages/SalesOrderObjectPage',
		'project2/test/integration/pages/A_SalesOrderItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, SalesOrderList, SalesOrderObjectPage, A_SalesOrderItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project2') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheSalesOrderList: SalesOrderList,
					onTheSalesOrderObjectPage: SalesOrderObjectPage,
					onTheA_SalesOrderItemObjectPage: A_SalesOrderItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);