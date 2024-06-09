const commands = {
  name: "draft",
  description: "Launch draft sequence",
  default_member_permissions: 0,
  options: [
    {
      name: "number_of_players",
      description: "How much player ? (Between 1 and 12)",
      min_value: 1,
      max_value: 12,
      type: 4,
      required: true,
    },
    {
      name: "number_of_choices",
      description: "How much choices ? (Between 1 and 6)",
      min_value: 1,
      max_value: 6,
      type: 4,
      required: true,
    },
    {
      name: "rendering_images",
      description: "Render image of leaders ?",
      type: 5,
      required: false,
    },
  ],
};

module.exports = {
  data: commands,
};
