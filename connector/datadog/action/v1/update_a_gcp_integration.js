module.exports = {

    name: "Update a gcp integration",

    title: "Update a gcp integration",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "automute": false,
  "client_email": "api-dev@datadog-sandbox.iam.gserviceaccount.com",
  "client_id": "123456712345671234567",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/<CLIENT_EMAIL>",
  "errors": [
    "*"
  ],
  "host_filters": "key:value,filter:example",
  "private_key": "private_key",
  "private_key_id": "123456789abcdefghi123456789abcdefghijklm",
  "project_id": "datadog-apitest",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "type": "service_account"
},
	

    input: 
        { title: "Input", type: "object",properties: {"payload": { "title":"payload","type": "object", "properties": {"auth_provider_x509_cert_url": { "title":"auth_provider_x509_cert_url","type": "string",},"auth_uri": { "title":"auth_uri","type": "string",},"automute": { "title":"automute","type": "boolean",},"client_email": { "title":"client_email","type": "string",},"client_id": { "title":"client_id","type": "string",},"client_x509_cert_url": { "title":"client_x509_cert_url","type": "string",},"host_filters": { "title":"host_filters","type": "string",},"private_key": { "title":"private_key","type": "string",},"private_key_id": { "title":"private_key_id","type": "string",},"project_id": { "title":"project_id","type": "string",},"token_uri": { "title":"token_uri","type": "string",},"type": { "title":"type","type": "string",},} },} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/integration/gcp",
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