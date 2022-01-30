module.exports = {

    name: "Update an azure integration",

    title: "Update an azure integration",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "automute": true,
  "client_id": "testc7f6-1234-5678-9101-3fcbf464test",
  "client_secret": "testingx./Sw*g/Y33t..R1cH+hScMDt",
  "errors": [
    "*"
  ],
  "host_filters": "key:value,filter:example",
  "new_client_id": "new1c7f6-1234-5678-9101-3fcbf464test",
  "new_tenant_name": "new1c44-1234-5678-9101-cc00736ftest",
  "tenant_name": "testc44-1234-5678-9101-cc00736ftest"
},
	

    input: 
        { title: "Input", type: "object",properties: {"payload": { "title":"payload","type": "object", "properties": {"automute": { "title":"automute","type": "boolean",},"client_id": { "title":"client_id","type": "string",},"client_secret": { "title":"client_secret","type": "string",},"host_filters": { "title":"host_filters","type": "string",},"new_client_id": { "title":"new_client_id","type": "string",},"new_tenant_name": { "title":"new_tenant_name","type": "string",},"tenant_name": { "title":"tenant_name","type": "string",},} },} },
            

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
            "method": "PUT",
            "headers": global_constants.generate_common_header(input),
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/integration/azure",
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