import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit: Contact | null;
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactModal({ isOpen, onClose, contactToEdit }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contactToEdit?.name || "",
      phone: contactToEdit?.phone || "",
      email: contactToEdit?.email || "",
    },
  });

  const createContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/contacts', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Contact added",
        description: "The emergency contact has been added.",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add contact",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  });

  const updateContact = useMutation({
    mutationFn: async (data: { id: number, contact: ContactFormData }) => {
      const response = await apiRequest('PUT', `/api/contacts/${data.id}`, data.contact);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Contact updated",
        description: "The emergency contact has been updated.",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update contact",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    
    if (contactToEdit) {
      updateContact.mutate({ id: contactToEdit.id, contact: data });
    } else {
      createContact.mutate(data);
    }
  };

  const handleClose = () => {
    reset();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0">
        <div className="bg-secondary px-6 py-4 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex justify-between items-center">
              <span>{contactToEdit ? "Edit Emergency Contact" : "Add Emergency Contact"}</span>
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-white">
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
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          <form id="contactForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label 
                htmlFor="contactName"
                className="block text-neutral-700 text-sm font-medium mb-2"
              >
                Full Name
              </Label>
              <Input
                id="contactName"
                type="text"
                placeholder="Enter contact name"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <Label 
                htmlFor="contactPhone"
                className="block text-neutral-700 text-sm font-medium mb-2"
              >
                Phone Number
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <Label 
                htmlFor="contactEmail"
                className="block text-neutral-700 text-sm font-medium mb-2"
              >
                Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                id="cancelContactBtn"
                onClick={handleClose}
                className="bg-neutral-200 text-neutral-700 hover:bg-neutral-300 border-none mr-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                id="saveContactBtn"
                disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Contact"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
