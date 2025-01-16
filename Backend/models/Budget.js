// const mongoose = require('mongoose');

// const BudgetSchema = new mongoose.Schema(
//   {
//     id: { type: String }, // Facebook Campaign ID
//     name: { type: String }, // Campaign Name
//     daily_budget: { type: Number, required: false }, // Daily Budget (in smallest currency unit)
//     lifetime_budget: { type: Number, required: false }, // Lifetime Budget (in smallest currency unit)
//     status: { type: String }, // Campaign Status
//     start_time: { type: Date, required: false }, // Campaign Start Time
//     bid_strategy: { type: String, required: false }, // Bid Strategy
//     created_time: { type: Date }, // Campaign Creation Time
//     updated_time: { type: Date }, // Last Updated Time
//   },
//   { timestamps: true }
// );

// const Budget = mongoose.model('Budget', BudgetSchema);
// module.exports = Budget;

const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    created_time: { type: String },
    daily_budget: { type: String },
    lifetime_budget: { type: String },
    budget_remaining: { type: String },
    status: { type: String },
    adsets: [
        {
            id: { type: String },
            daily_budget: { type: Number },
            lifetime_budget: { type: Number },
            budget_remaining: { type: Number },
            status: { type: String },
            name: { type: String },
            insights: {
                data: [
                    {
                        spend: { type: Number },
                        date_start: { type: String },
                        date_stop: { type: String },
                    },
                ],
                paging: {
                    cursors: {
                        before: { type: String },
                        after: { type: String },
                    },
                },
            },
            campaign: {
                id: { type: String },
                name: { type: String },
                daily_budget: { type: String },
            },
            ads: {
                data: [
                    {
                        id: { type: String },
                        name: { type: String },
                    },
                ],
                paging: {
                    cursors: {
                        before: { type: String },
                        after: { type: String },
                    },
                },
            },
        },
    ],
});

module.exports = mongoose.model("Budget", BudgetSchema);
