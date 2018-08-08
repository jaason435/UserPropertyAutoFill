/*
var params = {
	userField: 'Employee_x0020_Name', 
	properties: {
		Title: 'Job Title',
		SPS-Location: 'Region',
		Office: 'Location',
        SubFunction: 'Sub Function',
        UserName: 'Employee ID',
        Region: 'Region'
	}
};*/

function startUserAutoFill(params) {
	var propertiesNeeded = buildPropertyArray(params);
	var userFieldSelecter = "input[id^='"+params.userField+"'], input[id^='"+params.userField+" Required Field']";	
	$(document).on("focusout", userFieldSelecter, function() {
		var userID = getUserID(userFieldSelecter);
		if (userID != null) {
			getPropertiesAndPopulate(userID, propertiesNeeded, params);
		}
		else {
			clear(params, propertiesNeeded);
		}
	});
}

function getPropertiesAndPopulate(username, propertiesNeeded, params) {
	var url = _spPageContextInfo.webServerRelativeUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + encodeURIComponent(username) + "'&$select=UserProfileProperties";
	$.ajax({ 
		url : url, 
	    type : "GET", 
	    headers: { "accept": "application/json;odata=verbose" }, 
	    success:function(data) 
	    { 	
	    	var allProperties = data.d.UserProfileProperties.results;
	    	populate(allProperties, propertiesNeeded, params);
	    }, 
	    error:function(jqxr,errorCode,errorThrown)
	    { 
	    	console.log('An error occurred while retrieving user properties');
	    } 
	});	
}

function populate(allUserProperties, propertiesToFetch, params) {
	for (i=0; i<allUserProperties.length; i++) { 
		var property = allUserProperties[i].Key;
		// check if property is specified in params
		if (propertiesToFetch.includes(property)) {
			var value = allUserProperties[i].Value;
			var fieldID = params.properties[property].replace(" ", "_x0020_");
			setFieldValue(fieldID, value);
		}
	}
}

function clear(params, propertiesToFetch) {
	for(i=0; i < propertiesToFetch.length; i++) {
		var property = propertiesToFetch[i];
		var fieldID = params.properties[property].replace(" ", "_x0020_");
		setFieldValue(fieldID, '');
	}
}

function setFieldValue(fieldID, value) {
	try {
		var selecter = "input[id^='"+fieldID+"'], input[id^='"+fieldID+" Required Field']";	
		var currentValue = document.querySelector(selecter).getAttribute('value');
		document.querySelector(selecter).setAttribute('value', value);
	}
	catch (err) {
		console.log('Error reading property of field containing ' + fieldID + ' in its ID');
	}
	
}

function buildPropertyArray(params) {
	var properties = [];
	for (i=0; i < Object.keys(params.properties).length; i++) {
		var key = Object.keys(params.properties)[i];
		var value = params.properties[key];
		if (value != null) {
			properties.push(key);
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
		return null;
	}
}   
