import { Logo } from "../components/Logo";
import { IncomeInput } from "../components/IncomeInput";
import { BudgetInput } from "../components/BudgetInput";
import { ExpenseInput } from "../components/ExpenseInput";
import { ExpenseList } from "../components/ExpenseList";
import { ExpenseTotal } from "../components/ExpenseTotal";
import { BudgetWarning } from "../components/BudgetWarning";
import { BudgetStatus } from "../components/BudgetStatus";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <Logo />
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <IncomeInput />
              <BudgetInput />
            </div>
          </div>
        </div>
      </header>

      {/* Budget Warning */}
      <div className="container mx-auto px-6 py-4">
        <BudgetWarning />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Expense Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add New Expense
              </h2>
              <ExpenseInput />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Expense History
              </h2>
              <ExpenseList />
            </div>
          </div>

          {/* Right Column - Summary & Budget */}
          <div className="space-y-8">
            <ExpenseTotal />
            <BudgetStatus />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mt-16">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-white/90 font-medium">
            Made with love for better financial management
          </p>
        </div>
      </footer>
    </div>
  );
} 