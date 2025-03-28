import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
  });

  // State for form data and success message
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
  });
  const [profileName, setProfileName] = useState(""); // Holds the name to display after save

  useEffect(() => {
    // On initial load, get the profile data from localStorage
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setFormData(parsedProfile);
      setProfileName(parsedProfile.fullName); // Set profile name
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Save formData in local storage (for persistence)
    localStorage.setItem("userProfile", JSON.stringify(formData));

    // Update profileName state to display the saved name
    setProfileName(formData.fullName);

    // Toast message for confirmation
    toast({
      title: "Profile Saved",
      description: `Your profile details have been saved successfully. Welcome, ${formData.fullName}!`,
    });
  };

  const handleLogout = () => {
    // Clear profile data from local storage and reset state
    localStorage.removeItem("userProfile");
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      username: "",
    });
    setProfileName(""); // Reset profile name

    // Show toast and redirect to home page
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    setLocation("/"); // Redirect to home page
  };

  return (
    <>
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Manage your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-1/2 mx-auto" />
              </div>
            ) : (
              <>
                {profileName && (
                  <div className="text-center mb-4">
                    <p className="text-lg font-bold">Hello, {profileName}!</p>
                  </div>
                )}
                <form onSubmit={handleSaveProfile}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Enter your name" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        placeholder="Enter your email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber" 
                        placeholder="Enter your phone number" 
                        value={formData.phoneNumber} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        placeholder="Enter your username" 
                        value={formData.username} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setLocation("/")}
                      >
                        Back
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </div>
                </form>

                {/* Centered Logout Button */}
                <div className="flex justify-center mt-6">
                  <Button
                    variant="destructive"
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>

              </>
            )}
          </CardContent>
        </Card>
      </main>
      
      <AppFooter />
    </>
  );
}
