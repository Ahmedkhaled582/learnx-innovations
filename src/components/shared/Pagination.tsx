import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  itemLabel?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  itemLabel = "items",
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems || 0)

  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== -1) {
      pages.push(-1)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top bg-white">
      {totalItems !== undefined && (
        <span className="text-secondary text-sm">
          Showing {startItem} to {endItem} of {totalItems} {itemLabel}
        </span>
      )}
      <nav aria-label="Table navigation">
        <ul className="pagination mb-0 gap-1 align-items-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link d-flex align-items-center justify-content-center p-0"
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #dee2e6" }}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
          </li>
          {pages.map((p, idx) => {
            if (p === -1) {
              return (
                <li key={`ellipsis-${idx}`} className="page-item disabled">
                  <span className="page-link border-0 px-2 bg-transparent text-secondary">...</span>
                </li>
              )
            }
            return (
              <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                <button
                  type="button"
                  className="page-link d-flex align-items-center justify-content-center p-0 font-medium"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    backgroundColor: currentPage === p ? "var(--bs-primary)" : "transparent",
                    color: currentPage === p ? "#fff" : "var(--bs-body-color)",
                  }}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              </li>
            )
          })}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link d-flex align-items-center justify-content-center p-0"
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #dee2e6" }}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
