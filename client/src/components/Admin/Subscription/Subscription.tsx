import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminApi } from "@/api/Admin.api";
import { useQuery } from "react-query";
import { PlanData } from "@/types/subscription";
import TableActionsPopover from "./SubscriptionActions";
import SubscriptionForm from "./SubscriptionForm";

export const PlanManagement: React.FC = () => {
  const [close, setClose] = useState<boolean>(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanData>()
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: () => AdminApi.getSubscriptionPlans(),
  });

  const handleEdit = (plan: PlanData) => {
    setSelectedPlan(plan)
      setClose(true)
  }
  
  return (
    <div className="p-6">
     <div className="flex justify-between">
     <h1 className="text-2xl font-bold mb-4">Plan Management</h1>
      <SubscriptionForm isDialogOpen={close}  setIsDialogOpen={setClose} initialData={selectedPlan}/>
     </div>
      <Table>
        <TableCaption>List of Available Plans</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data?.map((plan: PlanData) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>₹{plan.price}</TableCell>
                <TableCell>{plan.durationInDays} days</TableCell>
                <TableCell><TableActionsPopover  onEdit={handleEdit} plan={plan}/></TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlanManagement;
