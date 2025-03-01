
import React from "react";
import { UserProfile } from "@/types/checkout";

interface ContactInformationProps {
  userProfile: UserProfile;
}

export const ContactInformation: React.FC<ContactInformationProps> = ({ userProfile }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Contact Information</h2>
      <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Name</div>
            <div className="font-medium">{userProfile.first_name} {userProfile.last_name}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Email</div>
            <div className="font-medium">{userProfile.email}</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Phone</div>
          <div className="font-medium">{userProfile.phone}</div>
        </div>
      </div>
    </div>
  );
};
