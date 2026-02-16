"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

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

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: Address | null;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSuccess,
  address,
}: AddressModalProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const isDefault = watch("isDefault");

  useEffect(() => {
    if (address) {
      reset({
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state || "",
        zipCode: address.zipCode,
        country: address.country,
        isDefault: address.isDefault,
      });
    } else {
      reset({
        label: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
      });
    }
  }, [address, reset]);

  const onSubmit = async (data: AddressForm) => {
    try {
      setIsSubmitting(true);
      const token = session?.accessToken;

      const url = address
        ? `/api/profile/addresses/${address.id}`
        : "/api/profile/addresses";
      const method = address ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(address ? "Address updated!" : "Address added!");
        onClose();
        onSuccess();
      } else {
        toast.error("Failed to save address");
      }
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {address ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Label *</Label>
            <Input {...register("label")} placeholder="Home, Office, etc." />
            {errors.label && (
              <p className="text-sm text-red-500 mt-1">
                {errors.label.message}
              </p>
            )}
          </div>

          <div>
            <Label>Street Address *</Label>
            <Input {...register("street")} placeholder="123 Main Street" />
            {errors.street && (
              <p className="text-sm text-red-500 mt-1">
                {errors.street.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>City *</Label>
              <Input {...register("city")} placeholder="New York" />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label>State</Label>
              <Input {...register("state")} placeholder="NY" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Zip Code *</Label>
              <Input {...register("zipCode")} placeholder="10001" />
              {errors.zipCode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.zipCode.message}
                </p>
              )}
            </div>
            <div>
              <Label>Country *</Label>
              <Input {...register("country")} placeholder="USA" />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) =>
                setValue("isDefault", checked as boolean)
              }
            />
            <Label htmlFor="isDefault" className="font-normal">
              Set as default address
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : address ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
