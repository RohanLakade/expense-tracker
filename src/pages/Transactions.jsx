import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExcelJS from "exceljs/dist/exceljs.min.js";
import {
  selectTransactions,
  deleteTransaction,
} from "@/features/transactions/transactionsSlice";
import { selectCategories } from "@/features/categories/categoriesSlice";
import TransactionForm from "@/components/TransactionForm";
import "./Transactions.scss";

const ITEMS_PER_PAGE = 5;

function Transactions() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectCategories);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filterSignature = `${searchTerm}|${filterType}|${filterCategory}|${dateRange}|${customStart}|${customEnd}|${sortBy}|${sortOrder}`;
  const [prevFilterSignature, setPrevFilterSignature] =
    useState(filterSignature);

  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setCurrentPage(1);
  }

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term),
      );
    }

    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType);
    }

    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }

    if (dateRange === "custom") {
      if (customStart && customEnd) {
        const start = new Date(customStart);
        const end = new Date(customEnd);
        result = result.filter((t) => {
          const txDate = new Date(t.date);
          return txDate >= start && txDate <= end;
        });
      }
    } else if (dateRange !== "all") {
      const end = new Date();
      end.setHours(0, 0, 0, 0);
      const start = new Date(end);

      if (dateRange === "1m") start.setMonth(start.getMonth() - 1);
      if (dateRange === "3m") start.setMonth(start.getMonth() - 3);
      if (dateRange === "6m") start.setMonth(start.getMonth() - 6);
      if (dateRange === "1y") start.setFullYear(start.getFullYear() - 1);

      result = result.filter((t) => {
        const txDate = new Date(t.date);
        return txDate >= start && txDate <= end;
      });
    }

    result = [...result].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    transactions,
    searchTerm,
    filterType,
    filterCategory,
    dateRange,
    customStart,
    customEnd,
    sortBy,
    sortOrder,
  ]);

  const filteredTotals = useMemo(() => {
    return filteredTransactions.reduce(
      (totals, t) => {
        if (t.type === "income") {
          totals.income += t.amount;
        } else {
          totals.expense += t.amount;
        }
        return totals;
      },
      { income: 0, expense: 0 },
    );
  }, [filteredTransactions]);

  const savings = filteredTotals.income - filteredTotals.expense;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
  };

  const getDateRangeLabel = () => {
    if (dateRange === "all") return "All Time";
    if (dateRange === "1m") return "Last 1 Month";
    if (dateRange === "3m") return "Last 3 Months";
    if (dateRange === "6m") return "Last 6 Months";
    if (dateRange === "1y") return "Last Year";
    if (dateRange === "custom") return `Custom: ${customStart} to ${customEnd}`;
    return "All Time";
  };

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();

    const summarySheet = workbook.addWorksheet("Summary");

    const summaryRows = [
      ["Date Range", getDateRangeLabel()],
      ["Total Income", filteredTotals.income],
      ["Total Expense", filteredTotals.expense],
      ["Net Savings", savings],
    ];

    summaryRows.forEach(([label, value]) => {
      const row = summarySheet.addRow([label, value]);
      row.getCell(1).font = { bold: true };
    });

    summarySheet.addRow([]);

    const monthlyHeaderRow = summarySheet.addRow([
      "Month",
      "Income",
      "Expense",
      "Savings",
    ]);
    monthlyHeaderRow.font = { bold: true };

    const monthlyBreakdown = {};
    filteredTransactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthlyBreakdown[month]) {
        monthlyBreakdown[month] = { income: 0, expense: 0 };
      }
      monthlyBreakdown[month][t.type] += t.amount;
    });

    Object.keys(monthlyBreakdown)
      .sort()
      .forEach((month) => {
        const { income, expense } = monthlyBreakdown[month];
        const label = new Date(`${month}-01`).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        summarySheet.addRow([label, income, expense, income - expense]);
      });

    summarySheet.columns.forEach((column) => {
      column.width = 18;
    });

    const transactionsSheet = workbook.addWorksheet("Transactions");
    const headerRow = transactionsSheet.addRow([
      "Date",
      "Type",
      "Category",
      "Description",
      "Amount",
    ]);
    headerRow.font = { bold: true };

    filteredTransactions.forEach((t) => {
      transactionsSheet.addRow([
        t.date,
        t.type,
        t.category,
        t.description,
        t.amount,
      ]);
    });

    transactionsSheet.columns.forEach((column) => {
      column.width = 18;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="transactions">
      <div className="transactions__header">
        <h1>Transactions</h1>
        <div className="transactions__header-actions">
          <button
            onClick={handleExport}
            disabled={filteredTransactions.length === 0}
          >
            Export to Excel
          </button>
          <button onClick={handleAddClick}>Add Transaction</button>
        </div>
      </div>

      <div className="transactions__controls">
        <input
          type="text"
          placeholder="Search description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="1m">Last 1 Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateRange === "custom" && (
          <>
            <input
              type="date"
              aria-label="Start date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <input
              type="date"
              aria-label="End date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </>
        )}

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        <button onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      <div className="transactions__totals">
        <span>
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""}
        </span>
        <span className="transactions__totals-income">
          Income: ₹{filteredTotals.income}
        </span>
        <span className="transactions__totals-expense">
          Expense: ₹{filteredTotals.expense}
        </span>
        <span
          className={`transactions__totals-savings ${
            savings >= 0
              ? "transactions__totals-savings--positive"
              : "transactions__totals-savings--negative"
          }`}
        >
          Savings: ₹{savings}
        </span>
      </div>

      <div className="transactions__table-wrapper">
        <table className="transactions__table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.type}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>₹{transaction.amount}</td>
                <td>
                  <button onClick={() => handleEditClick(transaction)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(transaction.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && <p>No transactions found.</p>}

      {totalPages > 1 && (
        <div className="transactions__pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Previous
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {isFormOpen && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default Transactions;
