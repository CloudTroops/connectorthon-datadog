module.exports = {

    name: "Set an aws tag filter",

    title: "Set an aws tag filter",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "account_id": "1234567",
  "namespace": "string",
  "tag_filter_str": "prod*"
},
	

    input: 
        { title: "Input", type: "object",properties: {"payload": { "title":"payload","type": "object", "properties": {"account_id": { "title":"account_id","type": "string",},"namespace": { "title":"namespace","type": "string","enum": ["elb","application_elb","sqs","rds","custom","network_elb","lambda"],},"tag_filter_str": { "title":"tag_filter_str","type": "string",},} },} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/integration/aws/filtering",
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