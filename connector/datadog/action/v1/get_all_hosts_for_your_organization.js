module.exports = {

    name: "Get all hosts for your organization",

    title: "Get all hosts for your organization",

    version: "v1",

    description: ``,
    
    mock_input: 
		{},
	

    input: 
        { title: "Input", type: "object",properties: {"filter": { "title":"filter","type": "string",},"sort_field": { "title":"sort_field","type": "string",},"sort_dir": { "title":"sort_dir","type": "string",},"start": { "title":"start","type": "integer",},"count": { "title":"count","type": "integer",},"from": { "title":"from","type": "integer",},"include_muted_hosts_data": { "title":"include_muted_hosts_data","type": "boolean",},"include_hosts_metadata": { "title":"include_hosts_metadata","type": "boolean",},} },
            

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
                        "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/hosts",
			"qs":{ filter: input.filter,sort_field: input.sort_field,sort_dir: input.sort_dir,start: input.start,count: input.count,from: input.from,include_muted_hosts_data: input.include_muted_hosts_data,include_hosts_metadata: input.include_hosts_metadata }
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