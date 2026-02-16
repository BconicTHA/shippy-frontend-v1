export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderZipCode: string;
  senderCountry: string;
  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverZipCode: string;
  receiverCountry: string;
  packageWeight: number;
  packageType: string;
  description?: string;
  status: ShipmentStatus;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export type ShipmentStatus = 
  | 'pending' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface CreateShipmentRequest {
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderZipCode: string;
  senderCountry: string;
  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverZipCode: string;
  receiverCountry: string;
  packageWeight: number;
  packageType: string;
  description?: string;
  estimatedDelivery?: string;
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
}

export interface ShipmentResponse {
  success: boolean;
  message: string;
  data?: Shipment | Shipment[];
}