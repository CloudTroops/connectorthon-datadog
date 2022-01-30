module.exports = {

    name: "Schedule a downtime",

    title: "Schedule a downtime",

    version: "v1",

    description: ``,

    mock_input:
       {"payload": { "message": "Example-Schedule_a_downtime_returns_OK_response", "start": 1643560007, "timezone": "Etc/UTC", "scope": ["env:staging"], "recurrence": { "type": "weeks", "period": 1, "week_days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "until_date": 1643800007 } }},


    input:
        { title: "Input", type: "object", properties: { "payload": { "title": "payload", "type": "object", "properties": { "disabled": { "title": "disabled", "type": "boolean", }, "end": { "title": "end", "type": "integer", }, "message": { "title": "message", "type": "string", }, 
        "monitor_id": { "title": "monitor_id", "type": "integer" }
        , "monitor_tags": { "title": "monitor_tags", "type": "array", "items": { "type": "object", "properties": { "monitor_tags": { "title": "monitor_tags", "type": "string", } } } }, "parent_id": { "title": "parent_id", "type": "integer", }, "recurrence": { "title": "recurrence", "type": "object", "properties": { "period": { "title": "period", "type": "integer", }, "rrule": { "title": "rrule", "type": "string", }, "type": { "title": "type", "type": "string", }, "until_date": { "title": "until_date", "type": "integer", }, "until_occurrences": { "title": "until_occurrences", "type": "integer", }, "week_days": { "title": "week_days", "type": "array", "items": { "type": "object", "properties": { "week_days": { "title": "week_days", "type": "string", } } } }, } }, "scope": { "title": "scope", "type": "array", "items": { "type": "object", "properties": { "scope": { "title": "scope", "type": "string", } } } }, "start": { "title": "start", "type": "integer", }, "timezone": { "title": "timezone", "type": "string", }, } }, } },


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

    execute: function (input, output) {
        var global_constants = require("../../common/constants");
        var api_domain = "api";
        var request = require("request");
        var option = {
            "method": "POST",
            "headers": global_constants.generate_common_header(input),
            "json": input.payload, "url": global_constants.get_uri(input.auth.site, api_domain) + "/api/v1/downtime",
            "qs": {}
        }
        console.log("Request " + input.payload)
        request(option, function (error, response, body) {
            if (error) {
                console.log("Failed 1")
                output(error);
            }
            if (response.statusCode === 200) {
                console.log("Success 1")
                output(null, body);
            }
            else {
                if (body) {
                    console.log("Failed 2" + JSON.stringify(body))
                    output(body, null)
                }
                else {
                    console.log("Failed 3")
                    output(`{"status": false,"statusMessage": ${response.statusMessage}}`, null)
                }
            }
        });
    }
}