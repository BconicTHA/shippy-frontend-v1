"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  updateShipmentStatus,
  deleteShipment,
} from "@/services/shipment.service";

interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ShipmentTableProps {
  shipments: Shipment[];
  isAdmin: boolean;
  onRefresh: () => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  in_transit: "bg-blue-100 text-blue-800 border-blue-300",
  out_for_delivery: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function ShipmentTable({
  shipments,
  isAdmin,
  onRefresh,
}: ShipmentTableProps) {
  const { data: session } = useSession();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (shipmentId: string, newStatus: string) => {
    if (!isAdmin) {
      toast.error("Only admins can update shipment status");
      return;
    }

    if (!session?.accessToken) {
      toast.error("You must be logged in to update status");
      return;
    }

    try {
      setUpdatingStatus(shipmentId);

      const result = await updateShipmentStatus(
        shipmentId,
        newStatus,
        session.accessToken,
      );

      if (result.success) {
        toast.success("Shipment status updated successfully");
        onRefresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update shipment status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (shipmentId: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) {
      return;
    }

    if (!session?.accessToken) {
      toast.error("You must be logged in to delete a shipment");
      return;
    }

    try {
      const result = await deleteShipment(shipmentId, session.accessToken);

      if (result.success) {
        toast.success("Shipment deleted successfully");
        onRefresh();
      } else {
        toast.error(result.error || "Failed to delete shipment");
      }
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Failed to delete shipment");
    }
  };

  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No shipments found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first shipment to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Receiver</TableHead>
            {isAdmin && <TableHead>Customer</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Est. Delivery</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-mono text-sm">
                {shipment.trackingNumber}
              </TableCell>
              <TableCell>{shipment.senderName}</TableCell>
              <TableCell>{shipment.receiverName}</TableCell>
              {isAdmin && (
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{shipment.user?.name}</div>
                    <div className="text-gray-500">{shipment.user?.email}</div>
                  </div>
                </TableCell>
              )}
              <TableCell>
                {isAdmin ? (
                  <Select
                    value={shipment.status}
                    onValueChange={(value) =>
                      handleStatusChange(shipment.id, value)
                    }
                    disabled={updatingStatus === shipment.id}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant="outline"
                    className={statusColors[shipment.status] || ""}
                  >
                    {statusLabels[shipment.status] || shipment.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(shipment.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                {shipment.estimatedDelivery
                  ? format(new Date(shipment.estimatedDelivery), "MMM dd, yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/shipments/${shipment.id}`)
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {(isAdmin || !isAdmin) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(shipment.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
