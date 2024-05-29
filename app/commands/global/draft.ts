const commands = {
  name: "draft",
  description: "Launch draft sequence",
  default_member_permissions: 0,
  options: [
    {
      name: "Number of players",
      description: "How much player ?",
      type: 4,
      required: true,
    },
    {
      name: "Number of choices",
      description: "How much choices ?",
      type: 4,
      required: true,
    },
  ],
};

module.exports = {
  data: commands,
};
