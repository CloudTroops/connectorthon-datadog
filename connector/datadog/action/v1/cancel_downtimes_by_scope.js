module.exports = {

    name: "Cancel downtimes by scope",

    title: "Cancel downtimes by scope",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
        "payload" :{
            "scope": "env:staging"
        }
    },
	

    input: 
    {
        "title": "Input",
        "type": "object",
        "properties": {
            "payload": {
                "title": "payload",
                "type": "object",
                "properties": {
                    "scope": {
                        "title": "scope",
                        "type": "string",
                        "minLength": 1
                    }
                }
            }
        }
    },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/downtime/cancel/by_scope",
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