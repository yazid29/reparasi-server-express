const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const ticketSchema = new mongoose.Schema(
    {
        title: {type:String, required:true},
        desc: {type:String, required:true},
        isFixed: {type:Boolean, default:false},
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
    },
    {
        timestamps:true
    }
);

ticketSchema.plugin(AutoIncrement, {
    inc_field: "ticket",
    id: "ticketNums",
    start_seq: 1000,
})
module.exports = mongoose.model("Ticket", ticketSchema);