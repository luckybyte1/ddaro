"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, X, Users, Receipt, Settings, FileText, DollarSign } from "lucide-react"
import { IntroAnimation } from "@/components/intro-animation"

interface Item {
  id: string
  name: string
  price: number
  assignedTo: string[]
}

interface Person {
  id: string
  name: string
}

export default function BillSplitter() {
  const [showIntro, setShowIntro] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Person 1" },
    { id: "2", name: "Person 2" },
  ])
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [serviceCharge, setServiceCharge] = useState(5)
  const [tax, setTax] = useState(10)
  const [newPersonName, setNewPersonName] = useState("")

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
  }, [])

  const addPerson = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newPersonName.trim(),
      }
      setPeople([...people, newPerson])
      setNewPersonName("")
    }
  }

  const removePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id))
    setItems(
      items.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter((pid) => pid !== id),
      })),
    )
  }

  const togglePersonSelection = (personId: string) => {
    setSelectedPeople((prev) => (prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId]))
  }

  const addItem = () => {
    if (itemName.trim() && itemPrice && selectedPeople.length > 0) {
      const newItem: Item = {
        id: Date.now().toString(),
        name: itemName,
        price: Number.parseFloat(itemPrice),
        assignedTo: [...selectedPeople],
      }
      setItems([...items, newItem])
      setItemName("")
      setItemPrice("")
      setSelectedPeople([])
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const calculatePersonTotal = (personId: string) => {
    let personSubtotal = 0
    items.forEach((item) => {
      if (item.assignedTo.includes(personId)) {
        personSubtotal += item.price / item.assignedTo.length
      }
    })
    const personServiceCharge = personSubtotal * (serviceCharge / 100)
    const personTax = (personSubtotal + personServiceCharge) * (tax / 100)
    return personSubtotal + personServiceCharge + personTax
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const serviceChargeAmount = subtotal * (serviceCharge / 100)
  const taxAmount = (subtotal + serviceChargeAmount) * (tax / 100)
  const total = subtotal + serviceChargeAmount + taxAmount

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const generatePDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill Split Summary</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #0a0a0a; color: #fafafa; }
            h1 { color: #fafafa; text-align: center; margin-bottom: 30px; font-weight: 600; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 14px; font-weight: 500; margin-bottom: 15px; color: #a1a1a1; text-transform: uppercase; letter-spacing: 0.05em; }
            .item { display: flex; justify-content: space-between; padding: 12px 16px; background: #171717; margin-bottom: 4px; border-radius: 6px; border: 1px solid #262626; }
            .person-summary { padding: 16px; background: #171717; margin-bottom: 8px; border-radius: 8px; border: 1px solid #262626; }
            .person-name { font-weight: 500; font-size: 14px; color: #fafafa; }
            .person-amount { font-size: 20px; font-weight: 600; color: #4ade80; margin-top: 4px; }
            .total-section { background: #171717; border: 1px solid #262626; color: #fafafa; padding: 24px; border-radius: 8px; text-align: center; }
            .total-amount { font-size: 32px; font-weight: 600; margin: 10px 0; color: #4ade80; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #262626; }
            th { background: #171717; font-weight: 500; color: #a1a1a1; font-size: 12px; text-transform: uppercase; }
            .shared-with { font-size: 12px; color: #737373; margin-top: 2px; }
          </style>
        </head>
        <body>
          <h1>Bill Split Summary</h1>
          
          <div class="section">
            <div class="section-title">Items Ordered</div>
            ${items
              .map(
                (item) => `
              <div class="item">
                <div>
                  <strong>${item.name}</strong>
                  <div class="shared-with">Shared by: ${item.assignedTo.map((id) => people.find((p) => p.id === id)?.name).join(", ")}</div>
                </div>
                <div>${formatCurrency(item.price)}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="section">
            <div class="section-title">Bill Breakdown</div>
            <table>
              <tr><td>Subtotal</td><td style="text-align: right;">${formatCurrency(subtotal)}</td></tr>
              <tr><td>Service Charge (${serviceCharge}%)</td><td style="text-align: right;">${formatCurrency(serviceChargeAmount)}</td></tr>
              <tr><td>Tax/PB1 (${tax}%)</td><td style="text-align: right;">${formatCurrency(taxAmount)}</td></tr>
              <tr style="font-weight: bold; font-size: 18px;"><td>Total</td><td style="text-align: right;">${formatCurrency(total)}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Individual Payments</div>
            ${people
              .map(
                (person) => `
              <div class="person-summary">
                <div class="person-name">${person.name}</div>
                <div class="person-amount">${formatCurrency(calculatePersonTotal(person.id))}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="total-section">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1a1;">Total Bill</div>
            <div class="total-amount">${formatCurrency(total)}</div>
            <div style="color: #737373; font-size: 14px;">Split between ${people.length} people</div>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #525252; font-size: 12px;">
            Generated on ${new Date().toLocaleString("id-ID")}
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <div
        className={`min-h-[100dvh] bg-background pb-safe transition-opacity duration-300 ${showIntro ? "opacity-0" : "opacity-100"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground sm:h-8 sm:w-8">
                  <DollarSign className="h-3.5 w-3.5 text-background sm:h-4 sm:w-4" />
                </div>
                <span className="text-base font-semibold text-foreground sm:text-lg">Ddaro</span>
                <Badge variant="secondary" className="hidden text-xs xs:inline-flex sm:inline-flex">
                  Bill Splitter
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePDF}
                disabled={items.length === 0}
                className="gap-1.5 bg-transparent text-xs sm:gap-2 sm:text-sm"
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Left Column - People & Items */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              {/* Manage People */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Participants</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add participant name"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addPerson()}
                      className="flex-1 text-base sm:text-sm"
                    />
                    <Button onClick={addPerson} size="sm" className="shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {people.map((person) => (
                      <div
                        key={person.id}
                        className="group flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 sm:gap-2 sm:px-3 sm:py-1.5"
                      >
                        <input
                          type="text"
                          value={person.name}
                          onChange={(e) => {
                            setPeople(people.map((p) => (p.id === person.id ? { ...p, name: e.target.value } : p)))
                          }}
                          className="w-20 bg-transparent text-sm font-medium text-foreground outline-none sm:w-24"
                        />
                        {people.length > 1 && (
                          <button
                            onClick={() => removePerson(person.id)}
                            className="text-muted-foreground transition-opacity hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Items */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Add Item</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                    <Input
                      type="text"
                      placeholder="Item name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="text-base sm:text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Price (Rp)"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Assign to</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {people.map((person) => (
                        <button
                          key={person.id}
                          onClick={() => togglePersonSelection(person.id)}
                          className={`rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
                            selectedPeople.includes(person.id)
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border bg-secondary text-secondary-foreground hover:bg-muted active:bg-muted"
                          }`}
                        >
                          {person.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={addItem}
                    disabled={!itemName.trim() || !itemPrice || selectedPeople.length === 0}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Items List */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">Items</CardTitle>
                    </div>
                    {items.length > 0 && <Badge variant="secondary">{items.length}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
                      <div className="mb-3 rounded-full bg-secondary p-3">
                        <Receipt className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
                      </div>
                      <p className="text-sm text-muted-foreground">No items added yet</p>
                      <p className="text-xs text-muted-foreground">Add items above to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-start justify-between gap-2 rounded-md border border-border bg-secondary/50 p-2.5 transition-colors hover:bg-secondary sm:items-center sm:p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="text-sm font-semibold text-accent">{formatCurrency(item.price)}</span>
                              <span className="text-xs text-muted-foreground">
                                · {item.assignedTo.map((id) => people.find((p) => p.id === id)?.name).join(", ")}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 p-1 text-muted-foreground transition-all hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-4 sm:space-y-6">
              {/* Settings */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Settings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground sm:mb-2">
                        Service (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={serviceCharge}
                        onChange={(e) => setServiceCharge(Number.parseFloat(e.target.value) || 0)}
                        className="text-base sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground sm:mb-2">
                        Tax / PB1 (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={tax}
                        onChange={(e) => setTax(Number.parseFloat(e.target.value) || 0)}
                        className="text-base sm:text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Totals */}
              {items.length > 0 && (
                <>
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-sm font-medium">Individual Totals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {people.map((person) => (
                        <div
                          key={person.id}
                          className="flex items-center justify-between rounded-md border border-border bg-secondary/50 p-2.5 sm:p-3"
                        >
                          <span className="text-sm font-medium text-foreground">{person.name}</span>
                          <span className="text-base font-semibold text-accent sm:text-lg">
                            {formatCurrency(calculatePersonTotal(person.id))}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Total Summary */}
                  <Card>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Service ({serviceCharge}%)</span>
                          <span className="font-medium text-foreground">{formatCurrency(serviceChargeAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax ({tax}%)</span>
                          <span className="font-medium text-foreground">{formatCurrency(taxAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">Total</span>
                          <span className="text-xl font-bold text-accent sm:text-2xl">{formatCurrency(total)}</span>
                        </div>
                        <p className="text-center text-xs text-muted-foreground">
                          Split between {people.length} participants
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
