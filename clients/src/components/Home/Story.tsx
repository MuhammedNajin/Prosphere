import StoryItem from "./StoryItem";

const StorySection: React.FC = () => (
    <div className="bg-white rounded-lg p-4 mb-4">
      <div className="flex space-x-4 overflow-x-auto">
        <StoryItem isAdd label="Your story" />
        {[...["shafeeq", "najin", "Muhammed km", "sajal"]].map((name, i) => (
          <StoryItem key={i} label={name} />
        ))}
      </div>
    </div>
  );

  export default StorySection