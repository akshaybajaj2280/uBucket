<!DOCTYPE html>
<html>
<head>
    <title>uBucket Tests</title>
    <link rel="stylesheet" href="../css/app.css" />
</head>
<body>


    <?php 
    
    /**
    * Parse.com testing functions
    */
    include "parse.php";
    

    echo "<h1> <font color=green>uBucket Database Status Page</font> </h1>";
    echo "<a href='http://web.engr.illinois.edu/~ubucketapp/parse_php/testing.php' class='goodbutton'>Refresh Tests</a>";

    echo "<br/><br/>Test last run at: " . date("G:i a");

    echo "<br/><br/>Current time: <iframe src='http://free.timeanddate.com/clock/i41xh35r/n3704/bo2/pa4' frameborder='0' width='123' height='26'></iframe><br/>";
    
    $globalID = setup();
    testBasicQuery($globalID);
    testBasicUpdate($globalID);
    deleteTestData($globalID);

    /**
    * Create new object in database to test on.
    * @return the ID of the newly created object
    */
    function setup()
    {
        $newItem = new parseObject('test_db');
        $newItem->test_activity = "go to KAMS";
        $newItem->test_vals = 1;
        $newItem->test_comment = "IT SMELLS SO BAD OMG";
        $res = $newItem->save();
        return get_object_vars($res)['objectId'];
    }

    /**
    * Test querying unchanged data to make sure columns are properly created.
    */
    function testBasicQuery($globalID)
    {
        $parseQuery = new parseQuery('test_db');
        $parseQuery->where('objectId',"{$globalID}");
        $results = json_encode($parseQuery->find());
        $results = json_decode($results,true);
        $row0 =  $results['results'][0]['test_activity'];        
        $row1 =  $results['results'][0]['test_vals'];
        $row2 =  $results['results'][0]['test_comment'];
        $row3 =  $results['results'][0]['objectId'];
        if (strcmp($row0, "go to KAMS")==0 and strcmp($row1, "1")==0 and strcmp($row2, "IT SMELLS SO BAD OMG")==0 and strcmp($row3, $globalID)==0 ) 
            echo "<br/><p> <font color=green>Bucketlist test items properly setup in parse.com database</font> </p>";
        else echo "<br/><h3> <font color=red>Bucketlist test items not properly setup in parse.com database. Failed at testBasicQuery()</font> </h3>";
    }


    /**
    * Test querying changed data to make sure columns properly updating.
    */
    function testBasicUpdate($globalID)
    {
        $updateObject = new parseObject('test_db');
        $updateObject->test_activity = "updated now";
        $updateObject->update($globalID);


        $parseQuery = new parseQuery('test_db');
        $parseQuery->where('objectId',"{$globalID}");
        $results = json_encode($parseQuery->find());
        $results = json_decode($results,true);
        $row0 =  $results['results'][0]['test_activity'];        
        $row1 =  $results['results'][0]['test_vals'];
        $row2 =  $results['results'][0]['test_comment'];
        $row3 =  $results['results'][0]['objectId'];
        if (strcmp($row0, "updated now")==0 and strcmp($row1, "1")==0 and strcmp($row2, "IT SMELLS SO BAD OMG")==0 and strcmp($row3, $globalID)==0 ) 
            echo "<br/><p> <font color=green>Bucketlist test items properly updating in parse.com database</font> </p>";
        else echo "<br/><h3> <font color=red>Bucketlist test items not properly setup in parse.com database. Failed at testBasicUpdate()</font> </h3>";
    }

    /**
    * Deletes test data and verifies that removing data works properly.
    */
    function deleteTestData($globalID)
    {
        $deleteObject = new parseObject('test_db');
        $deleteObject->delete($globalID);   


        $parseQuery = new parseQuery('test_db');
        $parseQuery->where('objectId',"{$globalID}");
        $results = json_encode($parseQuery->find());
        $results = json_decode($results,true);
        $row0 =  $results['results'][0]['test_activity'];        
        $row1 =  $results['results'][0]['test_vals'];
        $row2 =  $results['results'][0]['test_comment'];
        $row3 =  $results['results'][0]['objectId'];
        if (strcmp($row0, "updated now")!=0 and strcmp($row1, "1")!=0 and strcmp($row2, "IT SMELLS SO BAD OMG")!=0 and strcmp($row3, $globalID)!=0 ) 
            echo "<br/><p> <font color=green>Bucketlist test items properly deleted in parse.com database</font> </p>";
        else echo "<br/><h3> <font color=red>Bucketlist test items not properly deleted in parse.com database. Failed at deleteTestData()</font> </h3>";
    }

    

    ?>

</body>
</html>