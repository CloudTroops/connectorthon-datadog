module.exports = {

    name: "Get all monitor details",

    title: "Get all monitor details",

    version: "v1",

    description: ``,
    
    mock_input: 
		{},
	

    input: 
        { title: "Input", type: "object",properties: {"group_states": { "title":"group_states","type": "string",},"name": { "title":"name","type": "string",},"tags": { "title":"tags","type": "string",},"monitor_tags": { "title":"monitor_tags","type": "string",},"with_downtimes": { "title":"with_downtimes","type": "boolean",},"id_offset": { "title":"id_offset","type": "integer",},"page": { "title":"page","type": "integer",},"page_size": { "title":"page_size","type": "integer",},} },
            

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
            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/monitor",
			"qs":{ group_states: input.group_states,name: input.name,tags: input.tags,monitor_tags: input.monitor_tags,with_downtimes: input.with_downtimes,id_offset: input.id_offset,page: input.page,page_size: input.page_size }
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