module.exports = {

    name: "Create an aws integration",

    title: "Create an aws integration",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "access_key_id": "string",
  "account_id": "1234567",
  "account_specific_namespace_rules": {
    "<any-key>": false
  },
  "cspm_resource_collection_enabled": true,
  "excluded_regions": [
    "us-east-1",
    "us-west-2"
  ],
  "filter_tags": [
    "<KEY>:<VALUE>"
  ],
  "host_tags": [
    "<KEY>:<VALUE>"
  ],
  "metrics_collection_enabled": false,
  "resource_collection_enabled": true,
  "role_name": "DatadogAWSIntegrationRole",
  "secret_access_key": "string"
},
	

    input: 
        { title: "Input", type: "object",properties: {"payload": { "title":"payload","type": "object", "properties": {"access_key_id": { "title":"access_key_id","type": "string",},"account_id": { "title":"account_id","type": "string",},"account_specific_namespace_rules": { "title":"account_specific_namespace_rules","type": "object", "properties": {"<any-key>": { "title":"<any-key>","type": "boolean",},} },"cspm_resource_collection_enabled": { "title":"cspm_resource_collection_enabled","type": "boolean",},"excluded_regions": { "title":"excluded_regions","type": "array","items" : {    "type": "object",    "properties" : {        "excluded_regions" : {            "title" : "excluded_regions",            "type" : "string",} } } },"filter_tags": { "title":"filter_tags","type": "array","items" : {    "type": "object",    "properties" : {        "filter_tags" : {            "title" : "filter_tags",            "type" : "string",} } } },"host_tags": { "title":"host_tags","type": "array","items" : {    "type": "object",    "properties" : {        "host_tags" : {            "title" : "host_tags",            "type" : "string",} } } },"metrics_collection_enabled": { "title":"metrics_collection_enabled","type": "boolean",},"resource_collection_enabled": { "title":"resource_collection_enabled","type": "boolean",},"role_name": { "title":"role_name","type": "string",},"secret_access_key": { "title":"secret_access_key","type": "string",},} },} },
            

    output: {
        title: "output",
        type: "object",
            properties: {
                "title": "Output",
                "type": "object",
                "properties": {
                        
            }
        }
    },

    execute: function(input, output) {
        var global_constants = require("../../common/constants");
        var api_domain = "api";
        var request = require("request");
        var option = {
            "method": "POST",
            "headers": global_constants.generate_common_header(input),
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/integration/aws",
			"qs":{   }
        }
        request(option, function(error, response, body) {
            if (error) {
                output(error);
            }
            if (response.statusCode === 200) {
                output(null, body);
            }
            else {
                if(body) {
                    output(body,null)
                }
                else {
                    output(`{"status": false,"statusMessage": ${response.statusMessage}}`,null)
                }
            }
        });
    }
}