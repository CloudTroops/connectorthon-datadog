module.exports = {

    name: "Send logs",

    title: "Send logs",

    version: "v2",

    description: ``,
    
    mock_input: {
		messages: [
            {
                message : "Hello"
            },
            {
                message : "From"
            },
            {
                message : "WMIO"
            }
        ],
        ddtags: "local;test",
        ddsource: "localhost",
        service: "mocktest",
        hostname: "localhost.pop-os"
	},

    input: {
        title: "Input",
        type: "object",
            "properties": {
                    "ddsource": {
                        "title": "ddsource",
                        "type": "string"
                    },
                    "ddtags": {
                        "title": "ddtags",
                        "type": "string"
                    },
                    "hostname": {
                        "title": "hostname",
                        "type": "string"
                    },
                    "messages": {
                        "title": "messages",
                        "type": "array",
                        "items" : {
                            "type": "object",
                            "properties" : {
                                "message" : {
                                    "title" : "message",
                                    "type" : "string",
                                    "minLength" : 1
                                }
                            }
                        },
                        "minItems" : 1
                    },
                    "service": {
                        "title": "service",
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
        // to access auth info use input.auth , eg: input.auth.username
        // and to return output use output callback like this output(null, { "notice" : "successful"})
        // your code here
        var global_constants = require("../../common/constants");
        var api_domain = "http-intake.logs";
        var request = require("request");
        var option = {
            "method": "POST",
            "headers": global_constants.generate_common_header(input),
            "json": {
                ddtags: input.ddtags,
                ddsource: input.ddsource,
                message: input.messages,
                hostname: input.hostname,
                service: input.service
            },
            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v2/logs",
        }
        //console.log("Sending Request "+Object.keys(option.headers)+" "+Object.values(option.headers));
        //console.log("Sending Request "+option.json);
        request(option, function(error, response, body) {
            if (error) {
                output(error);
            }
            if (response.statusCode === 202) {
                output(null, `{"status" : true}`);
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