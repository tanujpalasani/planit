import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";
import useAsyncAction from "../../hooks/useAsyncAction";
import TeamMemberCard from "../../components/dashboard/team/TeamMemberCard";
import AddMemberModal from "../../components/dashboard/team/AddMemberModal";
import { Button } from "../../components/ui";

function Team() {
  const { teamMembers, addTeamMember, removeTeamMember, user } = useAppContext();
  const { runAsync } = useAsyncAction();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = user?.role === "Admin";

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddMember = async (newMember) => {
    return runAsync(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
        const createdMember = addTeamMember(newMember);
        if (!createdMember) {
          throw new Error("Failed to add member");
        }

        return createdMember;
      },
      { successMessage: "Team member added successfully" },
    );
  };

  const handleDeleteMember = (memberId) => {
    removeTeamMember(memberId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Team Members
          </h1>

          <p className="text-textSecondary mt-2">
            Manage and view all team members
          </p>
        </div>

        {/* Add Member Button */}
        {isAdmin && (
          <Button
            onClick={handleOpenModal}
            leftIcon={<Plus size={18} />}
            className="hover:scale-105"
          >
            Add Member
          </Button>
        )}
      </div>

      {/* Members Grid */}
      {teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onDelete={handleDeleteMember}
            />
          ))}
        </div>
      ) : (
        <div className="
          flex flex-col items-center justify-center

          min-h-[400px]

          bg-white/5
          border-2 border-dashed border-white/10
          rounded-xl

          text-center
        ">
          <p className="text-textSecondary mb-4">
            No team members yet
          </p>

          {isAdmin && (
            <Button
              onClick={handleOpenModal}
              className="hover:scale-105"
            >
              Add First Member
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddMember={handleAddMember}
      />
    </div>
  );
}

export default Team;
