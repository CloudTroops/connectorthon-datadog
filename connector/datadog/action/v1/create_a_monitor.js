module.exports = {

    name: "Create a monitor",

    title: "Create a monitor",

    version: "v1",

    description: ``,
    
    mock_input: 
		{
  "name": "Example-Create_a_monitor_returns_OK_response",
  "type": "log alert",
  "query": "logs(\"service:foo AND type:error\").index(\"main\").rollup(\"count\").by(\"source\").last(\"5m\") > 2",
  "message": "some message Notify: @hipchat-channel",
  "tags": [
    "test:examplecreateamonitorreturnsokresponse",
    "env:ci"
  ],
  "priority": 3,
  "restricted_roles": [
    "string"
  ]
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
                    "message": {
                        "title": "message",
                        "type": "string"
                    },
                    "name": {
                        "title": "name",
                        "type": "string"
                    },
                    "options": {
                        "title": "options",
                        "type": "object",
                        "properties": {
                            "enable_logs_sample": {
                                "title": "enable_logs_sample",
                                "type": "boolean"
                            },
                            "escalation_message": {
                                "title": "escalation_message",
                                "type": "string"
                            },
                            "evaluation_delay": {
                                "title": "evaluation_delay",
                                "type": "integer"
                            },
                            "groupby_simple_monitor": {
                                "title": "groupby_simple_monitor",
                                "type": "boolean"
                            },
                            "include_tags": {
                                "title": "include_tags",
                                "type": "boolean"
                            },
                            "locked": {
                                "title": "locked",
                                "type": "boolean"
                            },
                            "min_failure_duration": {
                                "title": "min_failure_duration",
                                "type": "integer"
                            },
                            "min_location_failed": {
                                "title": "min_location_failed",
                                "type": "integer"
                            },
                            "new_group_delay": {
                                "title": "new_group_delay",
                                "type": "integer"
                            },
                            "new_host_delay": {
                                "title": "new_host_delay",
                                "type": "integer"
                            },
                            "no_data_timeframe": {
                                "title": "no_data_timeframe",
                                "type": "integer"
                            },
                            "notify_audit": {
                                "title": "notify_audit",
                                "type": "boolean"
                            },
                            "notify_no_data": {
                                "title": "notify_no_data",
                                "type": "boolean"
                            },
                            "renotify_interval": {
                                "title": "renotify_interval",
                                "type": "integer"
                            },
                            "renotify_occurrences": {
                                "title": "renotify_occurrences",
                                "type": "integer"
                            },
                            "renotify_statuses": {
                                "title": "renotify_statuses",
                                "type": "array",
                                "items": {
                                    "title":"renotify_statuses",
                                    "type": "string",
                                }
                            },
                            "require_full_window": {
                                "title": "require_full_window",
                                "type": "boolean"
                            },
                            "synthetics_check_id": {
                                "title": "synthetics_check_id",
                                "type": "string"
                            },
                            "threshold_windows": {
                                "title": "threshold_windows",
                                "type": "object",
                                "properties": {
                                    "recovery_window": {
                                        "title": "recovery_window",
                                        "type": "string"
                                    },
                                    "trigger_window": {
                                        "title": "trigger_window",
                                        "type": "string"
                                    }
                                }
                            },
                            "thresholds": {
                                "title": "thresholds",
                                "type": "object",
                                "properties": {
                                    "critical": {
                                        "title": "critical",
                                        "type": "number"
                                    },
                                    "critical_recovery": {
                                        "title": "critical_recovery",
                                        "type": "number"
                                    },
                                    "ok": {
                                        "title": "ok",
                                        "type": "number"
                                    },
                                    "warning": {
                                        "title": "warning",
                                        "type": "number"
                                    },
                                    "warning_recovery": {
                                        "title": "warning_recovery",
                                        "type": "number"
                                    }
                                }
                            },
                            "timeout_h": {
                                "title": "timeout_h",
                                "type": "integer"
                            }
                        }
                    },
                    "priority": {
                        "title": "priority",
                        "type": "integer"
                    },
                    "query": {
                        "title": "query",
                        "type": "string",
                        "minLength": 1
                    },
                    "restricted_roles": {
                        "title": "restricted_roles",
                        "type": "array",
                        "items": {
                            "title":"restricted_roles",
                            "type": "string",
                        }
                    },
                    "tags": {
                        "title": "tags",
                        "type": "array",
                        "items": {
                            "title":"tags",
                            "type": "string",
                        }
                    },
                    "type": {
                        "title": "type",
                        "type": "string",
                        "enum": [
                            "composite",
                            "event alert",
                            "log alert",
                            "metric alert",
                            "process alert",
                            "query alert",
                            "rum alert",
                            "service check",
                            "synthetics alert",
                            "trace-analytics alert",
                            "slo alert",
                            "event-v2 alert",
                            "audit alert",
                            "ci-pipelines alert"
                        ],
                        "minLength": 1
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
        input.payload = global_constants.remove_empty(input.payload);
        var option = {
            "method": "POST",
            "headers": global_constants.generate_common_header(input),
            "json": input.payload,            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/monitor",
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