import { useState, useEffect } from "react";

/**
 * Hook for managing user details modal
 */
export function useUserDetailsModal(user, isOpen) {
  const [userDetails, setUserDetails] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserDetails();
      fetchUserAddresses();
    }
  }, [isOpen, user]);

  const fetchUserDetails = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`);
      const data = await response.json();

      if (data.success) {
        const ordersResponse = await fetch(`/api/admin/orders?userId=${user.id}`);
        const ordersData = await ordersResponse.json();

        setUserDetails({
          ...data.data,
          orders: ordersData.success ? ordersData.data : [],
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserAddresses = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/admin/users/${user.id}/addresses`);
      const data = await response.json();

      if (data.success) {
        setAddresses(data.data || []);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  return {
    userDetails,
    addresses,
    isLoading,
  };
}

