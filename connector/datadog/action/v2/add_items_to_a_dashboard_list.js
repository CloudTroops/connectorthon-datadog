module.exports = {

    name: "Add items to a dashboard list",

    title: "Add items to a dashboard list",

    version: "v2",

    description: ``,
    
    mock_input: 
		{
  "dashboards": [
    {
      "id": "q5j-nti-fv6",
      "type": "host_timeboard"
    }
  ]
},
	

    input: 
        { title: "Input", type: "object",properties: {"dashboard_list_id": { "title":"dashboard_list_id","type": "integer","minLength" : 1},"payload": { "title":"payload","type": "object", "properties": {"dashboards": { "title":"dashboards","type": "object", "properties": {"id": { "title":"id","type": "string","minLength" : 1},"type": { "title":"type","type": "string","enum": ["custom_timeboard","custom_screenboard","integration_screenboard","integration_timeboard","host_timeboard"],"minLength" : 1},} },} },} },
            

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
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v2/dashboard/lists/manual/{input.dashboard_list_id}/dashboards",
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