import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { ITEMS_PER_PAGE_OPTIONS, ItemsPerPageOption } from '@/types/job';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: ItemsPerPageOption;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: ItemsPerPageOption) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  hasJobs: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  hasNextPage = false,
  fetchNextPage,
  hasJobs = false
}) => {
  const getPageNumbers = (): Array<number | '...'> => {
    const pageNumbers: Array<number | '...'> = [];
    
    pageNumbers.push(1);
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pageNumbers.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    
    if (end < totalPages - 1) {
      pageNumbers.push('...');
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  useEffect(() => {
     console.log("itemsPerPage",itemsPerPage);
     
  }, [])

  if (!hasJobs) return null;

  return (
    <div className="flex justify-between items-center px-4 pt-4 border-t">

      <div className="flex gap-4 items-center">
        <span>View</span>
        <Select
         
          value={`${itemsPerPage}`}
          onValueChange={(value) => {
            onItemsPerPageChange(Number(value) as ItemsPerPageOption);
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>items per page</span>
      </div>


      <div className="flex gap-2 items-center">
     
        <Button
          variant="ghost"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

  
        <div className="flex gap-1">
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                className="px-2 cursor-default"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                className="px-3"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )
          ))}
        </div>

       
        <Button
          variant="ghost"
          disabled={!hasNextPage || currentPage === totalPages}
          onClick={() => {
            onPageChange(currentPage + 1);
            fetchNextPage();
          }}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;