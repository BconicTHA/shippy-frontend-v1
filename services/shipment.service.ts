'use server';

import { API_URL } from '@/app/constants';
import { fetcher } from '@/lib/fetcher';

export interface CreateShipmentData {
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

export async function createShipment(data: CreateShipmentData, accessToken: string) {
  try {
    const response = await fetcher(`${API_URL}/api/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to create shipment',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Create shipment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function getUserShipments(accessToken: string, page: number = 1, pageSize: number = 10) {
  try {
    const response = await fetcher(
      `${API_URL}/api/shipments/my-shipments?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to fetch shipments',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Get shipments error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function trackShipment(trackingNumber: string) {
  try {
    const response = await fetcher(`${API_URL}/api/shipments/track/${trackingNumber}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Shipment not found',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Track shipment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function updateShipmentStatus(
  shipmentId: string,
  status: string,
  accessToken: string
) {
  try {
    const response = await fetcher(`${API_URL}/api/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to update shipment status',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Update shipment status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function deleteShipment(shipmentId: string, accessToken: string) {
  try {
    const response = await fetcher(`${API_URL}/api/shipments/${shipmentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to delete shipment',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Delete shipment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function getShipmentStats(accessToken: string) {
  try {
    const response = await fetcher(`${API_URL}/api/shipments/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to fetch shipment statistics',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Get shipment stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function getAllShipments(accessToken: string) {
  try {
    const response = await fetcher(`${API_URL}/api/shipments`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to fetch shipments',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Get all shipments error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}