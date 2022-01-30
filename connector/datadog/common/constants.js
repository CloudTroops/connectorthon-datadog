module.exports = {
    BASE : "DATA_DOG_SITE_BASE_",
    DATA_DOG_SITE_BASE_US : "datadoghq.com",
    DATA_DOG_SITE_BASE_US3 : "us3.datadoghq.com",
    DATA_DOG_SITE_BASE_EU : "datadoghq.eu",
    DATA_DOG_SITE_BASE_US5 : "us5.datadoghq.com",
    DATA_DOG_SITE_BASE_US1FED : "ddog-gov.com",
    get_uri: function(site, api_domain) {
        console.log("Sending Auth "+this[this.BASE+site])
        return "https://"+api_domain+"."+this[this.BASE+site];
    },
    generate_common_header: function(input) {
        var header = {};
        header['Content-Type'] = 'application/json';
        header['DD-API-KEY'] = input.auth.api_key;
        header['DD-APPLICATION-KEY'] = input.auth.app_key;
        return header;
    },
}