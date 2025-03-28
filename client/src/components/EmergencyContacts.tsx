import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ContactModal } from "./ContactModal";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EmergencyContactsProps {
  className?: string;
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

export default function EmergencyContacts({ className }: EmergencyContactsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['/api/contacts'],
  });

  const deleteContact = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/contacts/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Contact deleted",
        description: "The emergency contact has been removed from the badge.",
      });
      setContactToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete contact",
        variant: "destructive"
      });
    }
  });

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = (id: number) => {
    deleteContact.mutate(id);
  };

  const handleAddContactClick = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 mb-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-24 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Emergency Contacts</h2>
        <Button 
          size="icon" 
          variant="secondary"
          onClick={handleAddContactClick}
          id="addContactBtn"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-5 h-5"
          >
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          <span className="sr-only">Add contact</span>
        </Button>
      </div>
      
      <div className="bg-neutral-100 p-3 rounded-lg mb-4">
        <h3 className="text-sm font-semibold mb-2">Badge Contact System</h3>
        <p className="text-xs text-neutral-600 mb-2">• Up to 5 emergency contacts stored on badge</p>
        <p className="text-xs text-neutral-600 mb-2">• Contact information shared during emergency alerts</p>
        <p className="text-xs text-neutral-600 mb-2">• Hierarchy of contacts for emergency notification</p>
        <p className="text-xs text-neutral-600">• Contacts synced during badge connection</p>
      </div>
      
      <div id="contactsList" className={contacts?.length === 0 ? "text-center py-4" : ""}>
        {contacts?.length === 0 ? (
          <p className="text-neutral-500">No emergency contacts added yet</p>
        ) : (
          contacts?.map((contact: Contact) => (
            <div key={contact.id} className="border-b border-neutral-200 py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-neutral-800">{contact.name}</p>
                <p className="text-sm text-neutral-600">{contact.phone}</p>
                {contact.email && (
                  <div className="flex items-center mt-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-3 h-3 mr-1 text-neutral-500"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <p className="text-xs text-neutral-500">{contact.email}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-1 text-neutral-500 hover:text-secondary contact-edit-btn"
                  onClick={() => handleEditContact(contact)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4"
                  >
                    <path d="M16 3 7 12v4h4l9-9"/>
                    <path d="M3 21h18"/>
                  </svg>
                </button>
                <AlertDialog open={contactToDelete === contact.id} onOpenChange={(open) => !open && setContactToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <button 
                      className="p-1 text-neutral-500 hover:text-danger contact-delete-btn"
                      onClick={() => setContactToDelete(contact.id)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4"
                      >
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <path d="M10 11v6"/>
                        <path d="M14 11v6"/>
                      </svg>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this contact? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contactToEdit={editingContact}
      />
    </div>
  );
}
