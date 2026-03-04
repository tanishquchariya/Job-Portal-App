import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Download } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // ✅ PROFESSIONAL DOWNLOAD HANDLER
  // ✅ CLEAN & CORRECT DOWNLOAD HANDLER
// ✅ REPLACE your handleResumeDownload with this:
const handleResumeDownload = async () => {
  if (!user?.profile?.resume) return;

  try {
    const response = await fetch("http://localhost:8000/api/v1/user/resume/download", {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = user?.profile?.resumeOriginalName || "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error("Download failed:", error);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* 🔥 Profile Card */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl my-6 p-8 shadow-sm">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto ||
                  "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                }
                alt="profile"
              />
            </Avatar>

            <div>
              <h1 className="font-semibold text-xl text-foreground">
                {user?.fullname || "User Name"}
              </h1>
              <p className="text-muted-foreground">
                {user?.profile?.bio || "No bio available"}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
          >
            <Pen />
          </Button>
        </div>

        {/* 📧 Contact Info */}
        <div className="my-6">
          <div className="flex items-center gap-3 my-2 text-muted-foreground">
            <Mail size={18} />
            <span>{user?.email || "NA"}</span>
          </div>
          <div className="flex items-center gap-3 my-2 text-muted-foreground">
            <Contact size={18} />
            <span>{user?.phoneNumber || "NA"}</span>
          </div>
        </div>

        {/* 🧠 Skills */}
        <div className="my-6">
          <h1 className="font-semibold mb-2 text-foreground">Skills</h1>

          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">NA</span>
            )}
          </div>
        </div>

        {/* 📄 Resume Section */}
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label className="text-md font-bold">Resume</Label>

          {user?.profile?.resume ? (
            <Button
              onClick={handleResumeDownload}
              className="w-fit flex items-center gap-2"
              variant="outline"
            >
              <Download size={16} />
              {user?.profile?.resumeOriginalName || "Download Resume"}
            </Button>
          ) : (
            <span className="text-muted-foreground">NA</span>
          )}
        </div>
      </div>

      {/* 🔥 Applied Jobs */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-sm mb-10">
        <h1 className="font-bold text-lg mb-4 text-foreground">
          Applied Jobs
        </h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;