module.exports = {

    name: "Check if a monitor can be deleted",

    title: "Check if a monitor can be deleted",

    version: "v1",

    description: ``,
    
    mock_input: 
		{},
	

    input: 
        { 
        title: "Input", 
        type: "object",
        properties: {
        "monitor_ids": {
            "title": "monitor_ids",
            "type": "number",
            "minLength": 1
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
            "method": "GET",
            "headers": global_constants.generate_common_header(input),
            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/monitor/can_delete",
			"qs":{ monitor_ids: input.monitor_ids }
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