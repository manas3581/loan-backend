import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  term: Number,
  rate: Number,
  type: String,
  repayments: [
    {
      amount: Number,
    
      rate: Number,
      date: Date,
      status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
    },
  ],
  status: {
    type: String,
    enum: ["not", "pending", "approved", "rejected"],
    default: "not",
  },
});

export const Loan = mongoose.model("Loan", loanSchema);
