import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import TeamMemberCard from "../../components/dashboard/team/TeamMemberCard";
import AddMemberModal from "../../components/dashboard/team/AddMemberModal";

function Team() {
  const { teamMembers, setTeamMembers } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteMember = (memberId) => {
    setTeamMembers((prev) =>
      prev.filter((member) => member.id !== memberId)
    );
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            flex items-center gap-2

            px-4 py-2.5

            bg-gradient-primary
            text-white font-medium

            rounded-lg

            hover:scale-105
            hover:shadow-lg

            transition-all duration-300
          "
        >
          <Plus size={18} />
          Add Member
        </button>
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="
              px-6 py-2

              bg-gradient-primary
              text-white font-medium

              rounded-lg

              hover:scale-105

              transition-all
            "
          >
            Add First Member
          </button>
        </div>
      )}

      {/* Modal */}
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}

export default Team;
