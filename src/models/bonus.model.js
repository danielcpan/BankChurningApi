const mongoose = require('mongoose');

const BonusSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
    max: 255,
  },
  accountType: {
    type: String,
    enum: ['CHECKING', 'SAVINGS', 'INVESTMENT', 'CASHBACK_PORTAL', 'MONEY_MARKET', 'CD', 'OTHER'],
    default: null,
  },
  businessOrPersonal,
  description: {
    type: String,
  },
  url
  coverImage    
  cashBonus
  otherBonus
  expirationDate
  isDirectDepositRequired: directDepositRequired
  directDepositAmount
  directDepositQuantity
  savingsAmount
  savingsTimeRequirement
  otherRequirements
  hardPull
  waitForReward
  leaveAccountOpen
  monthlyFees
  monthlyFeeAmount
  howToAvoidMonthlyFees
  openOnline
  dateAdded
  debitCardPurchases
  billPayments
  review
  eligibility    
  locationAvailability
  recommended
  promoCode
  accountClosureFee
  chexsystems
  chexsystemsSensitive
  ccFundingLimit
  ccFundingCardTypes
  minimumOpeningDeposit
  acceptsOutOfStateApplicants
  newCustomersOnly

}, {
  timestamps: true,
});

BonusSchema.method({
  isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
  withoutPass() {
    const { password, ...userWithoutPass } = this.toJSON();
    return userWithoutPass;
  },
});

BonusSchema.static({
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  },
  isValidHash({ original, hash }) {
    return bcrypt.compareSync(original, hash);
  },
});

module.exports = mongoose.model('User', BonusSchema);
