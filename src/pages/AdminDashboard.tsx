import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PropertyVerification } from "@/components/admin/PropertyVerification";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    // TODO: Add admin role check when implemented
  }, [user, navigate]);

  const { data: pendingProperties, isLoading } = useQuery({
    queryKey: ['pending-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_documents (id, doc_type, file_url),
          property_dd_answers (id, question, answer)
        `)
        .eq('status', 'PENDING_REVIEW');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Properties Pending Review</h2>
        {pendingProperties?.length === 0 ? (
          <p className="text-gray-500">No properties pending review</p>
        ) : (
          <div className="space-y-6">
            {pendingProperties?.map((property) => (
              <PropertyVerification 
                key={property.id} 
                property={property}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;