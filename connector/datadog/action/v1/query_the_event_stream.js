module.exports = {

    name: "Query the event stream",

    title: "Query the event stream",

    version: "v1",

    description: ``,
    
    mock_input: 
		{},
	

    input: 
        { title: "Input", type: "object",properties: {"start": { "title":"start","type": "integer","minLength" : 1},"end": { "title":"end","type": "integer","minLength" : 1},"priority": { "title":"priority","type": "string",},"sources": { "title":"sources","type": "string",},"tags": { "title":"tags","type": "string",},"unaggregated": { "title":"unaggregated","type": "boolean",},"exclude_aggregate": { "title":"exclude_aggregate","type": "boolean",},"page": { "title":"page","type": "integer",},} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/events",
			"qs":{ start : input.start ,end : input.end ,priority: input.priority,sources: input.sources,tags: input.tags,unaggregated: input.unaggregated,exclude_aggregate: input.exclude_aggregate,page: input.page }
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