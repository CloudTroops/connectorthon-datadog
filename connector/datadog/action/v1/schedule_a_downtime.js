module.exports = {

    name: "Schedule a downtime",

    title: "Schedule a downtime",

    version: "v1",

    description: ``,
    
    mock_input: {
        payload : {
        disabled: false,
        end: 1648644650,
        message: "Message on the downtime",
        monitor_id: "",
        parent_id: 123,
        recurrence: {
            period: 1,
            rrule: "FREQ=MONTHLY;BYSETPOS=3;BYDAY=WE;INTERVAL=1",
            type: "weeks",
            "until_date": "",
            "until_occurrences":"",
            week_days: [
                "Mon",
                "Tue"
            ]
        },
        scope: [
            "env:staging"
            ],
        start: 1648634650,
        timezone: "America/New_York"
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
                    "disabled": {
                        "title": "disabled",
                        "type": "boolean"
                    },
                    "end": {
                        "title": "end",
                        "type": "integer"
                    },
                    "message": {
                        "title": "message",
                        "type": "string"
                    },
                    "monitor_id": {
                        "title": "monitor_id",
                        "type": "integer"
                    },
                    "monitor_tags": {
                        "title": "monitor_tags",
                        "type": "array",
                        "items": {
                            "title": "monitor_tags",
                            "type": "string"
                        }
                    },
                    "parent_id": {
                        "title": "parent_id",
                        "type": "integer"
                    },
                    "recurrence": {
                        "title": "recurrence",
                        "type": "object",
                        "properties": {
                            "period": {
                                "title": "period",
                                "type": "integer"
                            },
                            "rrule": {
                                "title": "rrule",
                                "type": "string"
                            },
                            "type": {
                                "title": "type",
                                "type": "string"
                            },
                            "until_date": {
                                "title": "until_date",
                                "type": "integer"
                            },
                            "until_occurrences": {
                                "title": "until_occurrences",
                                "type": "integer"
                            },
                            "week_days": {
                                "title": "week_days",
                                "type": "array",
                                "items": {
                                    "title": "week_days",
                                    "type": "string"
                                }
                            }
                        }
                    },
                    "scope": {
                        "title": "scope",
                        "type": "array",
                        "items": {
                            "title": "scope",
                            "type": "string"
                        }
                    },
                    "start": {
                        "title": "start",
                        "type": "integer"
                    },
                    "timezone": {
                        "title": "timezone",
                        "type": "string"
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
        console.log(JSON.stringify(input.payload));
        input.payload = global_constants.remove_empty(input.payload);
        console.log(JSON.stringify(input.payload));
        var option = {
            "method": "POST",
            "headers": global_constants.generate_common_header(input),
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/downtime",
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