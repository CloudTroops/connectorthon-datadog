module.exports = {

    name: "Update a dashboard list",

    title: "Update a dashboard list",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "name": "updated Example-Update_a_dashboard_list_returns_OK_response"
},
	

    input: 
        { title: "Input", type: "object",properties: {"list_id": { "title":"list_id","type": "integer","minLength" : 1},"payload": { "title":"payload","type": "object", "properties": {"name": { "title":"name","type": "string","minLength" : 1},} },} },
            

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
            "method": "PUT",
            "headers": global_constants.generate_common_header(input),
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/dashboard/lists/manual/{input.list_id}",
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