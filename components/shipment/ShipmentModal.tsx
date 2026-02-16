"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  Weight,
} from "lucide-react";
import { createShipment } from "@/services/shipment.service";
import { getProfile } from "@/services/profile.service";

const shipmentSchema = z.object({
  senderName: z.string().min(1, "Sender name is required"),
  senderAddress: z.string().min(1, "Sender address is required"),
  senderCity: z.string().min(1, "Sender city is required"),
  senderZipCode: z.string().min(1, "Sender zip code is required"),
  senderCountry: z.string().min(1, "Sender country is required"),
  receiverName: z.string().min(1, "Receiver name is required"),
  receiverAddress: z.string().min(1, "Receiver address is required"),
  receiverCity: z.string().min(1, "Receiver city is required"),
  receiverZipCode: z.string().min(1, "Receiver zip code is required"),
  receiverCountry: z.string().min(1, "Receiver country is required"),
  packageWeight: z.string().min(1, "Package weight is required"),
  packageType: z.string().min(1, "Package type is required"),
  description: z.string().optional(),
  estimatedDelivery: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const packageTypes = [
  "Document",
  "Parcel",
  "Electronics",
  "Clothing",
  "Food Items",
  "Fragile Items",
  "Medical Supplies",
  "Other",
];

export default function CreateShipmentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateShipmentModalProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  // Separate state for senderPhone (not part of the form schema)
  const [senderPhone, setSenderPhone] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      senderCountry: "Sri Lanka",
      receiverCountry: "Sri Lanka",
    },
  });

  const packageType = watch("packageType");

  // Fetch and prefill sender information from user profile
  useEffect(() => {
    const prefillSenderInfo = async () => {
      if (!isOpen || !session?.accessToken) return;

      try {
        setLoadingProfile(true);
        const result = await getProfile(session.accessToken);

        if (result.success && result.data) {
          const profile = result.data;

          // Prefill sender name
          if (profile.name) {
            setValue("senderName", profile.name);
          }

          // Prefill sender phone (stored in separate state, not sent to backend)
          if (profile.phone) {
            setSenderPhone(profile.phone);
          }

          if (profile.address) {
            setValue("senderAddress", profile.address);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Don't show error to user - just skip prefilling
      } finally {
        setLoadingProfile(false);
      }
    };

    prefillSenderInfo();
  }, [isOpen, session, setValue]);

  const onSubmit = async (data: ShipmentFormValues) => {
    if (!session?.accessToken) {
      toast.error("You must be logged in to create a shipment");
      return;
    }

    try {
      setIsSubmitting(true);

      // Transform data to match backend expectations
      const shipmentData = {
        ...data,
        packageWeight: parseFloat(data.packageWeight),
        estimatedDelivery: data.estimatedDelivery || undefined,
      };

      const result = await createShipment(shipmentData, session.accessToken);

      if (result.success) {
        toast.success("Shipment created successfully!");
        reset();
        setSenderPhone(""); // Clear phone state
        onClose();
        onSuccess();
      } else {
        toast.error(result.error || "Failed to create shipment");
      }
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Failed to create shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset({
      senderCountry: "Sri Lanka",
      receiverCountry: "Sri Lanka",
    });
    setSenderPhone("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6" />
              Create New Shipment
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Fill in the details to create a new shipment
              {loadingProfile && " (Loading your information...)"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pt-4">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/client/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-medium">
                  Create Shipment
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-8">
          {/* Sender Information */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <User className="w-5 h-5 text-blue-600" />
              Sender Information
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Auto-filled from your profile)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Full Name *
                </FieldLabel>
                <Input
                  {...register("senderName")}
                  placeholder="Ninthu Param"
                  disabled={loadingProfile}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.senderName && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.senderName.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Phone Number
                </FieldLabel>
                <Input
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="077 123 4567"
                  disabled={loadingProfile}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <FieldDescription className="text-xs text-gray-500 mt-1">
                  For reference only (e.g., 077 123 4567)
                </FieldDescription>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Address *
                </FieldLabel>
                <Textarea
                  {...register("senderAddress")}
                  placeholder="No 49/52, Galle Road, Colombo 06"
                  disabled={loadingProfile}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
                {errors.senderAddress && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.senderAddress.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  City *
                </FieldLabel>
                <Input
                  {...register("senderCity")}
                  placeholder="Colombo"
                  disabled={loadingProfile}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.senderCity && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.senderCity.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Postal Code *
                </FieldLabel>
                <Input
                  {...register("senderZipCode")}
                  placeholder="10000"
                  disabled={loadingProfile}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.senderZipCode && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.senderZipCode.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Country *
                </FieldLabel>
                <Input
                  {...register("senderCountry")}
                  placeholder="Sri Lanka"
                  disabled={loadingProfile}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                />
                {errors.senderCountry && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.senderCountry.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <User className="w-5 h-5 text-green-600" />
              Receiver Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Full Name *
                </FieldLabel>
                <Input
                  {...register("receiverName")}
                  placeholder="Keishini Joseph"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.receiverName && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.receiverName.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Address *
                </FieldLabel>
                <Textarea
                  {...register("receiverAddress")}
                  placeholder="No 8, Sripala Road, Batticaloa"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
                {errors.receiverAddress && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.receiverAddress.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  City *
                </FieldLabel>
                <Input
                  {...register("receiverCity")}
                  placeholder="Batticaloa"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.receiverCity && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.receiverCity.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Postal Code *
                </FieldLabel>
                <Input
                  {...register("receiverZipCode")}
                  placeholder="20000"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.receiverZipCode && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.receiverZipCode.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Country *
                </FieldLabel>
                <Input
                  {...register("receiverCountry")}
                  placeholder="Sri Lanka"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
                {errors.receiverCountry && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.receiverCountry.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Package className="w-5 h-5 text-purple-600" />
              Package Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Package Type *
                </FieldLabel>
                <Select
                  value={packageType}
                  onValueChange={(value) => setValue("packageType", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select package type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.packageType && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.packageType.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Weight className="w-4 h-4 text-purple-600" />
                  Weight (kg) *
                </FieldLabel>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  {...register("packageWeight")}
                  placeholder="2.5"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.packageWeight && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.packageWeight.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Estimated Delivery Date
                </FieldLabel>
                <Input
                  type="date"
                  {...register("estimatedDelivery")}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  min={new Date().toISOString().split("T")[0]}
                />
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Description
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Additional details about the shipment (e.g., fragile items, handling instructions)..."
                  rows={3}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-gray-300 hover:bg-gray-50 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loadingProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Create Shipment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
