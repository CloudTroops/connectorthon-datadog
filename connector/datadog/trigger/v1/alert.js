module.exports = {

  name: "alert",

  label: "Alert",

  version: "v1",

  input: {
    type: "object",
    title: "Alert",
    description: "Trigger to receive alerts from Datadog",
    properties: {
      event: {
        type: "string",
        enum: ["alert"]
      },
      polling: {
        type: "boolean",
        default: false,
        options: {
          hidden: true
        }
      },
      webhook_name : {
        type: "string",
        minLength: 1,
        title: "Webhook Name"
      },
      webhook_template : {
        type: "string",
        minLength: 1,
        title :"Payload Template",
        format :"textarea"
      },
    }
  },

  output: {
    "alert": {
      type: "object",
      properties: {
        type: "string",
        title: "payload"
      }
    }
  },

  mock_data: {}, // output of trigger data

  mock_input: {},

  execute: function (input, payload, output) {
    // will be invoked when the event is triggered
    // to access auth info use input.auth , eg: input.auth.username
    // and to return output use output callback like this output(null, [{ mykey : 'key', value : 'My Val'}])
    // output should be an array of objects or an empty array.

    // your code goes here

    return output(null, payload);

  },

  register: function (input, output) {
    // function will be used for registering webhook with services additional key
    // 'webhook' along with input data will be available here so you can access the input.webhook
    // for registering the webhook
    var global_constants = require("../../common/constants");
        var api_domain = "api";
        var request = require("request");
        var option = {
            "method": "POST",
            "headers": global_constants.generate_common_header(input),
            "json": {
                encode_as: "json",
                name : input.webhook_name,
                payload: input.webhook_template,
                url : input.webhook
            },
            "url": global_constants.get_uri(input.auth.site,api_domain)+"/api/v1/integration/webhooks/configuration/webhooks",
        }
        request(option, function(error, response, body) {
          if (error) {
            return output("Error creating connector "+error);
          }
          if (response.statusCode == 201) {
              body.webhook_name = option.json.name;
              return output(null, body);
          }
          else if (response.statusCode == 400){
            if(body) {
              return output("Error creating webhook, possible duplicate: "+JSON.stringify(body));
            }
            else {
              return output(`Error creating webhook, possible duplicate: ${response.statusMessage}`);
            }
          }
          else {
            if(body) {
              return output("Error creating webhook: "+JSON.stringify(body));
            }
            else {
              return output(`Error creating webhook: ${response.statusMessage}`);
            }
          }
      });
  },

  unregister: function (input, options, output) {
    // will be invoked when user deletes the trigger for unregistering the webhook
    // webhook id will be available in input.webhookId

    var global_constants = require("../../common/constants");
        var api_domain = "api";
        var request = require("request");
        var option = {
            "method": "DELETE",
            "headers": global_constants.generate_common_header(input),
            "json": {
            },
            "url": global_constants.get_uri(input.auth.site,api_domain)+`/api/v1/integration/webhooks/configuration/webhooks/${input.hook_response.webhook_name}`,
        }
        request(option, function(error, response, body) {
          if (error) {
            return output(error);
          }
          if (response.statusCode == 200) {
              return output(null, body);
          }
          else if (response.statusCode == 404){
            return output(null, {
              "message": "Webhook not found in Datadog!!"
            });
          }
          else {
            return output(`Error removing webhook: ${response.statusMessage}`);
          }
      });
  },

  activate: function (input, options, output) {
    // this function will be called whenever user activate or reactivates flow
    // to access auth info use input.auth , eg: input.auth.username
    // you can use this function to reset your cursor or timestamp

    // your code goes here

    output(null, true);
  },

  update: function (input, output) {
    // Use this function for service which don't allow to register more than two webhook
    // for same resource
    // NOTE: Do not edit this function if not necessary
    var global_constants = require("../../common/constants");
        var api_domain = "api";
        var request = require("request");
        var option = {
            "method": "PUT",
            "headers": global_constants.generate_common_header(input),
            "json": {
                encode_as: "json",
                name : input.webhook_name,
                payload: input.webhook_template,
                url : input.webhook
            },
            "url": global_constants.get_uri(input.auth.site,api_domain)+`/api/v1/integration/webhooks/configuration/webhooks/${input.webhook_name}`,
        }
        request(option, function(error, response, body) {
          if (error) {
            return output(error);
          }
          if (response.statusCode == 200) {
              return output(null, []);
          }
          else if (response.statusCode == 404){
            return output(null, {
              "message": "Webhook not found in Datadog!!"
            });
          }
          else {
            return output(`Error updating webhook: ${response.statusMessage}`);
          }
      });
    //return output(null, [ ]);
  }
}
