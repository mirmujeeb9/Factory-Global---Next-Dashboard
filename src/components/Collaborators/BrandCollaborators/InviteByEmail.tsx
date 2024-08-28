import { validateEmail } from "@/lib/utils";
import { useOrganization } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const InviteByEmail = ({ getInvites }: { getInvites: () => void }) => {
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const { organization } = useOrganization();

  const handleInvite = async () => {
    const emails = emailInput.split(",").map((email) => email.trim());
    const validEmails = emails.filter((email) => validateEmail(email));

    console.log("Valid emails: ", validEmails);

    if (validEmails.length > 0) {
      validEmails.forEach(async (eachValidEmail) => {
        console.log("Sending an email to --> ", eachValidEmail);
        organization
          ?.inviteMember({
            emailAddress: eachValidEmail,
            role: "org:employee",
          })
          .then((invite) => {
            toast.success(`Successfully sent an invite to ${eachValidEmail}`);
          })
          .catch((err) => {
            toast.error(`Couldn't send invite to ${eachValidEmail}`);
            console.log(err);
          });
      });

      await getInvites();
      setEmailInput("");
      setEmailError(null);
    } else {
      setEmailError("Please enter valid email addresses.");
    }
  };

  return (
    <div className="flex flex-col gap-y-2 mt-2">
      <Label>Email address</Label>
      <div className="flex gap-2">
        <Input
          placeholder="jes@nike.com, james@zara.com, etc."
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <Button onClick={handleInvite}>Invite</Button>
      </div>
      {emailError && <p className="text-red-500 text-[14px]">{emailError}</p>}
    </div>
  );
};

export default InviteByEmail;
