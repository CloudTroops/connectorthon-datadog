module.exports = {

    name: "Check permissions for log services",

    title: "Check permissions for log services",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "account_id": "1234567",
  "services": [
    "s3",
    "elb",
    "elbv2",
    "cloudfront",
    "redshift",
    "lambda"
  ]
},
	

    input: 
        { title: "Input", type: "object",properties: {"payload": { "title":"payload","type": "object", "properties": {"account_id": { "title":"account_id","type": "string","minLength" : 1},"services": { "title":"services","type": "array","items" : {    "type": "object",    "properties" : {        "services" : {            "title" : "services",            "type" : "string",        }    }}, "minLength" : 1 },} },} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/integration/aws/logs/services_async",
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