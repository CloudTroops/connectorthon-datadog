module.exports = {

    name: "Get a downtime",

    title: "Get a downtime",

    version: "v1",

    description: ``,
    mock_input: {
        currentOnly : true
    },

    input: {
        title: "Get a downtime",
        type: "object",
        properties: {
            "downtime_id": {
                "title": "downtime_id",
                "type": "integer",
                "minLength":1
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
        // to access auth info use input.auth , eg: input.auth.username
        // and to return output use output callback like this output(null, { "notice" : "successful"})
        // your code here
        var global_constants = require("../../common/constants");
        var request = require("request");
        var api_domain = "api";
        var option = {
            "method": "GET",
            "headers": global_constants.generate_common_header(input),
            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/downtime/"+input.downtime_id,
        }
        request(option, function(error, response, body) {
            if (error) {
                output(error);
            }
            else if (response.statusCode === 200) {
                output(null, body);
            }
            else {
                output(body,null); 
            }

        });
    }
}