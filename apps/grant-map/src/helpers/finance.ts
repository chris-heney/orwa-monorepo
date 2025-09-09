import IGrantApplication from "../types/IGrantApplication"

export const getBalance = (currentApplication: IGrantApplication) => {
  
    const totalPaid = currentApplication.payouts.data.reduce((acc: number, payout) => acc + payout.amount, 0)

    let payoutBalance = currentApplication.award_amount - totalPaid
  
    // Check if payoutBalance is NaN, then set it to 0
    if (isNaN(payoutBalance)) {
      payoutBalance = 0
    }
  
    return payoutBalance
}

export const totalPaid = (currentApplication: IGrantApplication) => {
    if (!currentApplication.payouts) return 0
    return currentApplication.payouts.data.reduce((acc: number, payout) => acc + payout.amount, 0)
}