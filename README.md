# UserPropertyAutoFill
[SharePoint] Custom JavaScript, only requiring simple parameters to configure, that grabs user profile information from a user field, in which it will auto-fill other fields on the form with chosen properties.

# Configuration
Edit the default new form, and add a script editor to the page. In the script editor, paste the following:

```
// link to the UserProfile.js file 
<script src="../../SiteAssets/UserProfile.js"></script>

<script type="text/javascript">
var params = {
	userField: 'EmployeeField', 
	properties: {
		'NameOfSharePointUserProfileProperty': 'NameOfField',
		'FirstName': null,
		'LastName': null,
    'Location': null,
    'UserName': null,
    'Region': null
  }
}

$(document).ready(function() {
		run(params);
});
</script>
```

