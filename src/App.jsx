import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Calculator, Home, DollarSign, TrendingUp, Users, Banknote, AlertTriangle } from 'lucide-react'
import './App.css'

function App() {
  const [housePrice, setHousePrice] = useState(12500000)
  const [borisCash, setBorisCash] = useState(500000)
  const [christineCash, setChristineCash] = useState(700000)
  const [flatSalePrice, setFlatSalePrice] = useState(3000000)
  const [totalExistingMortgage, setTotalExistingMortgage] = useState(1500000)
  const [borisExistingMortgage, setBorisExistingMortgage] = useState(900000)
  const [christineExistingMortgage, setChristineExistingMortgage] = useState(600000)
  const [borisFlatShare, setBorisFlatShare] = useState(60)
  const [christineFlatShare, setChristineFlatShare] = useState(40)
  const [borisContribution, setBorisContribution] = useState(0)
  const [christineContribution, setChristineContribution] = useState(0)
  const [borisHouseShare, setBorisHouseShare] = useState(50)
  const [christineHouseShare, setChristineHouseShare] = useState(50)
  const [grantedLoan, setGrantedLoan] = useState(8256000)
  const [interestRate, setInterestRate] = useState(5.13)
  const [loanTerm, setLoanTerm] = useState(30)
  const [hasRentalUnit, setHasRentalUnit] = useState(true)
  const [rentalIncome, setRentalIncome] = useState(15000)

  const [calculations, setCalculations] = useState({
    borisGrossShare: 0,
    christineGrossShare: 0,
    borisNetProceeds: 0,
    christineNetProceeds: 0,
    totalNetProceeds: 0,
    borisMaxContribution: 0,
    christineMaxContribution: 0,
    totalContribution: 0,
    borisHouseValue: 0,
    christineHouseValue: 0,
    borisLoanNeed: 0,
    christineLoanNeed: 0,
    totalLoanNeeded: 0,
    borisMonthlyPayment: 0,
    christineMonthlyPayment: 0,
    borisRentalShare: 0,
    christineRentalShare: 0,
    borisFinalPayment: 0,
    christineFinalPayment: 0,
    totalMonthlyPayment: 0,
    borisAvailableCash: 0,
    christineAvailableCash: 0,
    totalAvailableCash: 0,
    borisFirstInterest: 0,
    christineFirstInterest: 0,
    mortgageValidation: 0,
    houseShareValidation: 0
  })

  // PMT function that matches Excel's PMT
  const calculatePMT = (rate, nper, pv) => {
    if (rate === 0) {
      return pv / nper
    }
    return pv * (rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1)
  }

  // IPMT function for first payment interest
  const calculateIPMT = (rate, pv) => {
    return pv * rate
  }

  useEffect(() => {
    // Normalize flat share percentages
    const totalFlatShare = borisFlatShare + christineFlatShare
    const normalizedBorisShare = totalFlatShare > 0 ? borisFlatShare / totalFlatShare : 0.5
    const normalizedChristineShare = totalFlatShare > 0 ? christineFlatShare / totalFlatShare : 0.5

    // Calculate gross shares of flat sale
    const borisGrossShare = flatSalePrice * normalizedBorisShare
    const christineGrossShare = flatSalePrice * normalizedChristineShare
    
    // Calculate net proceeds after paying individual mortgage shares
    const borisNetProceeds = borisGrossShare - borisExistingMortgage
    const christineNetProceeds = christineGrossShare - christineExistingMortgage
    const totalNetProceeds = borisNetProceeds + christineNetProceeds
    
    // Calculate maximum possible contributions (cash + net flat proceeds)
    const borisMaxContribution = borisCash + borisNetProceeds
    const christineMaxContribution = christineCash + christineNetProceeds
    
    // Set default contributions if not manually set
    const actualBorisContribution = borisContribution || borisMaxContribution
    const actualChristineContribution = christineContribution || christineMaxContribution
    
    const totalContribution = actualBorisContribution + actualChristineContribution
    
    // Normalize house share percentages
    const totalHouseShare = borisHouseShare + christineHouseShare
    const normalizedBorisHouseShare = totalHouseShare > 0 ? borisHouseShare / totalHouseShare : 0.5
    const normalizedChristineHouseShare = totalHouseShare > 0 ? christineHouseShare / totalHouseShare : 0.5

    // Calculate individual house values based on ownership split
    const borisHouseValue = housePrice * normalizedBorisHouseShare
    const christineHouseValue = housePrice * normalizedChristineHouseShare
    
    // CORRECT LOGIC: Individual loan need = House share - Individual contribution
    const borisLoanNeed = Math.max(0, borisHouseValue - actualBorisContribution)
    const christineLoanNeed = Math.max(0, christineHouseValue - actualChristineContribution)
    const totalLoanNeeded = borisLoanNeed + christineLoanNeed
    
    // Calculate monthly payments using PMT formula
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    
    const borisMonthlyPayment = borisLoanNeed > 0 ? calculatePMT(monthlyInterestRate, numberOfPayments, borisLoanNeed) : 0
    const christineMonthlyPayment = christineLoanNeed > 0 ? calculatePMT(monthlyInterestRate, numberOfPayments, christineLoanNeed) : 0
    
    // Calculate rental income shares
    const borisRentalShare = hasRentalUnit ? rentalIncome * normalizedBorisShare : 0
    const christineRentalShare = hasRentalUnit ? rentalIncome * normalizedChristineShare : 0
    
    // Calculate final payments after rental income
    const borisFinalPayment = borisMonthlyPayment - borisRentalShare
    const christineFinalPayment = christineMonthlyPayment - christineRentalShare
    const totalMonthlyPayment = borisFinalPayment + christineFinalPayment

    // Calculate available cash after contributions
    const borisAvailableCash = borisMaxContribution - actualBorisContribution
    const christineAvailableCash = christineMaxContribution - actualChristineContribution
    const totalAvailableCash = borisAvailableCash + christineAvailableCash

    // Calculate first month interest (IPMT)
    const borisFirstInterest = borisLoanNeed > 0 ? calculateIPMT(monthlyInterestRate, borisLoanNeed) : 0
    const christineFirstInterest = christineLoanNeed > 0 ? calculateIPMT(monthlyInterestRate, christineLoanNeed) : 0

    // Validations
    const mortgageValidation = totalExistingMortgage - (borisExistingMortgage + christineExistingMortgage)
    const houseShareValidation = (borisHouseShare + christineHouseShare) - 100

    setCalculations({
      borisGrossShare,
      christineGrossShare,
      borisNetProceeds,
      christineNetProceeds,
      totalNetProceeds,
      borisMaxContribution,
      christineMaxContribution,
      totalContribution,
      borisHouseValue,
      christineHouseValue,
      borisLoanNeed,
      christineLoanNeed,
      totalLoanNeeded,
      borisMonthlyPayment,
      christineMonthlyPayment,
      borisRentalShare,
      christineRentalShare,
      borisFinalPayment,
      christineFinalPayment,
      totalMonthlyPayment,
      borisAvailableCash,
      christineAvailableCash,
      totalAvailableCash,
      borisFirstInterest,
      christineFirstInterest,
      mortgageValidation,
      houseShareValidation
    })

    // Auto-update contribution fields if they haven't been manually set
    if (!borisContribution) {
      setBorisContribution(borisMaxContribution)
    }
    if (!christineContribution) {
      setChristineContribution(christineMaxContribution)
    }
  }, [housePrice, borisCash, christineCash, flatSalePrice, totalExistingMortgage, borisExistingMortgage, christineExistingMortgage, borisFlatShare, christineFlatShare, borisContribution, christineContribution, borisHouseShare, christineHouseShare, grantedLoan, interestRate, loanTerm, hasRentalUnit, rentalIncome])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Mortgage Calculator</h1>
          </div>
          <p className="text-lg text-gray-600">Individual Payments for Boris & Christine</p>
          <p className="text-sm text-gray-500">With Correct Loan Distribution Logic</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  House Details
                </CardTitle>
                <CardDescription>Enter the house price and loan details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="housePrice">House Price (NOK)</Label>
                  <Input
                    id="housePrice"
                    type="number"
                    value={housePrice}
                    onChange={(e) => setHousePrice(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="grantedLoan">Granted Loan (NOK)</Label>
                  <Input
                    id="grantedLoan"
                    type="number"
                    value={grantedLoan}
                    onChange={(e) => setGrantedLoan(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Individual Cash
                </CardTitle>
                <CardDescription>Enter available cash for each person</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="borisCash">Boris's Cash (NOK)</Label>
                    <Input
                      id="borisCash"
                      type="number"
                      value={borisCash}
                      onChange={(e) => setBorisCash(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="christineCash">Christine's Cash (NOK)</Label>
                    <Input
                      id="christineCash"
                      type="number"
                      value={christineCash}
                      onChange={(e) => setChristineCash(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Current Flat Details
                </CardTitle>
                <CardDescription>Current flat sale and individual mortgage shares</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="flatSalePrice">Current Flat Sale Price (NOK)</Label>
                  <Input
                    id="flatSalePrice"
                    type="number"
                    value={flatSalePrice}
                    onChange={(e) => setFlatSalePrice(Number(e.target.value))}
                    className="mt-1"
                    placeholder="Enter expected sale price"
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalExistingMortgage">Total Existing Flat Mortgage (NOK)</Label>
                  <Input
                    id="totalExistingMortgage"
                    type="number"
                    value={totalExistingMortgage}
                    onChange={(e) => setTotalExistingMortgage(Number(e.target.value))}
                    className="mt-1"
                    placeholder="Total amount still owed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="borisExistingMortgage">Boris's Mortgage Share (NOK)</Label>
                    <Input
                      id="borisExistingMortgage"
                      type="number"
                      value={borisExistingMortgage}
                      onChange={(e) => setBorisExistingMortgage(Number(e.target.value))}
                      className="mt-1 bg-red-50 border-red-200"
                      placeholder="Boris's share of mortgage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="christineExistingMortgage">Christine's Mortgage Share (NOK)</Label>
                    <Input
                      id="christineExistingMortgage"
                      type="number"
                      value={christineExistingMortgage}
                      onChange={(e) => setChristineExistingMortgage(Number(e.target.value))}
                      className="mt-1 bg-red-50 border-red-200"
                      placeholder="Christine's share of mortgage"
                    />
                  </div>
                </div>

                {Math.abs(calculations.mortgageValidation) > 1 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-yellow-800 font-medium text-sm">Mortgage Share Mismatch</p>
                    </div>
                    <p className="text-yellow-700 text-xs mt-1">
                      Individual shares ({formatCurrency(borisExistingMortgage + christineExistingMortgage)}) 
                      don't match total ({formatCurrency(totalExistingMortgage)})
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="borisFlatShare">Boris's Flat Sale Share (%)</Label>
                    <Input
                      id="borisFlatShare"
                      type="number"
                      step="0.1"
                      value={borisFlatShare}
                      onChange={(e) => setBorisFlatShare(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="christineFlatShare">Christine's Flat Sale Share (%)</Label>
                    <Input
                      id="christineFlatShare"
                      type="number"
                      step="0.1"
                      value={christineFlatShare}
                      onChange={(e) => setChristineFlatShare(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Boris's Net Proceeds</p>
                    <p className="text-lg font-bold text-blue-800">{formatCurrency(calculations.borisNetProceeds)}</p>
                    <p className="text-xs text-blue-600">
                      {formatCurrency(calculations.borisGrossShare)} - {formatCurrency(borisExistingMortgage)}
                    </p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-600 font-medium">Christine's Net Proceeds</p>
                    <p className="text-lg font-bold text-pink-800">{formatCurrency(calculations.christineNetProceeds)}</p>
                    <p className="text-xs text-pink-600">
                      {formatCurrency(calculations.christineGrossShare)} - {formatCurrency(christineExistingMortgage)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Contributions to New Mortgage
                </CardTitle>
                <CardDescription>Editable - how much each person contributes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="borisContribution">Boris's Contribution (NOK)</Label>
                  <Input
                    id="borisContribution"
                    type="number"
                    value={borisContribution}
                    onChange={(e) => setBorisContribution(Number(e.target.value))}
                    className="mt-1 bg-orange-50 border-orange-200"
                    placeholder={`Max: ${formatCurrency(calculations.borisMaxContribution)}`}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Max available: {formatCurrency(calculations.borisMaxContribution)} 
                    (Cash: {formatCurrency(borisCash)} + Net Flat: {formatCurrency(calculations.borisNetProceeds)})
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="christineContribution">Christine's Contribution (NOK)</Label>
                  <Input
                    id="christineContribution"
                    type="number"
                    value={christineContribution}
                    onChange={(e) => setChristineContribution(Number(e.target.value))}
                    className="mt-1 bg-orange-50 border-orange-200"
                    placeholder={`Max: ${formatCurrency(calculations.christineMaxContribution)}`}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Max available: {formatCurrency(calculations.christineMaxContribution)} 
                    (Cash: {formatCurrency(christineCash)} + Net Flat: {formatCurrency(calculations.christineNetProceeds)})
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Contribution</p>
                  <p className="text-xl font-bold text-blue-800">{formatCurrency(calculations.totalContribution)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>House Ownership Split</CardTitle>
                <CardDescription>How will house ownership be split?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="borisHouseShare">Boris's Ownership (%)</Label>
                    <Input
                      id="borisHouseShare"
                      type="number"
                      step="0.1"
                      value={borisHouseShare}
                      onChange={(e) => setBorisHouseShare(Number(e.target.value))}
                      className="mt-1 bg-blue-50 border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="christineHouseShare">Christine's Ownership (%)</Label>
                    <Input
                      id="christineHouseShare"
                      type="number"
                      step="0.1"
                      value={christineHouseShare}
                      onChange={(e) => setChristineHouseShare(Number(e.target.value))}
                      className="mt-1 bg-blue-50 border-blue-200"
                    />
                  </div>
                </div>
                {Math.abs(calculations.houseShareValidation) > 0.1 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-yellow-800 font-medium text-sm">Ownership Split Mismatch</p>
                    </div>
                    <p className="text-yellow-700 text-xs mt-1">
                      Ownership percentages ({formatPercentage(borisHouseShare + christineHouseShare)}) 
                      do not add up to 100%
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Boris's House Value</p>
                    <p className="text-lg font-bold text-blue-800">{formatCurrency(calculations.borisHouseValue)}</p>
                    <p className="text-xs text-blue-600">
                      {formatPercentage(borisHouseShare)} of {formatCurrency(housePrice)}
                    </p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-600 font-medium">Christine's House Value</p>
                    <p className="text-lg font-bold text-pink-800">{formatCurrency(calculations.christineHouseValue)}</p>
                    <p className="text-xs text-pink-600">
                      {formatPercentage(christineHouseShare)} of {formatCurrency(housePrice)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Unit</CardTitle>
                <CardDescription>Will the house have a rental unit?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasRentalUnit"
                    checked={hasRentalUnit}
                    onCheckedChange={setHasRentalUnit}
                  />
                  <Label htmlFor="hasRentalUnit">House has rental unit</Label>
                </div>
                {hasRentalUnit && (
                  <div>
                    <Label htmlFor="rentalIncome">Monthly Rental Income (NOK)</Label>
                    <Input
                      id="rentalIncome"
                      type="number"
                      value={rentalIncome}
                      onChange={(e) => setRentalIncome(Number(e.target.value))}
                      className="mt-1"
                      placeholder="Enter monthly rental income"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Individual Results Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Boris's Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  {formatCurrency(calculations.borisFinalPayment)}
                </div>
                <p className="text-blue-600 text-sm">
                  {hasRentalUnit ? 
                    `PMT: ${formatCurrency(calculations.borisMonthlyPayment)} - Rental: ${formatCurrency(calculations.borisRentalShare)}` : 
                    'Monthly mortgage payment (PMT)'
                  }
                </p>
                <p className="text-blue-500 text-xs mt-1">
                  Loan Need: {formatCurrency(calculations.borisLoanNeed)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-800">Christine's Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-700 mb-2">
                  {formatCurrency(calculations.christineFinalPayment)}
                </div>
                <p className="text-pink-600 text-sm">
                  {hasRentalUnit ? 
                    `PMT: ${formatCurrency(calculations.christineMonthlyPayment)} - Rental: ${formatCurrency(calculations.christineRentalShare)}` : 
                    'Monthly mortgage payment (PMT)'
                  }
                </p>
                <p className="text-pink-500 text-xs mt-1">
                  Loan Need: {formatCurrency(calculations.christineLoanNeed)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="h-5 w-5" />
                  Total Monthly Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-700 mb-2">
                  {formatCurrency(calculations.totalMonthlyPayment)}
                </div>
                <p className="text-green-600">Combined monthly payment</p>
                <p className="text-green-500 text-xs mt-1">
                  Base PMT: {formatCurrency(calculations.borisMonthlyPayment + calculations.christineMonthlyPayment)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Need Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Boris's Loan Need</p>
                    <p className="text-xl font-bold text-blue-800">{formatCurrency(calculations.borisLoanNeed)}</p>
                    <p className="text-xs text-blue-600">
                      House: {formatCurrency(calculations.borisHouseValue)} - Contribution: {formatCurrency(borisContribution)}
                    </p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-600 font-medium">Christine's Loan Need</p>
                    <p className="text-xl font-bold text-pink-800">{formatCurrency(calculations.christineLoanNeed)}</p>
                    <p className="text-xs text-pink-600">
                      House: {formatCurrency(calculations.christineHouseValue)} - Contribution: {formatCurrency(christineContribution)}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Total Loan Needed</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(calculations.totalLoanNeeded)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Cash After Contributions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Boris's Cash Left</p>
                    <p className="text-xl font-bold text-blue-800">{formatCurrency(calculations.borisAvailableCash)}</p>
                    <p className="text-xs text-blue-600">Available - Contributed</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-600 font-medium">Christine's Cash Left</p>
                    <p className="text-xl font-bold text-pink-800">{formatCurrency(calculations.christineAvailableCash)}</p>
                    <p className="text-xs text-pink-600">Available - Contributed</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Total Cash Kept</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(calculations.totalAvailableCash)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First Month Breakdown (IPMT)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600 font-medium">Boris</p>
                    <p>Interest: {formatCurrency(calculations.borisFirstInterest)}</p>
                    <p>Principal: {formatCurrency(calculations.borisMonthlyPayment - calculations.borisFirstInterest)}</p>
                  </div>
                  <div>
                    <p className="text-pink-600 font-medium">Christine</p>
                    <p>Interest: {formatCurrency(calculations.christineFirstInterest)}</p>
                    <p>Principal: {formatCurrency(calculations.christineMonthlyPayment - calculations.christineFirstInterest)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">Total Contribution</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(calculations.totalContribution)}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Total Loan Needed</p>
                    <p className="text-2xl font-bold text-orange-800">{formatCurrency(calculations.totalLoanNeeded)}</p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">House Price:</span>
                    <span className="font-semibold">{formatCurrency(housePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flat Sale (Gross):</span>
                    <span className="font-semibold">{formatCurrency(flatSalePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Existing Mortgage:</span>
                    <span className="font-semibold">{formatCurrency(totalExistingMortgage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Proceeds from Flat:</span>
                    <span className="font-semibold">{formatCurrency(calculations.totalNetProceeds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cash Available:</span>
                    <span className="font-semibold">{formatCurrency(borisCash + christineCash + calculations.totalNetProceeds)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total Loan Needed:</span>
                    <span className="font-semibold">{formatCurrency(calculations.totalLoanNeeded)}</span>
                  </div>
                </div>

                {calculations.totalLoanNeeded > grantedLoan && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">⚠️ Warning</p>
                    <p className="text-red-700 text-sm">
                      You need {formatCurrency(calculations.totalLoanNeeded)} but only have {formatCurrency(grantedLoan)} approved. 
                      You need an additional {formatCurrency(calculations.totalLoanNeeded - grantedLoan)} in cash or a larger loan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculation Logic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-2">✅ CORRECT LOGIC:</p>
                  <p className="mb-1">• House ownership split determines individual house values</p>
                  <p className="mb-1">• Individual loan need = House value - Individual contribution</p>
                  <p className="mb-1">• Higher contribution = Lower loan need</p>
                  <p>• Monthly payments based on individual loan needs</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Boris contributes:</span>
                    <span className="font-semibold">{formatCurrency(borisContribution)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Christine contributes:</span>
                    <span className="font-semibold">{formatCurrency(christineContribution)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Boris needs loan:</span>
                    <span className="font-semibold">{formatCurrency(calculations.borisLoanNeed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Christine needs loan:</span>
                    <span className="font-semibold">{formatCurrency(calculations.christineLoanNeed)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Term:</span>
                  <span className="font-semibold">{loanTerm} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payments:</span>
                  <span className="font-semibold">{formatCurrency(calculations.totalMonthlyPayment * loanTerm * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold">{formatCurrency((calculations.borisMonthlyPayment + calculations.christineMonthlyPayment) * loanTerm * 12 - calculations.totalLoanNeeded)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

