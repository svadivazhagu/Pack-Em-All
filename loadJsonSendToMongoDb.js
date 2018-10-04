function loadJSON(filePath, success, error)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(JSON.parse(xhr.responseText));
		} else {
			if (error)
				error(xhr);
			}
		}
	};
	xhr.open("GET", 'occupation.json' , true);
	xhr.send();
}

var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test";
MongoClient.connect(uri, function(err, client) {
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});

//mongodb+srv://svadivazhagu:goatshead@occupation-rqsol.mongodb.net/test?retryWrites=true
