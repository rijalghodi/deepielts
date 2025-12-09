// import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
// import { Button } from "./button";
// import { cn } from "@/lib/utils";

// export function Pagination({
//   currentPage,
//   totalPages,
//   onPageChange,
//   isLoading,
//   className,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   isLoading?: boolean;
//   className?: string;
// }) {
//   //   if (totalPages <= 1) return null;

//   return (
//     <div className={cn("flex items-center justify-center gap-2", className)}>
//       <Button
//         variant="outline"
//         size="icon-sm"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage <= 1 || isLoading}
//       >
//         <IconChevronLeft className="h-4 w-4" />
//         <span className="sr-only">Previous</span>
//       </Button>

//       <div className="flex items-center gap-1">
//         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//           let pageNum: number;

//           // Show pages around current page
//           if (totalPages <= 5) {
//             pageNum = i + 1;
//           } else if (currentPage <= 3) {
//             pageNum = i + 1;
//           } else if (currentPage >= totalPages - 2) {
//             pageNum = totalPages - 4 + i;
//           } else {
//             pageNum = currentPage - 2 + i;
//           }

//           if (pageNum < 1 || pageNum > totalPages) return null;

//           return (
//             <Button
//               key={pageNum}
//               variant={currentPage === pageNum ? "accent" : "outline"}
//               size="icon-sm"
//               onClick={() => onPageChange(pageNum)}
//               disabled={isLoading}
//             >
//               {pageNum}
//             </Button>
//           );
//         })}
//       </div>

//       <Button
//         variant="outline"
//         size="icon-sm"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage >= totalPages || isLoading}
//       >
//         <span className="sr-only">Next</span>
//         <IconChevronRight className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// }

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  neighbor?: number;
};
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage = 1, totalPages = 1, onPageChange, isLoading, neighbor = 1, ...props }, ref) => {
    // Clamp neighbor to a maximum of 3
    const clampedNeighbor = Math.min(neighbor, 3);

    // Generate the range of page numbers to display
    const generatePageRange = () => {
      const pages: number[] = [];
      const start = Math.max(1, currentPage - clampedNeighbor);
      const end = Math.min(totalPages, currentPage + clampedNeighbor);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add first and last pages if not already included
      if (start > 2) {
        pages.unshift(1, -1); // -1 for ellipsis
      } else if (start === 2) {
        pages.unshift(1);
      }

      if (end < totalPages - 1) {
        pages.push(-1, totalPages); // -1 for ellipsis
      } else if (end === totalPages - 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    const pageRange = generatePageRange();

    const handlePageChange = (page: number) => {
      if (page !== currentPage && page > 0 && page <= totalPages) {
        onPageChange?.(page);
      }
    };

    return (
      <div ref={ref} className={cn("flex items-center gap-2")} {...props}>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <div className="items-center gap-2 hidden sm:flex">
          {pageRange.map((page, index) =>
            page === -1 ? (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={`page-${index}`}
                variant={page === currentPage ? "accent" : "outline"}
                size="icon-sm"
                className="min-w-8 w-auto px-1"
                onClick={() => handlePageChange(page)}
                aria-label={`Page ${page}`}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";
