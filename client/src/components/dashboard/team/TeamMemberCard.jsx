import { Trash2 } from "lucide-react";

function TeamMemberCard({ member, onDelete }) {
  const getInitial = (name) => name.charAt(0).toUpperCase();

  return (
    <div className="
      bg-white/5
      border border-white/10
      backdrop-blur-xl
      rounded-xl
      p-6
      
      hover:border-white/20
      hover:bg-white/[0.07]
      
      transition-all duration-300
      
      flex items-center justify-between
      group
    ">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        
        {/* Avatar */}
        <div className="
          w-12 h-12
          rounded-full
          
          bg-gradient-primary
          flex items-center justify-center
          
          text-white font-bold text-lg
        ">
          {getInitial(member.name)}
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-white">
            {member.name}
          </h3>
          
          <p className="text-sm text-textSecondary">
            {member.email}
          </p>

          <span className="
            inline-block mt-2
            text-xs
            px-2 py-1
            
            bg-white/10
            border border-white/20
            rounded
            
            text-textSecondary
          ">
            {member.role}
          </span>
        </div>

      </div>

      {/* Right Section */}
      <button
        onClick={() => onDelete(member.id)}
        className="
          p-2 rounded-lg
          
          text-textSecondary
          hover:text-red-400
          hover:bg-red-400/10
          
          transition-all duration-300
          
          opacity-0 group-hover:opacity-100
        "
        title="Remove member"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default TeamMemberCard;
