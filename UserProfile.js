/*
var params = {
	userField: 'Employee_x0020_Name', 
	properties: {
		'Title': 'Job Title',
		'SPS-Location': 'Region',
		'Office': 'Location',
        'SubFunction': 'Sub Function',
        'UserName': 'Employee ID',
        'Region': 'Region'
	}
};*/

function run(params) {
	console.log('running');
	var properties = buildPropertyArray();
	var userFieldSelecter = "input[id^='"+params.userField+"'], input[id^='"+params.userField+" Required Field']";	
	$(document).on("focusout", userFieldSelecter, function() {
		var userID = getUserID(userFieldSelecter);
		if (userID != null) {
			var promises = [];
			for (i=0; i<properties.length; i++) { 
				var property = properties[i];
				promises.push(getProperty(property, userID));
			}
			Promise.all(promises);
		}
		// inside here I need another event listener for when the value changes
	});
}

function getProperty(property, userID) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='" + property + "')?@v='" + userID + "'",
			type: "GET",
			headers: { "accept": "application/json;odata=verbose" },
			success: function (result) {
			   var fieldID = params.properties[property].replace(" ", "_x0020_");
			   var value = result.d.GetUserProfilePropertyFor;
			   setFieldValue(fieldID, value);
			   Promise.resolve('success');
			},
			error: function(error) {
				console.log(error);	
				Promise.reject('error');
			} 
		});
	});
}

function setFieldValue(fieldID, value) {
	try {
		var selecter = "input[id^='"+fieldID+"'], input[id^='"+fieldID+" Required Field']";	
		var currentValue = document.querySelector(selecter).getAttribute('value');
		if (currentValue == '') {
			document.querySelector(selecter).setAttribute('value', value);
		}
	}
	catch (err) {
		console.log('Error reading property of field containing ' + fieldID + ' in its ID');
	}
	
}

function buildPropertyArray() {
	var properties = [];
	for (i=0; i < Object.keys(params.properties).length; i++) {
		var key = Object.keys(params.properties)[i]
		if (params.properties[key] != null) {	
			properties.push(key.replace(" ", "_x0020_"));
		}
	}
	return properties;
}

/* Takes the title attribute of the input */
function getUserID(selecter) {
	try {
		// get object and ensure the field isn't empty and has actually resolved a user
		var obj = eval(document.querySelector(selecter).getAttribute('value'))[0];
		if (obj != null && obj.EntityType == "User") {
			return obj.Description; // return domain\username
		}
		else {
			return null;
		}	
	}
	catch(err) {
		console.log(err);
		return null;
	}
}   
