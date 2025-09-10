import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Calculator, Home, DollarSign, TrendingUp, Users, Banknote, AlertTriangle, FileText, Loader2 } from 'lucide-react'
import { useLocalStorageState } from '@/hooks/useLocalStorage.js'
import './App.css'


function App() {
  // Property Status Report state
  const [propertyUrl, setPropertyUrl] = useState('')
  const [propertyResponse, setPropertyResponse] = useState('')
  const [isPropertyLoading, setIsPropertyLoading] = useState(false)

  // All form data with persistence
  const {
    housePrice, setHousePrice,
  finnkode, setFinnkode,
    personAName, setPersonAName,
    personBName, setPersonBName,
    personAColor, setPersonAColor,
    personBColor, setPersonBColor,
    personACash, setPersonACash,
    personBCash, setPersonBCash,
    flatSalePrice, setFlatSalePrice,
    personAExistingMortgage, setPersonAExistingMortgage,
    personBExistingMortgage, setPersonBExistingMortgage,
    personAFlatShare, setPersonAFlatShare,
    personBFlatShare, setPersonBFlatShare,
    personAContribution, setPersonAContribution,
    personBContribution, setPersonBContribution,
    personAHouseShare, setPersonAHouseShare,
    personBHouseShare, setPersonBHouseShare,
    grantedLoan, setGrantedLoan,
    interestRate, setInterestRate,
    loanTerm, setLoanTerm,
    hasRentalUnit, setHasRentalUnit,
    rentalIncome, setRentalIncome,
    currency, setCurrency,
    currentStep, setCurrentStep
  } = useLocalStorageState({
    housePrice: 1000000,
  finnkode: '',
    personAName: 'Person A',
    personBName: 'Person B',
    personAColor: '#2563eb', // default blue-600
    personBColor: '#db2777', // default pink-600
    personACash: 1000000,
    personBCash: 1000000,
    flatSalePrice: 0,
    personAExistingMortgage: 0,
    personBExistingMortgage: 0,
    personAFlatShare: 50,
    personBFlatShare: 50,
    personAContribution: 0,
    personBContribution: 0,
    personAHouseShare: 50,
    personBHouseShare: 50,
    grantedLoan: 5000000,
    interestRate: 5.13,
    loanTerm: 30,
    hasRentalUnit: false,
    rentalIncome: 0,
    currency: 'NOK',
    currentStep: 0
  })

  // Mobile stepper (only affects small screens)
  const inputSteps = [
    'Current Flat Details',
    'Individual Cash',
    'New House Details',
    'Contributions to New Mortgage',
    'Ownership Split',
    'Rental Unit'
  ]

  const [calculations, setCalculations] = useState({
    personAGrossShare: 0,
    personBGrossShare: 0,
    personANetProceeds: 0,
    personBNetProceeds: 0,
    totalNetProceeds: 0,
    personAMaxContribution: 0,
    personBMaxContribution: 0,
    totalContribution: 0,
    personAHouseValue: 0,
    personBHouseValue: 0,
    personALoanNeed: 0,
    personBLoanNeed: 0,
    totalLoanNeeded: 0,
    personAMonthlyPayment: 0,
    personBMonthlyPayment: 0,
    personARentalShare: 0,
    personBRentalShare: 0,
    personAFinalPayment: 0,
    personBFinalPayment: 0,
    totalMonthlyPayment: 0,
    personAAvailableCash: 0,
    personBAvailableCash: 0,
    totalAvailableCash: 0,
    personAFirstInterest: 0,
    personBFirstInterest: 0,
    mortgageValidation: 0,
    houseShareValidation: 0,
    totalExistingMortgage: 0
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

  const hexToRgba = (hex, alpha = 1) => {
    if (!hex) return `rgba(0,0,0,${alpha})`
    const normalized = hex.replace('#', '')
    const bigint = parseInt(normalized.length === 3
      ? normalized.split('').map((c) => c + c).join('')
      : normalized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  useEffect(() => {
    // Convert empty strings to 0 for calculations
    const housePriceNum = housePrice === '' ? 0 : Number(housePrice)
    const personACashNum = personACash === '' ? 0 : Number(personACash)
    const personBCashNum = personBCash === '' ? 0 : Number(personBCash)
    const flatSalePriceNum = flatSalePrice === '' ? 0 : Number(flatSalePrice)
    const personAExistingMortgageNum = personAExistingMortgage === '' ? 0 : Number(personAExistingMortgage)
    const personBExistingMortgageNum = personBExistingMortgage === '' ? 0 : Number(personBExistingMortgage)
    const personAFlatShareNum = personAFlatShare === '' ? 0 : Number(personAFlatShare)
    const personBFlatShareNum = personBFlatShare === '' ? 0 : Number(personBFlatShare)
    const personAContributionNum = personAContribution === '' ? 0 : Number(personAContribution)
    const personBContributionNum = personBContribution === '' ? 0 : Number(personBContribution)
    const personAHouseShareNum = personAHouseShare === '' ? 0 : Number(personAHouseShare)
    const personBHouseShareNum = personBHouseShare === '' ? 0 : Number(personBHouseShare)
    const interestRateNum = interestRate === '' ? 0 : Number(interestRate)
    const loanTermNum = loanTerm === '' ? 0 : Number(loanTerm)
    const rentalIncomeNum = rentalIncome === '' ? 0 : Number(rentalIncome)

    // Normalize flat share percentages
    const totalFlatShare = personAFlatShareNum + personBFlatShareNum
    const normalizedPersonAShare = totalFlatShare > 0 ? personAFlatShareNum / totalFlatShare : 0.5
    const normalizedPersonBShare = totalFlatShare > 0 ? personBFlatShareNum / totalFlatShare : 0.5

    // Calculate gross shares of flat sale
    const personAGrossShare = flatSalePriceNum * normalizedPersonAShare
    const personBGrossShare = flatSalePriceNum * normalizedPersonBShare

    // Calculate net proceeds after paying individual mortgage shares
    const personANetProceeds = personAGrossShare - personAExistingMortgageNum
    const personBNetProceeds = personBGrossShare - personBExistingMortgageNum
    const totalNetProceeds = personANetProceeds + personBNetProceeds

    // Calculate maximum possible contributions (cash + net flat proceeds)
    const personAMaxContribution = personACashNum + personANetProceeds
    const personBMaxContribution = personBCashNum + personBNetProceeds

    // Set default contributions if not manually set
    const actualPersonAContribution = personAContributionNum || personAMaxContribution
    const actualPersonBContribution = personBContributionNum || personBMaxContribution

    const totalContribution = actualPersonAContribution + actualPersonBContribution

    // Normalize house share percentages
    const totalHouseShare = personAHouseShareNum + personBHouseShareNum
    const normalizedPersonAHouseShare = totalHouseShare > 0 ? personAHouseShareNum / totalHouseShare : 0.5
    const normalizedPersonBHouseShare = totalHouseShare > 0 ? personBHouseShareNum / totalHouseShare : 0.5

    // Calculate individual house values based on ownership split
    const personAHouseValue = housePriceNum * normalizedPersonAHouseShare
    const personBHouseValue = housePriceNum * normalizedPersonBHouseShare

    // CORRECT LOGIC: Individual loan need = House share - Individual contribution
    const personALoanNeed = Math.max(0, personAHouseValue - actualPersonAContribution)
    const personBLoanNeed = Math.max(0, personBHouseValue - actualPersonBContribution)
    const totalLoanNeeded = personALoanNeed + personBLoanNeed

    // Calculate monthly payments using PMT formula
    const monthlyInterestRate = interestRateNum / 100 / 12
    const numberOfPayments = loanTermNum * 12

    const personAMonthlyPayment = personALoanNeed > 0 ? calculatePMT(monthlyInterestRate, numberOfPayments, personALoanNeed) : 0
    const personBMonthlyPayment = personBLoanNeed > 0 ? calculatePMT(monthlyInterestRate, numberOfPayments, personBLoanNeed) : 0

    // Calculate rental income shares
    const personARentalShare = hasRentalUnit ? rentalIncomeNum * normalizedPersonAShare : 0
    const personBRentalShare = hasRentalUnit ? rentalIncomeNum * normalizedPersonBShare : 0

    // Calculate final payments after rental income
    const personAFinalPayment = personAMonthlyPayment - personARentalShare
    const personBFinalPayment = personBMonthlyPayment - personBRentalShare
    const totalMonthlyPayment = personAFinalPayment + personBFinalPayment

    // Calculate available cash after contributions
    const personAAvailableCash = personAMaxContribution - actualPersonAContribution
    const personBAvailableCash = personBMaxContribution - actualPersonBContribution
    const totalAvailableCash = personAAvailableCash + personBAvailableCash

    // Calculate first month interest (IPMT)
    const personAFirstInterest = personALoanNeed > 0 ? calculateIPMT(monthlyInterestRate, personALoanNeed) : 0
    const personBFirstInterest = personBLoanNeed > 0 ? calculateIPMT(monthlyInterestRate, personBLoanNeed) : 0

    // Calculate total existing mortgage from individual shares
    const totalExistingMortgage = personAExistingMortgageNum + personBExistingMortgageNum

    // Validations
    const mortgageValidation = 0 // No longer needed since we calculate total from shares
    const houseShareValidation = (personAHouseShareNum + personBHouseShareNum) - 100

    setCalculations({
      personAGrossShare,
      personBGrossShare,
      personANetProceeds,
      personBNetProceeds,
      totalNetProceeds,
      personAMaxContribution,
      personBMaxContribution,
      totalContribution,
      personAHouseValue,
      personBHouseValue,
      personALoanNeed,
      personBLoanNeed,
      totalLoanNeeded,
      personAMonthlyPayment,
      personBMonthlyPayment,
      personARentalShare,
      personBRentalShare,
      personAFinalPayment,
      personBFinalPayment,
      totalMonthlyPayment,
      personAAvailableCash,
      personBAvailableCash,
      totalAvailableCash,
      personAFirstInterest,
      personBFirstInterest,
      mortgageValidation,
      houseShareValidation,
      totalExistingMortgage
    })

    // Auto-update contribution fields to always match Max available
    if (personAContributionNum !== personAMaxContribution) {
      setPersonAContribution(personAMaxContribution)
    }
    if (personBContributionNum !== personBMaxContribution) {
      setPersonBContribution(personBMaxContribution)
    }
  }, [housePrice, personACash, personBCash, flatSalePrice, personAExistingMortgage, personBExistingMortgage, personAFlatShare, personBFlatShare, personAContribution, personBContribution, personAHouseShare, personBHouseShare, grantedLoan, interestRate, loanTerm, hasRentalUnit, rentalIncome])

  const formatCurrency = (amount) => {
    const browserLocale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US'
    return new Intl.NumberFormat(browserLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`
  }

  const aName = (personAName || '').trim() || 'Person A'
  const bName = (personBName || '').trim() || 'Person B'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Mortgage Calculator</h1>
          </div>
          <p className="text-lg text-gray-600">Individual Payments for {aName} & {bName}</p>
          <p className="text-sm text-gray-500">With Correct Loan Distribution Logic</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOK">NOK — Norwegian Krone</SelectItem>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                  <SelectItem value="SEK">SEK — Swedish Krona</SelectItem>
                  <SelectItem value="DKK">DKK — Danish Krone</SelectItem>
                  <SelectItem value="CHF">CHF — Swiss Franc</SelectItem>
                  <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
                  <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Full-width Participants */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
              </CardTitle>
              <CardDescription>Set names and colors for personalization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personAName">{aName} Name</Label>
                  <Input
                    id="personAName"
                    type="text"
                    value={personAName}
                    onChange={(e) => setPersonAName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <Label htmlFor="personBName">{bName} Name</Label>
                  <Input
                    id="personBName"
                    type="text"
                    value={personBName}
                    onChange={(e) => setPersonBName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personAColor">{aName} Color</Label>
                  <Input
                    id="personAColor"
                    type="color"
                    value={personAColor}
                    onChange={(e) => setPersonAColor(e.target.value)}
                    className="mt-1 h-10 p-1"
                  />
                </div>
                <div>
                  <Label htmlFor="personBColor">{bName} Color</Label>
                  <Input
                    id="personBColor"
                    type="color"
                    value={personBColor}
                    onChange={(e) => setPersonBColor(e.target.value)}
                    className="mt-1 h-10 p-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
  {/* (Removed separate Property Status Report card - merged into New House Details) */}
        
        <div className="border-t border-gray-200 my-6" />


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Sections */}
          <div className="space-y-6">
            {/* Mobile stepper controls */}
            <div className="lg:hidden sticky top-0 z-10 -mx-4 px-4 py-3 bg-gradient-to-br from-blue-50/90 to-indigo-100/90 backdrop-blur">
              <div className="flex items-center justify-between">
                <button
                  className="text-sm px-3 py-1 rounded-md bg-white/70 border disabled:opacity-50"
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  disabled={currentStep === 0}
                >
                  Back
                </button>
                <div className="text-sm font-medium">
                  Step {currentStep + 1} of {inputSteps.length}
                </div>
                <button
                  className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white disabled:opacity-50"
                  onClick={() => setCurrentStep((s) => Math.min(inputSteps.length - 1, s + 1))}
                  disabled={currentStep === inputSteps.length - 1}
                >
                  Next
                </button>
              </div>
              <div className="mt-2 flex gap-1 justify-center">
                {inputSteps.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to step ${idx + 1}`}
                    className={`${currentStep === idx ? 'bg-blue-600' : 'bg-blue-300'} h-1.5 w-6 rounded-full`}
                    onClick={() => setCurrentStep(idx)}
                  />
                ))}
              </div>
            </div>
            {/* Section: New House Details */}
            <h2 className="text-sm font-semibold text-gray-700 px-1 flex items-center gap-2">
              <Home className="h-4 w-4 text-gray-500" /> New House Details
            </h2>
            <Card className={`${currentStep === 2 ? 'block' : 'hidden'} lg:block`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  House Details
                </CardTitle>
                <CardDescription>Enter the house price and loan details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Finnkode */}
                <div>
                  <Label htmlFor="finnkode">Finnkode</Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="finnkode"
                      type="text"
                      value={finnkode}
                      onChange={(e) => setFinnkode(e.target.value)}
                      placeholder="Enter Finn code"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={!finnkode}
                      onClick={async () => {
                        if (!finnkode) return
                        const url = `https://pyfinn-git-vercelready-mocialovs-projects.vercel.app/?finnkode=${encodeURIComponent(finnkode)}`
                        try {
                          const response = await fetch(url, { method: 'GET', mode: 'no-cors' })
                          console.log('Request sent (no-cors)')
                          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
                          const corsResponse = await fetch(proxyUrl, { method: 'GET' })
                          if (corsResponse.ok) {
                            const proxyData = await corsResponse.json()
                            const data = JSON.parse(proxyData.contents)
                            if (data && data.ad && data.ad.Prisantydning) {
                              setHousePrice(data.ad.Prisantydning)
                            } else {
                              console.error('Price not found in response structure')
                            }
                          } else {
                            console.error('CORS proxy request failed:', corsResponse.status, corsResponse.statusText)
                          }
                        } catch (error) {
                          console.error('Network error:', error)
                          alert(`CORS error occurred. Please:\n1. Visit the URL directly: ${url}\n2. Copy the Prisantydning value\n3. Paste it into the House Price field`)
                        }
                      }}
                    >
                      Fetch
                    </Button>
                  </div>
                  {finnkode && (
                    <p className="text-[11px] text-gray-500 mt-1 break-all">
                      URL: https://pyfinn-git-vercelready-mocialovs-projects.vercel.app/?finnkode={encodeURIComponent(finnkode)}
                    </p>
                  )}
                </div>

                {/* Property Status Report (merged) */}
                <div>
                  <Label htmlFor="propertyUrl">Property Status Report URL</Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="propertyUrl"
                      type="text"
                      value={propertyUrl}
                      onChange={(e) => setPropertyUrl(e.target.value)}
                      placeholder="Paste PDF or page URL with inspection details"
                      className="flex-1"
                      disabled={isPropertyLoading}
                    />
                    <Button
                      type="button"
                      variant="default"
                      disabled={!propertyUrl || isPropertyLoading}
                      onClick={async () => {
                        if (!propertyUrl) return
                        setIsPropertyLoading(true)
                        setPropertyResponse('')
                        try {
                          const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
                          if (!apiKey) {
                            setPropertyResponse('Missing API key. Define VITE_OPENROUTER_API_KEY in your .env file (never commit real keys).')
                            return
                          }
                          const trimmed = propertyUrl.trim()
                          const prompt = `Read this property report and summarize all the things that are wrong with this property. Please, using your own reasoning, estimate the individual cost for each problem identified and provide total estimated cost at the end in NOK. The property is located in Norway, Oslo. Here is the document: ${trimmed}`
                          const payload = { model: 'google/gemma-3n-e2b-it:free', messages: [{ role: 'user', content: prompt }] }
                          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                            body: JSON.stringify(payload)
                          })
                          if (!response.ok) {
                            const text = await response.text().catch(() => '')
                            setPropertyResponse(`Error ${response.status}: ${response.statusText}\n${text}`)
                            return
                          }
                          const data = await response.json()
                          const aiText = data?.choices?.[0]?.message?.content || 'No content returned.'
                          setPropertyResponse(aiText)
                        } catch (error) {
                          console.error('Property status request error:', error)
                          setPropertyResponse(`Network Error: ${error.message}`)
                        } finally {
                          setIsPropertyLoading(false)
                        }
                      }}
                    >
                      {isPropertyLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </div>
                  {propertyUrl && (
                    <p className="text-[11px] text-gray-500 mt-1 break-all">Document URL: {propertyUrl}</p>
                  )}
                </div>

                {/* House Price */}
                <div>
                  <Label htmlFor="housePrice">House Price ({currency})</Label>
                  <Input
                    id="housePrice"
                    type="number"
                    value={housePrice}
                    onChange={(e) => setHousePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                {/* Granted Loan */}
                <div>
                  <Label htmlFor="grantedLoan">Granted Loan ({currency})</Label>
                  <Input
                    id="grantedLoan"
                    type="number"
                    value={grantedLoan}
                    onChange={(e) => setGrantedLoan(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                {/* Interest / Term */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Analysis Output Inside Card */}
                {(propertyUrl || propertyResponse || isPropertyLoading) && (
                  <div className="space-y-2">
                    <div className="border-t border-gray-200 pt-4" />
                    <div>
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Property Report Analysis
                      </h3>
                      <div className="mt-2 p-3 bg-gray-50 border rounded-md min-h-[120px] max-h-[400px] overflow-auto">
                        {isPropertyLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-500 text-sm">Analyzing property report...</span>
                          </div>
                        ) : propertyResponse ? (
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{propertyResponse}</pre>
                        ) : (
                          <p className="text-[11px] text-gray-500">No analysis yet. Provide a URL and press Analyze.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section: Current Mortgages (moved above Individual Cash) */}
            <div className="border-t border-gray-200 my-4" />
            <h2 className="text-sm font-semibold text-gray-700 px-1 flex items-center gap-2">
              <Banknote className="h-4 w-4 text-gray-500" /> Current Mortgages
            </h2>
            <Card className={`${currentStep === 0 ? 'block' : 'hidden'} lg:block`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Current Flat Details
                </CardTitle>
                <CardDescription>Current flat sale and individual mortgage shares</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="flatSalePrice">Current Flat Sale Price ({currency})</Label>
                  <Input
                    id="flatSalePrice"
                    type="number"
                    value={flatSalePrice}
                    onChange={(e) => setFlatSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1"
                    placeholder="Enter expected sale price"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personAExistingMortgage">{aName} Mortgage Share ({currency})</Label>
                    <Input
                      id="personAExistingMortgage"
                      type="number"
                      value={personAExistingMortgage}
                      onChange={(e) => setPersonAExistingMortgage(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1 bg-red-50 border-red-200"
                      placeholder={`${aName}'s share of mortgage`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="personBExistingMortgage">{bName} Mortgage Share ({currency})</Label>
                    <Input
                      id="personBExistingMortgage"
                      type="number"
                      value={personBExistingMortgage}
                      onChange={(e) => setPersonBExistingMortgage(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1 bg-red-50 border-red-200"
                      placeholder={`${bName}'s share of mortgage`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personAFlatShare">{aName} Flat Sale Share (%)</Label>
                    <Input
                      id="personAFlatShare"
                      type="number"
                      step="0.1"
                      value={personAFlatShare}
                      onChange={(e) => setPersonAFlatShare(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personBFlatShare">{bName} Flat Sale Share (%)</Label>
                    <Input
                      id="personBFlatShare"
                      type="number"
                      step="0.1"
                      value={personBFlatShare}
                      onChange={(e) => setPersonBFlatShare(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personAColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personAColor }}>{aName} Net Proceeds</p>
                    <p className="text-lg font-bold" style={{ color: personAColor }}>{formatCurrency(calculations.personANetProceeds)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personAColor, 0.9) }}>
                      {formatCurrency(calculations.personAGrossShare)} - {formatCurrency(personAExistingMortgage)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personBColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personBColor }}>{bName} Net Proceeds</p>
                    <p className="text-lg font-bold" style={{ color: personBColor }}>{formatCurrency(calculations.personBNetProceeds)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personBColor, 0.9) }}>
                      {formatCurrency(calculations.personBGrossShare)} - {formatCurrency(personBExistingMortgage)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section: Cash */}
            <div className="border-t border-gray-200 my-4" />
            <h2 className="text-sm font-semibold text-gray-700 px-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" /> Individual Cash
            </h2>
            <Card className={`${currentStep === 1 ? 'block' : 'hidden'} lg:block`}>
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
                    <Label htmlFor="personACash">{aName} Cash ({currency})</Label>
                    <Input
                      id="personACash"
                      type="number"
                      value={personACash}
                      onChange={(e) => setPersonACash(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personBCash">{bName} Cash ({currency})</Label>
                    <Input
                      id="personBCash"
                      type="number"
                      value={personBCash}
                      onChange={(e) => setPersonBCash(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contributions moved into Cash section (step 2) */}
            <Card className={`${currentStep === 2 ? 'block' : 'hidden'} lg:block`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Contributions to New Mortgage
                </CardTitle>
                <CardDescription>Editable - how much each person contributes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="personAContribution">{aName} Contribution ({currency})</Label>
                  <Input
                    id="personAContribution"
                    type="number"
                    value={personAContribution}
                    onChange={(e) => setPersonAContribution(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 bg-orange-50 border-orange-200"
                    placeholder={`Max: ${formatCurrency(calculations.personAMaxContribution)}`}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Max available: {formatCurrency(calculations.personAMaxContribution)} 
                    (Cash: {formatCurrency(personACash)} + Net Flat: {formatCurrency(calculations.personANetProceeds)})
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="personBContribution">{bName} Contribution ({currency})</Label>
                  <Input
                    id="personBContribution"
                    type="number"
                    value={personBContribution}
                    onChange={(e) => setPersonBContribution(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 bg-orange-50 border-orange-200"
                    placeholder={`Max: ${formatCurrency(calculations.personBMaxContribution)}`}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Max available: {formatCurrency(calculations.personBMaxContribution)} 
                    (Cash: {formatCurrency(personBCash)} + Net Flat: {formatCurrency(calculations.personBNetProceeds)})
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Contribution</p>
                  <p className="text-xl font-bold text-blue-800">{formatCurrency(calculations.totalContribution)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${currentStep === 4 ? 'block' : 'hidden'} lg:block`}>
              {/* Section: Other Factors */}
              <div className="border-t border-gray-200 my-4" />
              <h2 className="text-sm font-semibold text-gray-700 px-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" /> Other Factors
              </h2>
              <CardHeader>
                <CardTitle>Ownership Split</CardTitle>
                <CardDescription>How will house ownership be split?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personAHouseShare">{aName} Ownership (%)</Label>
                    <Input
                      id="personAHouseShare"
                      type="number"
                      step="0.1"
                      value={personAHouseShare}
                      onChange={(e) => setPersonAHouseShare(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1 bg-blue-50 border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personBHouseShare">{bName} Ownership (%)</Label>
                    <Input
                      id="personBHouseShare"
                      type="number"
                      step="0.1"
                      value={personBHouseShare}
                      onChange={(e) => setPersonBHouseShare(e.target.value === '' ? '' : Number(e.target.value))}
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
                      Ownership percentages ({formatPercentage(personAHouseShare + personBHouseShare)}) 
                      do not add up to 100%
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personAColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personAColor }}>{aName} House Value</p>
                    <p className="text-lg font-bold" style={{ color: personAColor }}>{formatCurrency(calculations.personAHouseValue)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personAColor, 0.9) }}>
                      {formatPercentage(personAHouseShare)} of {formatCurrency(housePrice)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personBColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personBColor }}>{bName} House Value</p>
                    <p className="text-lg font-bold" style={{ color: personBColor }}>{formatCurrency(calculations.personBHouseValue)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personBColor, 0.9) }}>
                      {formatPercentage(personBHouseShare)} of {formatCurrency(housePrice)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${currentStep === 5 ? 'block' : 'hidden'} lg:block`}>
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
                    <Label htmlFor="rentalIncome">Monthly Rental Income ({currency})</Label>
                    <Input
                      id="rentalIncome"
                      type="number"
                      value={rentalIncome}
                      onChange={(e) => setRentalIncome(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1"
                      placeholder="Enter monthly rental income"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results & Calculations */}
          <div className="space-y-6">
            <Card className="border" style={{ background: `linear-gradient(90deg, ${hexToRgba(personAColor, 0.06)}, ${hexToRgba(personAColor, 0.12)})`, borderColor: hexToRgba(personAColor, 0.4) }}>
              <CardHeader>
                <CardTitle style={{ color: personAColor }}>{aName} Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2" style={{ color: personAColor }}>
                  {formatCurrency(calculations.personAFinalPayment)}
                </div>
                <p className="text-sm" style={{ color: hexToRgba(personAColor, 0.9) }}>
                  {hasRentalUnit ? 
                    `PMT: ${formatCurrency(calculations.personAMonthlyPayment)} - Rental: ${formatCurrency(calculations.personARentalShare)}` : 
                    'Monthly mortgage payment (PMT)'
                  }
                </p>
                <p className="text-xs mt-1" style={{ color: hexToRgba(personAColor, 0.8) }}>
                  Loan Need: {formatCurrency(calculations.personALoanNeed)}
                </p>
              </CardContent>
            </Card>

            <Card className="border" style={{ background: `linear-gradient(90deg, ${hexToRgba(personBColor, 0.06)}, ${hexToRgba(personBColor, 0.12)})`, borderColor: hexToRgba(personBColor, 0.4) }}>
              <CardHeader>
                <CardTitle style={{ color: personBColor }}>{bName} Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2" style={{ color: personBColor }}>
                  {formatCurrency(calculations.personBFinalPayment)}
                </div>
                <p className="text-sm" style={{ color: hexToRgba(personBColor, 0.9) }}>
                  {hasRentalUnit ? 
                    `PMT: ${formatCurrency(calculations.personBMonthlyPayment)} - Rental: ${formatCurrency(calculations.personBRentalShare)}` : 
                    'Monthly mortgage payment (PMT)'
                  }
                </p>
                <p className="text-xs mt-1" style={{ color: hexToRgba(personBColor, 0.8) }}>
                  Loan Need: {formatCurrency(calculations.personBLoanNeed)}
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
                  Base PMT: {formatCurrency(calculations.personAMonthlyPayment + calculations.personBMonthlyPayment)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Need Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personAColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personAColor }}>{aName} Loan Need</p>
                    <p className="text-xl font-bold" style={{ color: personAColor }}>{formatCurrency(calculations.personALoanNeed)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personAColor, 0.9) }}>
                      House: {formatCurrency(calculations.personAHouseValue)} - Contribution: {formatCurrency(personAContribution)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personBColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personBColor }}>{bName} Loan Need</p>
                    <p className="text-xl font-bold" style={{ color: personBColor }}>{formatCurrency(calculations.personBLoanNeed)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personBColor, 0.9) }}>
                      House: {formatCurrency(calculations.personBHouseValue)} - Contribution: {formatCurrency(personBContribution)}
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
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personAColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personAColor }}>{aName} Cash Left</p>
                    <p className="text-xl font-bold" style={{ color: personAColor }}>{formatCurrency(calculations.personAAvailableCash)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personAColor, 0.9) }}>Available - Contributed</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(personBColor, 0.08) }}>
                    <p className="text-sm font-medium" style={{ color: personBColor }}>{bName} Cash Left</p>
                    <p className="text-xl font-bold" style={{ color: personBColor }}>{formatCurrency(calculations.personBAvailableCash)}</p>
                    <p className="text-xs" style={{ color: hexToRgba(personBColor, 0.9) }}>Available - Contributed</p>
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
                    <p className="font-medium" style={{ color: personAColor }}>{aName}</p>
                    <p>Interest: {formatCurrency(calculations.personAFirstInterest)}</p>
                    <p>Principal: {formatCurrency(calculations.personAMonthlyPayment - calculations.personAFirstInterest)}</p>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: personBColor }}>{bName}</p>
                    <p>Interest: {formatCurrency(calculations.personBFirstInterest)}</p>
                    <p>Principal: {formatCurrency(calculations.personBMonthlyPayment - calculations.personBFirstInterest)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Bottom Section - Spanning Both Columns (Property analysis removed - now inside House Details) */}
        <div className="border-t border-gray-300 my-8 pt-8">
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
                    <span className="font-semibold">{formatCurrency(calculations.totalExistingMortgage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Proceeds from Flat:</span>
                    <span className="font-semibold">{formatCurrency(calculations.totalNetProceeds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cash Available:</span>
                    <span className="font-semibold">{formatCurrency(personACash + personBCash + calculations.totalNetProceeds)}</span>
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
                    <span className="text-gray-600">{aName} contributes:</span>
                    <span className="font-semibold">{formatCurrency(personAContribution)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{bName} contributes:</span>
                    <span className="font-semibold">{formatCurrency(personBContribution)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">{aName} needs loan:</span>
                    <span className="font-semibold">{formatCurrency(calculations.personALoanNeed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{bName} needs loan:</span>
                    <span className="font-semibold">{formatCurrency(calculations.personBLoanNeed)}</span>
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
                  <span className="font-semibold">{formatCurrency((calculations.personAMonthlyPayment + calculations.personBMonthlyPayment) * loanTerm * 12 - calculations.totalLoanNeeded)}</span>
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

