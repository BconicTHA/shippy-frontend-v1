"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import AddressModal from "./AddressModal";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  addresses: Address[];
  onUpdate: () => void;
}

export default function AddressManager({
  addresses,
  onUpdate,
}: AddressManagerProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleDelete = async (addressId: string) => {
    if (!confirm("Delete this address?")) return;

    try {
      const token = session?.accessToken;
      const response = await fetch(`/api/profile/addresses/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Address deleted");
        onUpdate();
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const token = session?.accessToken;
      const response = await fetch(
        `/api/profile/addresses/${addressId}/default`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        toast.success("Default address updated");
        onUpdate();
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 mb-4"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Address
      </Button>

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No addresses saved yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${
                address.isDefault
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {address.label}
                    </h3>
                    {address.isDefault && (
                      <Badge className="bg-blue-600 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{address.street}</p>
                    <p>
                      {address.city}
                      {address.state && `, ${address.state}`} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={onUpdate}
        address={editingAddress}
      />
    </>
  );
}
