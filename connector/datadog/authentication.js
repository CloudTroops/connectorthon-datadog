module.exports = {
	label: "Connect to Datadog",
	mock_input: {
		"api_key": "XX",
  		"app_key": "XX",
  		"site": "XX"
	},
	input: {
		type: "object",
		properties: {
			api_key: {
				type: "string",
				minLength: 1,
				title: "API Key",
			},
			app_key: {
				type: "string",
				minLength: 0,
				title: "Application Key",
			},
			site: {
				type: "string",
				enum: ["US", "US3", "US5", "EU", "US1FED"],
				minLength: 1,
				title: "Data Dog SaaS Site",
			},
		},
	},
	validate: function (input, output) {
		// auth data will be available in input.auth
		// like var username = input.auth.username
		// callback pattern
		// output(error, success)
		var global_constants = require("./common/constants");
		var api_domain = "api"
		var request = require("request");
		var option = {
			"method": "GET",
			"headers": global_constants.generate_common_header(input),
			"url": global_constants.get_uri(input.auth.site, api_domain) + "/api/v1/validate",
			"qs": {}
		}
		//console.log("Sending Auth Request "+option.url);
		request(option, function (error, response, body) {
			if (error) {
				output(error, null);
			}
			if (response.statusCode != 200) {
				output(response.body, null)
			} else {
				output(null, 'Successfully authenticated')
			}
		});
	}
}