const Listing = require("../models/listening.js");

class ExpressError extends Error {
    constructor(statusCode , message){
        super();
        this.statusCode=statusCode;
        this.message=message;

    }

}
module.exports=ExpressError