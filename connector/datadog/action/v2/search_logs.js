module.exports = {

    name: "Search logs",

    title: "Search logs",

    version: "v2",

    description: ``,
    
    mock_input: 
		{
  "filter": {
    "query": "datadog-agent",
    "indexes": [
      "main"
    ],
    "from": "2020-09-17T11:48:36+01:00",
    "to": "2020-09-17T12:48:36+01:00"
  },
  "sort": "timestamp",
  "page": {
    "limit": 5
  }
},
	

    input: 
    {
        "title": "Input",
        "type": "object",
        "properties": {
            "payload": {
                "title": "payload",
                "type": "object",
                "properties": {
                    "filter": {
                        "title": "filter",
                        "type": "object",
                        "properties": {
                            "from": {
                                "title": "from",
                                "type": "string"
                            },
                            "indexes": {
                                "title": "indexes",
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "title": "indexes"
                                }
                            },
                            "query": {
                                "title": "query",
                                "type": "string"
                            },
                            "to": {
                                "title": "to",
                                "type": "string"
                            }
                        }
                    },
                    "options": {
                        "title": "options",
                        "type": "object",
                        "properties": {
                            "timeOffset": {
                                "title": "timeOffset",
                                "type": "integer"
                            },
                            "timezone": {
                                "title": "timezone",
                                "type": "string"
                            }
                        }
                    },
                    "sort": {
                        "title": "sort",
                        "type": "string",
                        "enum": [
                            "timestamp",
                            "-timestamp"
                        ]
                    }
                }
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
        var global_constants = require("../../common/constants");
        var api_domain = "api";
        var request = require("request");
        var option = {
            "method": "POST",
            "headers": global_constants.generate_common_header(input),
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v2/logs/events/search",
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