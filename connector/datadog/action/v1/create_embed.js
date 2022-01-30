module.exports = {

    name: "Create embed",

    title: "Create embed",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "graph_json": "",
  "legend": "string",
  "size": "string",
  "timeframe": "string",
  "title": "string"
},
	

    input: 
        { title: "Input", type: "object",properties: {"payload": { "title":"payload","type": "object", "properties": {"graph_json": { "title":"graph_json","type": "string","minLength" : 1},"legend": { "title":"legend","type": "string","enum": ["yes","no"],},"size": { "title":"size","type": "string","enum": ["small","medium","large","xlarge"],},"timeframe": { "title":"timeframe","type": "string","enum": ["1_hour","4_hours","1_day","2_days","1_week"],},"title": { "title":"title","type": "string",},} },} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/graph/embed",
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