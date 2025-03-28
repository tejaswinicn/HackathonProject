import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ContactModal } from "./ContactModal";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

export default function EmergencyContacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  // ✅ Fetch contacts from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/contacts");
      return response.json();
    },
    onSuccess: (fetchedContacts) => {
      setContacts(fetchedContacts || []);
    },
  });

  useEffect(() => {
    if (data) {
      setContacts(data);
    }
  }, [data]);

  // ✅ Mutation to add contacts
  const addContact = useMutation({
    mutationFn: async (newContact: Omit<Contact, "id">) => {
      const response = await apiRequest("POST", "/api/contacts", newContact);
      const data = await response.json();
      return data;
    },
    onSuccess: (newContact) => {
      setContacts((prevContacts) => [...prevContacts, newContact]); // Update UI
      toast({
        title: "Contact Added",
        description: "The new emergency contact has been saved.",
      });
      setIsModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add contact.",
        variant: "destructive",
      });
    },
  });

  // ✅ Mutation to delete contacts
  const deleteContact = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
      return id;
    },
    onSuccess: (id) => {
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
      toast({
        title: "Contact Deleted",
        description: "The emergency contact has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contact.",
        variant: "destructive",
      });
    },
  });

  const handleSaveContact = (contact: Omit<Contact, "id">) => {
    addContact.mutate(contact);
  };

  const handleDeleteContact = (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContact.mutate(id);
    }
  };

  // Calculate progress from contacts length (just as an example)
  const holdProgress = Math.min(contacts.length / 10, 1); // Change this logic if you need a different trigger

  // Static gradient color from red to orange
  const gradientColor = `linear-gradient(to right, #ff0000, #ffa500)`;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6" style={{ background: gradientColor }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Emergency Contacts</h2>
        <Button size="icon" variant="secondary" onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <span className="sr-only">Add contact</span>
        </Button>
      </div>

      {/* ✅ Show loading or error state */}
      {isLoading ? (
        <p className="text-center text-white">Loading contacts...</p> // Changed to text-white
      ) : error ? (
        <p className="text-center text-white">Failed to load contacts.</p> // Changed to text-white
      ) : (
        <div id="contactsList" className={contacts.length === 0 ? "text-center py-4" : ""}>
          {contacts.length === 0 ? (
            <p className="text-white">No emergency contacts added yet</p> // Changed to text-white
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="border-b border-neutral-200 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{contact.name}</p> // Changed to text-white
                  <p className="text-sm text-white">{contact.phone}</p> // Changed to text-white
                </div>
                {/* ✅ Delete Button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveContact} />
    </div>
  );
}
