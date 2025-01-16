const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Expense", ExpenseSchema);
