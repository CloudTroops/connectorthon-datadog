module.exports = {

    name: "List your managed organizations",

    title: "List your managed organizations",

    version: "v1",

    description: ``,
    
    mock_input: 
		{},
	

        input: 
        {
            title: "Input",
            type: "object",
            properties: {
                "dummy": {
                        "title": "dummy",
                        "type": "string"
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
                        "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/org",
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