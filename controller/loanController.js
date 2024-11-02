import { Loan } from "../model/Loan.js";
export const loanController = async (req, res) => {
  try {
    const { amount, term,type,rate } = req.body;
    console.log(type,rate);
    if (!amount || !term) {
      return res.status(400).send({
        success: false,
        message: "Please enter all fields",
      });
    }
    const newLoan = await Loan.create({
      userId: req.user._id,
      amount,
      term,
      type,
      rate,
      status: "pending",
    });

    const startDate = new Date();
    const newTerm=12*term;
    for (let i = 0; i < newTerm; i++) {
      const date = new Date(startDate);
      // date.setFullYear(date.getFullYear() + (i + 1));  
      date.setMonth(date.getMonth() + (i + 1));
      const repaymentAmount = amount / newTerm;
      newLoan.repayments.push({ amount: repaymentAmount, date });
    }
    

    await newLoan.save();
    console.log(newLoan)
    res.status(201).send({
      success: true,
      message: "request send to admin",
      loan: newLoan,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const loanApprovedController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id, status);
    const loan = await Loan.findById(id).populate("userId");
    if (!loan) {
      return res
        .status(404)
        .send({ success: false, message: "Loan not found" });
    }
    loan.status = status;
    await loan.save();
    res.status(201).send({ success: true, message: "Status is updated", loan });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      e,
    });
  }
};
export const repaymentController = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findById(id).populate("userId");
    if (!loan) {
      return res
        .status(404)
        .send({ success: false, message: "Loan not found" });
    }

    const latestRepayment = loan.repayments.find(
      (repayment) => repayment.status === "pending"
    );
    if (!latestRepayment) {
      return res
        .status(400)
        .json({ success: false, message: "All repayments have been paid" });
    }

    latestRepayment.status = "paid";
    await loan.save();
    res.status(200).send({
      success: true,
      message: "Repayment added successfully",
      latestRepayment,
      loan,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      e,
    });
  }
};

export const loanStackController = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user?._id }).populate("userId");
    
    if (loans.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No loans found for this user",
      });
    }
    res.status(200).send({
      success: true,
      message: "Loans fetched successfully",
      loans,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const loanGetController = async (req, res) => {
  try {
    const loans = await Loan.find({}).populate("userId");
    // console.log(loans);
    if (loans.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No loans found for this user",
      });
    }
    res.status(200).send({
      success: true,
      message: "Loans fetched successfully",
      loans,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};
