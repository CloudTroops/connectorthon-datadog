module.exports = {

    name: "Mute a host",

    title: "Mute a host",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "end": 1579098130,
  "message": "Muting this host for a test!",
  "override": false
},
	

    input: 
        { title: "Input", type: "object",properties: {"host_name": { "title":"host_name","type": "string","minLength" : 1},"payload": { "title":"payload","type": "object", "properties": {"end": { "title":"end","type": "integer",},"message": { "title":"message","type": "string",},"override": { "title":"override","type": "boolean",},} },} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/host/{input.host_name}/mute",
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