import { useState } from "react";
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Not Implemented",
      description: "This feature would allow users to update their profile in a real application.",
    });
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
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Enter your name"/>

                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter your email"/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter your phone number"/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter your username"/>
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
            )}
          </CardContent>
        </Card>
      </main>
      
      <AppFooter />
    </>
  );
}
