module.exports = {

    name: "Post an event",

    title: "Post an event",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "title": "Example-Post_an_event_returns_OK_response",
  "text": "A text message.",
  "tags": [
    "test:ExamplePostaneventreturnsOKresponse"
  ]
},
	

    input: 
        { title: "Input", type: "object",properties: {"payload": { "title":"payload","type": "object", "properties": {"aggregation_key": { "title":"aggregation_key","type": "string",},"alert_type": { "title":"alert_type","type": "string","enum": ["error","warning","info","success","user_update","recommendation","snapshot"],},"date_happened": { "title":"date_happened","type": "integer",},"device_name": { "title":"device_name","type": "string",},"host": { "title":"host","type": "string",},"priority": { "title":"priority","type": "string","enum": ["normal","low"],},"related_event_id": { "title":"related_event_id","type": "integer",},"source_type_name": { "title":"source_type_name","type": "string",},"tags": { "title":"tags","type": "array","items" : {    "type": "object",    "properties" : {        "tags" : {            "title" : "tags",            "type" : "string",} } } },"text": { "title":"text","type": "string","minLength" : 1},"title": { "title":"title","type": "string","minLength" : 1},} },} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/events",
			"qs":{   }
        }
        request(option, function(error, response, body) {
            if (error) {
                output(error);
            }
            if (response.statusCode === 202) {
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